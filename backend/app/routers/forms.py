"""Public form submissions. Rate limited, validated, stored, and acknowledged with a reference."""
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import AnimalInterest, AnimalListing, ContactMessage, Event, EventRegistration, NewsletterSubscriber, Partnership, Volunteer
from ..schemas import Ack, AnimalInterestIn, ContactIn, EventRegistrationIn, FundraiserIn, NewsletterIn, PartnershipIn, VolunteerIn
from ..utils.security import limiter

router = APIRouter(prefix="/api", tags=["forms"])


def ref(prefix: str, id_: uuid.UUID) -> str:
    return f"{prefix}-{id_.hex[:8].upper()}"


@router.post("/volunteers", response_model=Ack, status_code=201)
@limiter.limit("5/minute")
def apply_volunteer(request: Request, body: VolunteerIn, db: Session = Depends(get_db)):
    v = Volunteer(name=body.name, email=body.email, phone=body.phone, age=body.age, city=body.city, skills=body.skills, interests=body.interests,
                  preferred_programme=body.programme, availability=body.availability, message=body.message, code_of_conduct_accepted_at=datetime.now(timezone.utc))
    db.add(v); db.commit()
    return Ack(reference=ref("VOL", v.id))


@router.post("/partnerships", response_model=Ack, status_code=201)
@limiter.limit("5/minute")
def partnership(request: Request, body: PartnershipIn, db: Session = Depends(get_db)):
    p = Partnership(company=body.company, contact_person=body.contact_person, email=body.email, phone=body.phone, interest=body.interest, budget_range=body.budget, message=body.message)
    db.add(p); db.commit()
    return Ack(reference=ref("CSR", p.id))


@router.post("/contact", response_model=Ack, status_code=201)
@limiter.limit("5/minute")
def contact(request: Request, body: ContactIn, db: Session = Depends(get_db)):
    if body.website:  # honeypot filled in → silently accept, store nothing
        return Ack(reference="MSG-OK")
    m = ContactMessage(name=body.name, email=body.email, phone=body.phone, subject=body.subject, message=body.message)
    db.add(m); db.commit()
    return Ack(reference=ref("MSG", m.id))


@router.post("/newsletter", response_model=Ack, status_code=201)
@limiter.limit("5/minute")
def newsletter(request: Request, body: NewsletterIn, db: Session = Depends(get_db)):
    existing = db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == body.email))
    if not existing:
        existing = NewsletterSubscriber(email=body.email)
        db.add(existing); db.commit()
    # Double opt-in email is sent by a background job; the response never reveals whether the address existed.
    return Ack(reference=ref("SUB", existing.id))


@router.post("/animals/interest", response_model=Ack, status_code=201)
@limiter.limit("5/minute")
def animal_interest(request: Request, body: AnimalInterestIn, db: Session = Depends(get_db)):
    if not db.get(AnimalListing, body.animal_id):
        raise HTTPException(404, "Animal not found")
    a = AnimalInterest(listing_id=body.animal_id, interest_type=body.type, name=body.name, email=body.email, phone=body.phone, city=body.city, home_type=body.home, message=body.message)
    db.add(a); db.commit()
    return Ack(reference=ref("ADP", a.id))


@router.post("/events/{event_id}/register", response_model=Ack, status_code=201)
@limiter.limit("10/minute")
def register_event(request: Request, event_id: uuid.UUID, body: EventRegistrationIn, db: Session = Depends(get_db)):
    e = db.get(Event, event_id)
    if not e or not e.registration_open:
        raise HTTPException(400, "Registration is closed for this event")
    r = db.scalar(select(EventRegistration).where(EventRegistration.event_id == event_id, EventRegistration.email == body.email))
    if not r:
        r = EventRegistration(event_id=event_id, name=body.name, email=body.email, phone=body.phone, as_volunteer=body.as_volunteer)
        db.add(r); db.commit()
    return Ack(reference=ref("EVT", r.id))


@router.post("/fundraisers/interest", response_model=Ack, status_code=201)
@limiter.limit("5/minute")
def fundraiser_interest(request: Request, body: FundraiserIn, db: Session = Depends(get_db)):
    """Until self-serve fundraiser pages ship, requests land in the contact inbox tagged for the team."""
    m = ContactMessage(name=body.name, email=body.email, phone=body.phone, subject=f"Fundraiser request: {body.cause} ({body.goal})", message=body.message or "(no message)")
    db.add(m); db.commit()
    return Ack(reference=ref("FUN", m.id))
