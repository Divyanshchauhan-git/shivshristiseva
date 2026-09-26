-- Shivshristi Seva Sansthan — PostgreSQL schema
-- Generated from app/models (SQLAlchemy). Use Alembic migrations for changes: `alembic revision --autogenerate`.
-- Money is stored as whole rupees (BIGINT). Gateways receive paise (x100).
BEGIN;

CREATE TYPE publish_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'finance', 'content_manager', 'volunteer_coordinator');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE partnership_status AS ENUM ('new', 'contacted', 'proposal', 'discussion', 'active', 'closed');
CREATE TYPE volunteer_status AS ENUM ('new', 'reviewed', 'shortlisted', 'approved', 'rejected', 'completed');
CREATE TYPE payment_status AS ENUM ('created', 'pending', 'success', 'failed', 'cancelled', 'refunded');

CREATE TABLE contact_messages (
	id UUID NOT NULL, 
	name VARCHAR(120) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	phone VARCHAR(20), 
	subject VARCHAR(120) NOT NULL, 
	message TEXT NOT NULL, 
	status VARCHAR(20) NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);
CREATE INDEX ix_contact_messages_created_at ON contact_messages (created_at);
CREATE INDEX ix_contact_messages_status ON contact_messages (status);

CREATE TABLE donors (
	id UUID NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	name VARCHAR(120) NOT NULL, 
	phone VARCHAR(20) NOT NULL, 
	pan VARCHAR(10), 
	address TEXT, 
	city VARCHAR(80), 
	state VARCHAR(80), 
	pincode VARCHAR(6), 
	marketing_opt_in BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);
CREATE INDEX ix_donors_email ON donors (email);

CREATE TABLE newsletter_subscribers (
	id UUID NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	confirmed BOOLEAN NOT NULL, 
	unsubscribed_at TIMESTAMP WITH TIME ZONE, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (email)
);

CREATE TABLE programmes (
	id UUID NOT NULL, 
	slug VARCHAR(80) NOT NULL, 
	title VARCHAR(120) NOT NULL, 
	short VARCHAR(200) NOT NULL, 
	summary TEXT NOT NULL, 
	problem TEXT NOT NULL, 
	approach JSONB NOT NULL, 
	what_we_do JSONB NOT NULL, 
	who_we_support JSONB NOT NULL, 
	activities JSONB NOT NULL, 
	locations JSONB NOT NULL, 
	sensitive_note TEXT, 
	theme VARCHAR(30) NOT NULL, 
	icon VARCHAR(40) NOT NULL, 
	hero_image_url VARCHAR(500), 
	sort_order INTEGER NOT NULL, 
	status publish_status NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);
CREATE UNIQUE INDEX ix_programmes_slug ON programmes (slug);
CREATE INDEX ix_programmes_status ON programmes (status);

CREATE TABLE site_settings (
	key VARCHAR(60) NOT NULL, 
	value JSONB NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (key)
);

CREATE TABLE users (
	id UUID NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	name VARCHAR(120) NOT NULL, 
	password_hash VARCHAR(255) NOT NULL, 
	role user_role NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	mfa_secret VARCHAR(64), 
	failed_logins INTEGER NOT NULL, 
	locked_until TIMESTAMP WITH TIME ZONE, 
	last_login_at TIMESTAMP WITH TIME ZONE, 
	token_version INTEGER NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);
CREATE INDEX ix_users_role ON users (role);
CREATE UNIQUE INDEX ix_users_email ON users (email);

CREATE TABLE audit_logs (
	id BIGSERIAL NOT NULL, 
	at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	actor_id UUID, 
	actor_email VARCHAR(255), 
	action VARCHAR(80) NOT NULL, 
	entity_type VARCHAR(60) NOT NULL, 
	entity_id VARCHAR(64), 
	ip VARCHAR(64), 
	changes JSONB, 
	PRIMARY KEY (id), 
	FOREIGN KEY(actor_id) REFERENCES users (id) ON DELETE SET NULL
);
CREATE INDEX ix_audit_logs_at ON audit_logs (at);
CREATE INDEX ix_audit_logs_entity_type ON audit_logs (entity_type);
CREATE INDEX ix_audit_logs_actor_id ON audit_logs (actor_id);

CREATE TABLE campaigns (
	id UUID NOT NULL, 
	slug VARCHAR(120) NOT NULL, 
	title VARCHAR(160) NOT NULL, 
	description VARCHAR(400) NOT NULL, 
	story JSONB NOT NULL, 
	why_needed JSONB NOT NULL, 
	programme_id UUID NOT NULL, 
	category VARCHAR(30) NOT NULL, 
	goal_amount BIGINT NOT NULL, 
	raised_amount BIGINT NOT NULL, 
	supporters_count INTEGER NOT NULL, 
	start_date DATE NOT NULL, 
	end_date DATE NOT NULL, 
	image_url VARCHAR(500), 
	is_urgent BOOLEAN NOT NULL, 
	is_featured BOOLEAN NOT NULL, 
	status campaign_status NOT NULL, 
	updates JSONB NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(programme_id) REFERENCES programmes (id) ON DELETE RESTRICT
);
CREATE INDEX ix_campaigns_category ON campaigns (category);
CREATE INDEX ix_campaigns_status_end ON campaigns (status, end_date);
CREATE INDEX ix_campaigns_programme_id ON campaigns (programme_id);
CREATE UNIQUE INDEX ix_campaigns_slug ON campaigns (slug);
CREATE INDEX ix_campaigns_status ON campaigns (status);
CREATE INDEX ix_campaigns_end_date ON campaigns (end_date);

CREATE TABLE documents (
	id UUID NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	category VARCHAR(40) NOT NULL, 
	period VARCHAR(40), 
	storage_key VARCHAR(500), 
	public_note VARCHAR(300), 
	is_verified BOOLEAN NOT NULL, 
	verified_by UUID, 
	verified_at TIMESTAMP WITH TIME ZONE, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(verified_by) REFERENCES users (id) ON DELETE SET NULL
);
CREATE INDEX ix_documents_category ON documents (category);
CREATE INDEX ix_documents_is_verified ON documents (is_verified);

CREATE TABLE events (
	id UUID NOT NULL, 
	slug VARCHAR(160) NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	category VARCHAR(40) NOT NULL, 
	programme_id UUID, 
	starts_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	ends_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	location VARCHAR(255) NOT NULL, 
	description TEXT NOT NULL, 
	volunteers_needed INTEGER, 
	registration_open BOOLEAN NOT NULL, 
	status publish_status NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(programme_id) REFERENCES programmes (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX ix_events_slug ON events (slug);
CREATE INDEX ix_events_starts_at ON events (starts_at);

CREATE TABLE gallery_albums (
	id UUID NOT NULL, 
	title VARCHAR(160) NOT NULL, 
	programme_id UUID, 
	album_date DATE NOT NULL, 
	kind VARCHAR(10) NOT NULL, 
	is_published BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(programme_id) REFERENCES programmes (id) ON DELETE SET NULL
);
CREATE INDEX ix_gallery_albums_is_published ON gallery_albums (is_published);
CREATE INDEX ix_gallery_albums_programme_id ON gallery_albums (programme_id);

CREATE TABLE partnerships (
	id UUID NOT NULL, 
	company VARCHAR(160) NOT NULL, 
	contact_person VARCHAR(120) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	phone VARCHAR(20) NOT NULL, 
	interest VARCHAR(80) NOT NULL, 
	budget_range VARCHAR(40) NOT NULL, 
	message TEXT, 
	status partnership_status NOT NULL, 
	notes TEXT, 
	owner_id UUID, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(owner_id) REFERENCES users (id) ON DELETE SET NULL
);
CREATE INDEX ix_partnerships_company ON partnerships (company);
CREATE INDEX ix_partnerships_status ON partnerships (status);

CREATE TABLE stories (
	id UUID NOT NULL, 
	slug VARCHAR(160) NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	excerpt VARCHAR(400) NOT NULL, 
	body JSONB NOT NULL, 
	impact VARCHAR(300), 
	category VARCHAR(30) NOT NULL, 
	kind VARCHAR(20) NOT NULL, 
	programme_id UUID, 
	location VARCHAR(120), 
	author VARCHAR(120) NOT NULL, 
	tags JSONB NOT NULL, 
	image_url VARCHAR(500), 
	consent VARCHAR(20) NOT NULL, 
	consent_record_ref VARCHAR(120), 
	publish_at TIMESTAMP WITH TIME ZONE, 
	status publish_status NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(programme_id) REFERENCES programmes (id) ON DELETE SET NULL
);
CREATE INDEX ix_stories_status ON stories (status);
CREATE INDEX ix_stories_publish_at ON stories (publish_at);
CREATE INDEX ix_stories_category ON stories (category);
CREATE UNIQUE INDEX ix_stories_slug ON stories (slug);
CREATE INDEX ix_stories_programme_id ON stories (programme_id);
CREATE INDEX ix_stories_kind ON stories (kind);

CREATE TABLE volunteers (
	id UUID NOT NULL, 
	name VARCHAR(120) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	phone VARCHAR(20) NOT NULL, 
	age INTEGER, 
	city VARCHAR(80) NOT NULL, 
	skills VARCHAR(300) NOT NULL, 
	interests JSONB NOT NULL, 
	preferred_programme VARCHAR(80) NOT NULL, 
	availability VARCHAR(80) NOT NULL, 
	message TEXT, 
	status volunteer_status NOT NULL, 
	assigned_programme_id UUID, 
	assigned_role VARCHAR(80), 
	internal_notes TEXT, 
	code_of_conduct_accepted_at TIMESTAMP WITH TIME ZONE, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(assigned_programme_id) REFERENCES programmes (id) ON DELETE SET NULL
);
CREATE INDEX ix_volunteers_email ON volunteers (email);
CREATE INDEX ix_volunteers_status ON volunteers (status);

CREATE TABLE animal_cases (
	id UUID NOT NULL, 
	case_no VARCHAR(30) NOT NULL, 
	case_type VARCHAR(40) NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	area VARCHAR(120) NOT NULL, 
	exact_location VARCHAR(255), 
	case_date DATE NOT NULL, 
	animals_count INTEGER NOT NULL, 
	status VARCHAR(20) NOT NULL, 
	vet_partner VARCHAR(160), 
	cost BIGINT, 
	notes TEXT, 
	campaign_id UUID, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (case_no), 
	FOREIGN KEY(campaign_id) REFERENCES campaigns (id) ON DELETE SET NULL
);
CREATE INDEX ix_animal_cases_case_type ON animal_cases (case_type);
CREATE INDEX ix_animal_cases_status ON animal_cases (status);
CREATE INDEX ix_animal_cases_case_date ON animal_cases (case_date);

CREATE TABLE donations (
	id UUID NOT NULL, 
	reference VARCHAR(32) NOT NULL, 
	donor_id UUID NOT NULL, 
	campaign_id UUID, 
	cause VARCHAR(40) NOT NULL, 
	amount BIGINT NOT NULL, 
	currency VARCHAR(3) NOT NULL, 
	frequency VARCHAR(10) NOT NULL, 
	method VARCHAR(20), 
	status payment_status NOT NULL, 
	gateway VARCHAR(20) NOT NULL, 
	gateway_order_id VARCHAR(64), 
	gateway_payment_id VARCHAR(64), 
	gateway_subscription_id VARCHAR(64), 
	is_anonymous BOOLEAN NOT NULL, 
	wants_tax_receipt BOOLEAN NOT NULL, 
	receipt_number VARCHAR(40), 
	receipt_sent_at TIMESTAMP WITH TIME ZONE, 
	paid_at TIMESTAMP WITH TIME ZONE, 
	failure_reason VARCHAR(255), 
	client_ip VARCHAR(64), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(donor_id) REFERENCES donors (id) ON DELETE RESTRICT, 
	FOREIGN KEY(campaign_id) REFERENCES campaigns (id) ON DELETE SET NULL, 
	UNIQUE (gateway_order_id), 
	UNIQUE (gateway_payment_id), 
	UNIQUE (receipt_number)
);
CREATE INDEX ix_donations_cause ON donations (cause);
CREATE INDEX ix_donations_donor_id ON donations (donor_id);
CREATE UNIQUE INDEX ix_donations_reference ON donations (reference);
CREATE INDEX ix_donations_paid_at ON donations (paid_at);
CREATE INDEX ix_donations_campaign_id ON donations (campaign_id);
CREATE INDEX ix_donations_gateway_subscription_id ON donations (gateway_subscription_id);
CREATE INDEX ix_donations_status_paid ON donations (status, paid_at);
CREATE INDEX ix_donations_status ON donations (status);

CREATE TABLE event_registrations (
	id UUID NOT NULL, 
	event_id UUID NOT NULL, 
	name VARCHAR(120) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	phone VARCHAR(20) NOT NULL, 
	as_volunteer BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	CONSTRAINT uq_event_registration_email UNIQUE (event_id, email), 
	FOREIGN KEY(event_id) REFERENCES events (id) ON DELETE CASCADE
);
CREATE INDEX ix_event_registrations_event_id ON event_registrations (event_id);

CREATE TABLE gallery_media (
	id UUID NOT NULL, 
	album_id UUID NOT NULL, 
	storage_key VARCHAR(500) NOT NULL, 
	media_type VARCHAR(10) NOT NULL, 
	caption VARCHAR(300), 
	alt_text VARCHAR(300) NOT NULL, 
	width INTEGER, 
	height INTEGER, 
	consent_confirmed BOOLEAN NOT NULL, 
	sort_order INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(album_id) REFERENCES gallery_albums (id) ON DELETE CASCADE
);
CREATE INDEX ix_gallery_media_album_id ON gallery_media (album_id);

CREATE TABLE impact_metrics (
	id UUID NOT NULL, 
	metric_key VARCHAR(60) NOT NULL, 
	label VARCHAR(120) NOT NULL, 
	value BIGINT NOT NULL, 
	period_start DATE NOT NULL, 
	period_end DATE NOT NULL, 
	programme_id UUID, 
	location VARCHAR(120), 
	is_verified BOOLEAN NOT NULL, 
	source_document_id UUID, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(programme_id) REFERENCES programmes (id) ON DELETE SET NULL, 
	FOREIGN KEY(source_document_id) REFERENCES documents (id) ON DELETE SET NULL
);
CREATE INDEX ix_impact_metrics_location ON impact_metrics (location);
CREATE INDEX ix_impact_metrics_is_verified ON impact_metrics (is_verified);
CREATE INDEX ix_impact_metrics_metric_key ON impact_metrics (metric_key);
CREATE INDEX ix_impact_period ON impact_metrics (period_start, period_end);
CREATE INDEX ix_impact_metrics_programme_id ON impact_metrics (programme_id);

CREATE TABLE animal_listings (
	id UUID NOT NULL, 
	animal_code VARCHAR(30) NOT NULL, 
	name VARCHAR(60) NOT NULL, 
	species VARCHAR(20) NOT NULL, 
	age_estimate VARCHAR(30) NOT NULL, 
	gender VARCHAR(10), 
	area VARCHAR(120) NOT NULL, 
	health_status VARCHAR(255) NOT NULL, 
	is_vaccinated BOOLEAN NOT NULL, 
	is_sterilised BOOLEAN NOT NULL, 
	adoption_status VARCHAR(40) NOT NULL, 
	temperament VARCHAR(120), 
	description TEXT NOT NULL, 
	images JSONB NOT NULL, 
	case_id UUID, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(case_id) REFERENCES animal_cases (id) ON DELETE SET NULL
);
CREATE INDEX ix_animal_listings_adoption_status ON animal_listings (adoption_status);
CREATE INDEX ix_animal_listings_species ON animal_listings (species);
CREATE UNIQUE INDEX ix_animal_listings_animal_code ON animal_listings (animal_code);

CREATE TABLE payment_events (
	id VARCHAR(80) NOT NULL, 
	event_type VARCHAR(60) NOT NULL, 
	donation_id UUID, 
	payload JSONB NOT NULL, 
	received_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(donation_id) REFERENCES donations (id) ON DELETE SET NULL
);
CREATE INDEX ix_payment_events_donation_id ON payment_events (donation_id);

CREATE TABLE animal_interests (
	id UUID NOT NULL, 
	listing_id UUID NOT NULL, 
	interest_type VARCHAR(10) NOT NULL, 
	name VARCHAR(120) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	phone VARCHAR(20) NOT NULL, 
	city VARCHAR(80) NOT NULL, 
	home_type VARCHAR(80) NOT NULL, 
	message TEXT, 
	status VARCHAR(20) NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(listing_id) REFERENCES animal_listings (id) ON DELETE CASCADE
);
CREATE INDEX ix_animal_interests_listing_id ON animal_interests (listing_id);

-- Extra indexes for common queries
CREATE INDEX ix_donors_email_lower ON donors (lower(email));
CREATE INDEX ix_stories_published ON stories (publish_at DESC) WHERE status = 'published';
CREATE INDEX ix_campaigns_active ON campaigns (end_date) WHERE status = 'active';

-- Audit log is append-only for the application role
-- REVOKE UPDATE, DELETE ON audit_logs FROM udaan_app;
COMMIT;
