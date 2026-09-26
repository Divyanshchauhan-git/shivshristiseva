"""Read-only public content. Responses are cacheable at the CDN (short TTL + stale-while-revalidate)."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Campaign, CampaignStatus, Document, Event, GalleryAlbum, ImpactMetric, Programme, PublishStatus, Story, AnimalListing
from ..models import SiteSetting
from ..schemas import AlbumOut, CampaignOut, EventOut, ImpactOut, ProgrammeOut, StoryOut

router = APIRouter(prefix="/api", tags=["public"])


def cache(resp: Response, seconds: int = 60) -> None:
    resp.headers["Cache-Control"] = f"public, max-age={seconds}, stale-while-revalidate=300"


@router.get("/programmes", response_model=list[ProgrammeOut], response_model_by_alias=True)
def list_programmes(resp: Response, db: Session = Depends(get_db)):
    cache(resp, 300)
    return db.scalars(select(Programme).where(Programme.status == PublishStatus.published).order_by(Programme.sort_order)).all()


@router.get("/programmes/{slug}", response_model=ProgrammeOut, response_model_by_alias=True)
def get_programme(slug: str, resp: Response, db: Session = Depends(get_db)):
    p = db.scalar(select(Programme).where(Programme.slug == slug, Programme.status == PublishStatus.published))
    if not p:
        raise HTTPException(404, "Programme not found")
    cache(resp, 300)
    return p


@router.get("/campaigns", response_model=list[CampaignOut], response_model_by_alias=True)
def list_campaigns(resp: Response, category: str | None = None, include_closed: bool = False, db: Session = Depends(get_db)):
    q = select(Campaign).where(Campaign.status.in_([CampaignStatus.active, CampaignStatus.completed] if include_closed else [CampaignStatus.active]))
    if category:
        q = q.where(Campaign.category == category)
    cache(resp, 60)
    return db.scalars(q.order_by(Campaign.is_urgent.desc(), Campaign.end_date)).all()


@router.get("/campaigns/{slug}", response_model=CampaignOut, response_model_by_alias=True)
def get_campaign(slug: str, resp: Response, db: Session = Depends(get_db)):
    c = db.scalar(select(Campaign).where(Campaign.slug == slug, Campaign.status.in_([CampaignStatus.active, CampaignStatus.completed, CampaignStatus.paused])))
    if not c:
        raise HTTPException(404, "Campaign not found")
    cache(resp, 30)
    return c


def _published_story():
    now = datetime.now(timezone.utc)
    return or_(Story.status == PublishStatus.published, (Story.status == PublishStatus.scheduled) & (Story.publish_at <= now))


@router.get("/stories", response_model=list[StoryOut], response_model_by_alias=True)
def list_stories(resp: Response, category: str | None = None, kind: str | None = None, page: int = Query(1, ge=1), size: int = Query(12, le=50), db: Session = Depends(get_db)):
    q = select(Story).where(_published_story())
    if category:
        q = q.where(Story.category == category)
    if kind:
        q = q.where(Story.kind == kind)
    cache(resp, 120)
    return db.scalars(q.order_by(Story.publish_at.desc()).offset((page - 1) * size).limit(size)).all()


@router.get("/stories/{slug}", response_model=StoryOut, response_model_by_alias=True)
def get_story(slug: str, resp: Response, db: Session = Depends(get_db)):
    s = db.scalar(select(Story).where(Story.slug == slug, _published_story()))
    if not s:
        raise HTTPException(404, "Story not found")
    cache(resp, 300)
    return s


@router.get("/events", response_model=list[EventOut], response_model_by_alias=True)
def list_events(when: str = "upcoming", db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    q = select(Event).where(Event.status == PublishStatus.published)
    q = q.where(Event.starts_at >= now).order_by(Event.starts_at) if when == "upcoming" else q.where(Event.starts_at < now).order_by(Event.starts_at.desc())
    return db.scalars(q).all()


@router.get("/events/{slug}", response_model=EventOut, response_model_by_alias=True)
def get_event(slug: str, db: Session = Depends(get_db)):
    e = db.scalar(select(Event).where(Event.slug == slug, Event.status == PublishStatus.published))
    if not e:
        raise HTTPException(404, "Event not found")
    return e


@router.get("/gallery/albums", response_model=list[AlbumOut], response_model_by_alias=True)
def list_albums(programme: str | None = None, db: Session = Depends(get_db)):
    q = select(GalleryAlbum).where(GalleryAlbum.is_published.is_(True))
    if programme:
        q = q.join(Programme, GalleryAlbum.programme_id == Programme.id).where(Programme.slug == programme)
    return db.scalars(q.order_by(GalleryAlbum.album_date.desc())).all()


@router.get("/animals/listings")
def list_animals(status: str | None = None, db: Session = Depends(get_db)):
    """Public listing never exposes animal_cases.exact_location."""
    q = select(AnimalListing)
    if status:
        q = q.where(AnimalListing.adoption_status == status)
    rows = db.scalars(q).all()
    return [{"id": a.id, "code": a.animal_code, "name": a.name, "species": a.species, "ageEstimate": a.age_estimate, "gender": a.gender, "area": a.area,
             "status": a.adoption_status, "health": a.health_status, "vaccinated": a.is_vaccinated, "sterilised": a.is_sterilised,
             "temperament": a.temperament, "description": a.description, "images": a.images} for a in rows]


@router.get("/impact", response_model=list[ImpactOut], response_model_by_alias=True)
def impact(year: int | None = None, programme: str | None = None, location: str | None = None, db: Session = Depends(get_db)):
    """Returns only VERIFIED metrics. Unverified figures are never served publicly."""
    q = select(ImpactMetric).where(ImpactMetric.is_verified.is_(True))
    if year:
        q = q.where(ImpactMetric.period_end >= datetime(year - 1, 4, 1).date(), ImpactMetric.period_end <= datetime(year, 3, 31).date())
    if programme:
        q = q.join(Programme, ImpactMetric.programme_id == Programme.id).where(Programme.slug == programme)
    if location:
        q = q.where(ImpactMetric.location == location)
    return db.scalars(q).all()


@router.get("/documents")
def documents(db: Session = Depends(get_db)):
    from ..services.storage import public_url
    rows = db.scalars(select(Document).order_by(Document.category)).all()
    return [{"id": d.id, "title": d.title, "category": d.category, "period": d.period, "verified": d.is_verified, "note": d.public_note,
             "url": public_url(d.storage_key) if d.is_verified and d.storage_key else None} for d in rows]


@router.get("/faqs")
def faqs(resp: Response, db: Session = Depends(get_db)):
    """FAQs are edited in admin Settings and stored as a site setting."""
    cache(resp, 600)
    row = db.get(SiteSetting, "faqs")
    return row.value.get("items", []) if row else []


@router.get("/updates")
def updates(db: Session = Depends(get_db)):
    """Latest activity for the home page: newest campaign updates and upcoming events."""
    items = []
    for c in db.scalars(select(Campaign).where(Campaign.status == CampaignStatus.active)):
        for u in c.updates[:1]:
            items.append({"id": f"c-{c.id}", "kind": "Campaign", "title": u.get("title"), "date": u.get("date"), "to": f"/campaigns/{c.slug}"})
    now = datetime.now(timezone.utc)
    for e in db.scalars(select(Event).where(Event.status == PublishStatus.published, Event.starts_at >= now).order_by(Event.starts_at).limit(3)):
        items.append({"id": f"e-{e.id}", "kind": "Event", "title": e.title, "date": e.starts_at.date().isoformat(), "to": f"/events/{e.slug}"})
    return sorted(items, key=lambda x: x["date"] or "", reverse=True)[:5]
