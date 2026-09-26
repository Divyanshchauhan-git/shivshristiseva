"""SQLAlchemy 2.0 models. Run `alembic revision --autogenerate` to produce migrations; see also db/schema.sql."""
import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    JSON, BigInteger, Boolean, Date, DateTime, Enum, ForeignKey, Index, Integer, String, Text, UniqueConstraint, Uuid, func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base

JsonType = JSON().with_variant(JSONB(), "postgresql")


def uid() -> uuid.UUID:
    return uuid.uuid4()


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ---------------------------------------------------------------- enums
class Role(str, enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    finance = "finance"
    content_manager = "content_manager"
    volunteer_coordinator = "volunteer_coordinator"


class PublishStatus(str, enum.Enum):
    draft = "draft"
    scheduled = "scheduled"
    published = "published"
    archived = "archived"


class CampaignStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    paused = "paused"
    completed = "completed"
    archived = "archived"


class PaymentStatus(str, enum.Enum):
    created = "created"
    pending = "pending"
    success = "success"
    failed = "failed"
    cancelled = "cancelled"
    refunded = "refunded"


class VolunteerStatus(str, enum.Enum):
    new = "New"
    reviewed = "Reviewed"
    shortlisted = "Shortlisted"
    approved = "Approved"
    rejected = "Rejected"
    completed = "Completed"


class PartnershipStatus(str, enum.Enum):
    new = "New"
    contacted = "Contacted"
    proposal = "Proposal"
    discussion = "Discussion"
    active = "Active"
    closed = "Closed"


# ---------------------------------------------------------------- users & audit
class User(TimestampMixin, Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(Enum(Role, name="user_role"), index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    mfa_secret: Mapped[str | None] = mapped_column(String(64))  # TOTP secret, encrypted at rest
    failed_logins: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    token_version: Mapped[int] = mapped_column(Integer, default=0)  # bump to revoke all sessions


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    actor_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    actor_email: Mapped[str | None] = mapped_column(String(255))
    action: Mapped[str] = mapped_column(String(80))
    entity_type: Mapped[str] = mapped_column(String(60), index=True)
    entity_id: Mapped[str | None] = mapped_column(String(64))
    ip: Mapped[str | None] = mapped_column(String(64))
    changes: Mapped[dict | None] = mapped_column(JsonType)


# ---------------------------------------------------------------- content
class Programme(TimestampMixin, Base):
    __tablename__ = "programmes"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(120))
    short: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str] = mapped_column(Text)
    problem: Mapped[str] = mapped_column(Text)
    approach: Mapped[list] = mapped_column(JsonType, default=list)
    what_we_do: Mapped[list] = mapped_column(JsonType, default=list)
    who_we_support: Mapped[list] = mapped_column(JsonType, default=list)
    activities: Mapped[list] = mapped_column(JsonType, default=list)
    locations: Mapped[list] = mapped_column(JsonType, default=list)
    sensitive_note: Mapped[str | None] = mapped_column(Text)
    theme: Mapped[str] = mapped_column(String(30))
    icon: Mapped[str] = mapped_column(String(40))
    hero_image_url: Mapped[str | None] = mapped_column(String(500))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[PublishStatus] = mapped_column(Enum(PublishStatus, name="publish_status"), default=PublishStatus.draft, index=True)
    campaigns: Mapped[list["Campaign"]] = relationship(back_populates="programme")


class Campaign(TimestampMixin, Base):
    __tablename__ = "campaigns"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(String(400))
    story: Mapped[list] = mapped_column(JsonType, default=list)
    why_needed: Mapped[list] = mapped_column(JsonType, default=list)
    programme_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("programmes.id", ondelete="RESTRICT"), index=True)
    category: Mapped[str] = mapped_column(String(30), index=True)
    goal_amount: Mapped[int] = mapped_column(BigInteger)  # whole rupees
    # raised/supporters are DERIVED from successful donations (materialised for speed, recomputed by webhook handler)
    raised_amount: Mapped[int] = mapped_column(BigInteger, default=0)
    supporters_count: Mapped[int] = mapped_column(Integer, default=0)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date, index=True)
    image_url: Mapped[str | None] = mapped_column(String(500))
    is_urgent: Mapped[bool] = mapped_column(Boolean, default=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[CampaignStatus] = mapped_column(Enum(CampaignStatus, name="campaign_status"), default=CampaignStatus.draft, index=True)
    updates: Mapped[list] = mapped_column(JsonType, default=list)
    programme: Mapped[Programme] = relationship(back_populates="campaigns")
    __table_args__ = (Index("ix_campaigns_status_end", "status", "end_date"),)


class Story(TimestampMixin, Base):
    __tablename__ = "stories"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    excerpt: Mapped[str] = mapped_column(String(400))
    body: Mapped[list] = mapped_column(JsonType, default=list)
    impact: Mapped[str | None] = mapped_column(String(300))
    category: Mapped[str] = mapped_column(String(30), index=True)
    kind: Mapped[str] = mapped_column(String(20), index=True)
    programme_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("programmes.id", ondelete="SET NULL"), index=True)
    location: Mapped[str | None] = mapped_column(String(120))  # general area only
    author: Mapped[str] = mapped_column(String(120))
    tags: Mapped[list] = mapped_column(JsonType, default=list)
    image_url: Mapped[str | None] = mapped_column(String(500))
    consent: Mapped[str] = mapped_column(String(20))  # 'recorded' | 'anonymised'
    consent_record_ref: Mapped[str | None] = mapped_column(String(120))  # pointer to signed consent form (private storage)
    publish_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)
    status: Mapped[PublishStatus] = mapped_column(Enum(PublishStatus, name="publish_status"), default=PublishStatus.draft, index=True)


class Event(TimestampMixin, Base):
    __tablename__ = "events"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(40))
    programme_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("programmes.id", ondelete="SET NULL"))
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    location: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    volunteers_needed: Mapped[int | None] = mapped_column(Integer)
    registration_open: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[PublishStatus] = mapped_column(Enum(PublishStatus, name="publish_status"), default=PublishStatus.draft)


class EventRegistration(Base):
    __tablename__ = "event_registrations"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    event_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("events.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(20))
    as_volunteer: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("event_id", "email", name="uq_event_registration_email"),)


class GalleryAlbum(TimestampMixin, Base):
    __tablename__ = "gallery_albums"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    title: Mapped[str] = mapped_column(String(160))
    programme_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("programmes.id", ondelete="SET NULL"), index=True)
    album_date: Mapped[date] = mapped_column(Date)
    kind: Mapped[str] = mapped_column(String(10))  # photo | video
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    media: Mapped[list["GalleryMedia"]] = relationship(back_populates="album", cascade="all, delete-orphan", order_by="GalleryMedia.sort_order")


class GalleryMedia(Base):
    __tablename__ = "gallery_media"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    album_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("gallery_albums.id", ondelete="CASCADE"), index=True)
    storage_key: Mapped[str] = mapped_column(String(500))
    media_type: Mapped[str] = mapped_column(String(10))  # image | video
    caption: Mapped[str | None] = mapped_column(String(300))
    alt_text: Mapped[str] = mapped_column(String(300))
    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    consent_confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    album: Mapped[GalleryAlbum] = relationship(back_populates="media")


class ImpactMetric(TimestampMixin, Base):
    __tablename__ = "impact_metrics"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    metric_key: Mapped[str] = mapped_column(String(60), index=True)  # people_supported, children_reached...
    label: Mapped[str] = mapped_column(String(120))
    value: Mapped[int] = mapped_column(BigInteger)
    period_start: Mapped[date] = mapped_column(Date)
    period_end: Mapped[date] = mapped_column(Date)
    programme_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("programmes.id", ondelete="SET NULL"), index=True)
    location: Mapped[str | None] = mapped_column(String(120), index=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    source_document_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("documents.id", ondelete="SET NULL"))
    __table_args__ = (Index("ix_impact_period", "period_start", "period_end"),)


class Document(TimestampMixin, Base):
    __tablename__ = "documents"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    title: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(40), index=True)
    period: Mapped[str | None] = mapped_column(String(40))
    storage_key: Mapped[str | None] = mapped_column(String(500))
    public_note: Mapped[str | None] = mapped_column(String(300))
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    verified_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


# ---------------------------------------------------------------- donations
class Donor(TimestampMixin, Base):
    __tablename__ = "donors"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    email: Mapped[str] = mapped_column(String(255), index=True)
    name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(20))
    pan: Mapped[str | None] = mapped_column(String(10))  # encrypt at rest (pgcrypto / app-level)
    address: Mapped[str | None] = mapped_column(Text)
    city: Mapped[str | None] = mapped_column(String(80))
    state: Mapped[str | None] = mapped_column(String(80))
    pincode: Mapped[str | None] = mapped_column(String(6))
    marketing_opt_in: Mapped[bool] = mapped_column(Boolean, default=False)
    donations: Mapped[list["Donation"]] = relationship(back_populates="donor")


class Donation(TimestampMixin, Base):
    """One row per payment attempt. Status changes ONLY from verified gateway events."""
    __tablename__ = "donations"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    reference: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    donor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("donors.id", ondelete="RESTRICT"), index=True)
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("campaigns.id", ondelete="SET NULL"), index=True)
    cause: Mapped[str] = mapped_column(String(40), index=True)
    amount: Mapped[int] = mapped_column(BigInteger)  # whole rupees; gateway receives paise
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    frequency: Mapped[str] = mapped_column(String(10), default="one-time")
    method: Mapped[str | None] = mapped_column(String(20))
    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus, name="payment_status"), default=PaymentStatus.created, index=True)
    gateway: Mapped[str] = mapped_column(String(20))
    gateway_order_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    gateway_payment_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    gateway_subscription_id: Mapped[str | None] = mapped_column(String(64), index=True)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    wants_tax_receipt: Mapped[bool] = mapped_column(Boolean, default=False)
    receipt_number: Mapped[str | None] = mapped_column(String(40), unique=True)
    receipt_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)
    failure_reason: Mapped[str | None] = mapped_column(String(255))
    client_ip: Mapped[str | None] = mapped_column(String(64))
    donor: Mapped[Donor] = relationship(back_populates="donations")
    __table_args__ = (Index("ix_donations_status_paid", "status", "paid_at"),)


class PaymentEvent(Base):
    """Raw, idempotent log of verified webhook events (dedupe on gateway event id)."""
    __tablename__ = "payment_events"
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    event_type: Mapped[str] = mapped_column(String(60))
    donation_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("donations.id", ondelete="SET NULL"), index=True)
    payload: Mapped[dict] = mapped_column(JsonType)
    received_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


# ---------------------------------------------------------------- people
class Volunteer(TimestampMixin, Base):
    __tablename__ = "volunteers"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(20))
    age: Mapped[int | None] = mapped_column(Integer)
    city: Mapped[str] = mapped_column(String(80))
    skills: Mapped[str] = mapped_column(String(300))
    interests: Mapped[list] = mapped_column(JsonType, default=list)
    preferred_programme: Mapped[str] = mapped_column(String(80))
    availability: Mapped[str] = mapped_column(String(80))
    message: Mapped[str | None] = mapped_column(Text)
    status: Mapped[VolunteerStatus] = mapped_column(Enum(VolunteerStatus, name="volunteer_status"), default=VolunteerStatus.new, index=True)
    assigned_programme_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("programmes.id", ondelete="SET NULL"))
    assigned_role: Mapped[str | None] = mapped_column(String(80))
    internal_notes: Mapped[str | None] = mapped_column(Text)
    code_of_conduct_accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Partnership(TimestampMixin, Base):
    __tablename__ = "partnerships"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    company: Mapped[str] = mapped_column(String(160), index=True)
    contact_person: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(20))
    interest: Mapped[str] = mapped_column(String(80))
    budget_range: Mapped[str] = mapped_column(String(40))
    message: Mapped[str | None] = mapped_column(Text)
    status: Mapped[PartnershipStatus] = mapped_column(Enum(PartnershipStatus, name="partnership_status"), default=PartnershipStatus.new, index=True)
    notes: Mapped[str | None] = mapped_column(Text)
    owner_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))


class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(20))
    subject: Mapped[str] = mapped_column(String(120))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="New", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    confirmed: Mapped[bool] = mapped_column(Boolean, default=False)  # double opt-in
    unsubscribed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


# ---------------------------------------------------------------- animals
class AnimalCase(TimestampMixin, Base):
    """Rescue cases and drives (vaccination, sterilisation, feeding, vet support, shelter partnership)."""
    __tablename__ = "animal_cases"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    case_no: Mapped[str] = mapped_column(String(30), unique=True)
    case_type: Mapped[str] = mapped_column(String(40), index=True)
    title: Mapped[str] = mapped_column(String(200))
    area: Mapped[str] = mapped_column(String(120))
    exact_location: Mapped[str | None] = mapped_column(String(255))  # staff-only, never exposed publicly
    case_date: Mapped[date] = mapped_column(Date, index=True)
    animals_count: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(20), index=True)
    vet_partner: Mapped[str | None] = mapped_column(String(160))
    cost: Mapped[int | None] = mapped_column(BigInteger)
    notes: Mapped[str | None] = mapped_column(Text)
    campaign_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("campaigns.id", ondelete="SET NULL"))


class AnimalListing(TimestampMixin, Base):
    __tablename__ = "animal_listings"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    animal_code: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(60))
    species: Mapped[str] = mapped_column(String(20), index=True)
    age_estimate: Mapped[str] = mapped_column(String(30))
    gender: Mapped[str | None] = mapped_column(String(10))
    area: Mapped[str] = mapped_column(String(120))  # general area only
    health_status: Mapped[str] = mapped_column(String(255))
    is_vaccinated: Mapped[bool] = mapped_column(Boolean, default=False)
    is_sterilised: Mapped[bool] = mapped_column(Boolean, default=False)
    adoption_status: Mapped[str] = mapped_column(String(40), index=True)
    temperament: Mapped[str | None] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    images: Mapped[list] = mapped_column(JsonType, default=list)
    case_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("animal_cases.id", ondelete="SET NULL"))


class AnimalInterest(Base):
    __tablename__ = "animal_interests"
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uid)
    listing_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("animal_listings.id", ondelete="CASCADE"), index=True)
    interest_type: Mapped[str] = mapped_column(String(10))  # adopt | foster
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(20))
    city: Mapped[str] = mapped_column(String(80))
    home_type: Mapped[str] = mapped_column(String(80))
    message: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="New")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class SiteSetting(Base):
    __tablename__ = "site_settings"
    key: Mapped[str] = mapped_column(String(60), primary_key=True)
    value: Mapped[dict] = mapped_column(JsonType)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# re-export for Alembic autogenerate
__all__ = [n for n in dir() if not n.startswith("_")]
