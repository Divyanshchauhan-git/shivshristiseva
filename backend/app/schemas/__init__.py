"""Pydantic request/response schemas. JSON uses camelCase to match the frontend types (src/types)."""
import re
import uuid
from datetime import date, datetime
from typing import Annotated, Literal

from pydantic import AfterValidator, BaseModel, ConfigDict, EmailStr, Field, field_validator
from pydantic.alias_generators import to_camel

PHONE_RE = re.compile(r"^(\+91|0091|0)?[6-9]\d{9}$")
PAN_RE = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]$")


class Camel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True, str_strip_whitespace=True)


def _phone(v: str) -> str:
    d = re.sub(r"[\s-]", "", v)
    if not PHONE_RE.match(d):
        raise ValueError("Enter a 10-digit Indian mobile number")
    return d[-10:]


Phone = Annotated[str, AfterValidator(_phone)]


# ------------------------------------------------------------ public content
class ProgrammeOut(Camel):
    id: uuid.UUID
    slug: str
    title: str
    short: str
    summary: str
    problem: str
    approach: list[str]
    what_we_do: list[dict]
    who_we_support: list[str]
    activities: list[str]
    locations: list[str]
    sensitive: str | None = Field(default=None, validation_alias="sensitive_note")
    theme: str
    icon: str
    status: str


class CampaignOut(Camel):
    id: uuid.UUID
    slug: str
    title: str
    description: str
    story: list[str]
    why_needed: list[str]
    category: str
    goal: int = Field(validation_alias="goal_amount")
    raised: int = Field(validation_alias="raised_amount")
    supporters: int = Field(validation_alias="supporters_count")
    start_date: date
    end_date: date
    urgent: bool = Field(validation_alias="is_urgent")
    featured: bool = Field(validation_alias="is_featured")
    status: str
    updates: list[dict]
    image: str | None = Field(default=None, validation_alias="image_url")


class StoryOut(Camel):
    id: uuid.UUID
    slug: str
    title: str
    excerpt: str
    body: list[str]
    impact: str | None
    category: str
    kind: str
    location: str | None
    author: str
    tags: list[str]
    consent: str
    date: datetime | None = Field(default=None, validation_alias="publish_at")


class EventOut(Camel):
    id: uuid.UUID
    slug: str
    title: str
    category: str
    starts_at: datetime
    ends_at: datetime
    location: str
    description: str
    volunteers_needed: int | None
    registration_open: bool


class GalleryMediaOut(Camel):
    id: uuid.UUID
    storage_key: str
    media_type: str
    caption: str | None
    alt_text: str


class AlbumOut(Camel):
    id: uuid.UUID
    title: str
    album_date: date
    kind: str
    media: list[GalleryMediaOut]


class FundraiserIn(Camel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Phone
    cause: str = Field(max_length=60)
    goal: str = Field(max_length=40)
    message: str | None = Field(default=None, max_length=1000)


class ImpactOut(Camel):
    metric_key: str
    label: str
    value: int
    period_start: date
    period_end: date
    location: str | None
    is_verified: bool


# ------------------------------------------------------------ forms
class VolunteerIn(Camel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: Phone
    age: int = Field(ge=16, le=90)
    city: str = Field(min_length=2, max_length=80)
    skills: str = Field(min_length=2, max_length=300)
    interests: list[str] = Field(min_length=1, max_length=12)
    programme: str = Field(max_length=80)
    availability: str = Field(max_length=80)
    message: str | None = Field(default=None, max_length=1000)


class PartnershipIn(Camel):
    company: str = Field(min_length=2, max_length=120)
    contact_person: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Phone
    interest: str = Field(max_length=80)
    budget: str = Field(max_length=40)
    message: str | None = Field(default=None, max_length=2000)


class ContactIn(Camel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str | None = None
    subject: str = Field(max_length=120)
    message: str = Field(min_length=10, max_length=2000)
    website: str | None = Field(default=None, description="Honeypot. Must stay empty.")

    @field_validator("phone")
    @classmethod
    def _ph(cls, v: str | None) -> str | None:
        return _phone(v) if v else None


class NewsletterIn(Camel):
    email: EmailStr


class AnimalInterestIn(Camel):
    animal_id: uuid.UUID
    type: Literal["adopt", "foster"]
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Phone
    city: str = Field(max_length=80)
    home: str = Field(max_length=80)
    message: str | None = Field(default=None, max_length=1000)


class EventRegistrationIn(Camel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Phone
    as_volunteer: bool = False


class Ack(Camel):
    ok: bool = True
    reference: str


# ------------------------------------------------------------ donations
class DonorIn(Camel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Phone
    pan: str | None = None
    address: str | None = Field(default=None, max_length=500)
    city: str | None = Field(default=None, max_length=80)
    state: str | None = Field(default=None, max_length=80)
    pincode: str | None = Field(default=None, pattern=r"^[1-9][0-9]{5}$")
    wants80_g: bool = Field(default=False, alias="wants80G")
    anonymous: bool = False

    @field_validator("pan")
    @classmethod
    def _pan(cls, v: str | None) -> str | None:
        if v is None or v == "":
            return None
        v = v.upper()
        if not PAN_RE.match(v):
            raise ValueError("PAN should look like ABCDE1234F")
        return v


class CreateOrderIn(Camel):
    cause: str = Field(max_length=40)
    campaign_slug: str | None = None
    amount: int = Field(ge=100, le=1_000_000, description="Whole rupees")
    frequency: Literal["one-time", "monthly"]
    donor: DonorIn
    method: Literal["upi", "card", "netbanking", "wallet"]
    consent: Literal[True]

    @field_validator("donor")
    @classmethod
    def _receipt_fields(cls, d: DonorIn) -> DonorIn:
        if d.wants80_g and not all([d.pan, d.address, d.city, d.state, d.pincode]):
            raise ValueError("PAN and full address are required for a tax receipt")
        return d


class CreateOrderOut(Camel):
    donation_id: uuid.UUID
    reference: str
    gateway_order_id: str
    amount: int
    currency: Literal["INR"] = "INR"
    public_key: str


class VerifyIn(BaseModel):
    gateway_order_id: str | None = None
    gateway_payment_id: str | None = None
    signature: str | None = None
    razorpay_order_id: str | None = None
    razorpay_payment_id: str | None = None
    razorpay_signature: str | None = None


class DonationStatusOut(Camel):
    donation_id: uuid.UUID
    reference: str
    status: str
    amount: int
    frequency: str
    cause: str
    created_at: datetime
    receipt_number: str | None
    donor_name: str
    donor_email: str
    method: str | None


# ------------------------------------------------------------ admin
class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)
    otp: str | None = Field(default=None, pattern=r"^\d{6}$")


class MeOut(Camel):
    id: uuid.UUID
    name: str
    email: str
    role: str
    active: bool = Field(validation_alias="is_active")
    mfa: bool = False
