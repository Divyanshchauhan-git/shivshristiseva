import { useForm } from '@/hooks/useForm';
import { formsApi } from '@/services/api';
import { email, maxLen, phoneIN, required } from '@/utils/validate';
import { Checkbox, SelectField, TextArea, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { Animal, NGOEvent } from '@/types';
import { FormError, FormSuccess, PrivacyLine } from './FormStatus';

/** Adoption / foster interest. The team follows up with a call and home visit. */
export function AnimalInterestModal({ animal, type, onClose }: { animal: Animal | null; type: 'adopt' | 'foster'; onClose: () => void }) {
  const f = useForm({ name: '', email: '', phone: '', city: '', home: '', message: '' }, {
    name: [required('Your name')], email: [required('Email'), email], phone: [required('Phone'), phoneIN], city: [required('City')], home: [required('Home type')], message: [maxLen(1000, 'Message')],
  });
  const close = () => { onClose(); setTimeout(f.reset, 200); };
  const verb = type === 'adopt' ? 'Adopt' : 'Foster';
  return (
    <Modal open={!!animal} onClose={close} title={animal ? `${verb} ${animal.name}` : ''} description="Share a few details. We will call you to talk about the animal's needs and arrange a home visit.">
      {animal && (f.submit.status === 'success' ? (
        <FormSuccess title="Interest received" text={`Thank you for opening your home to ${animal.name}. Our animal welfare team will call you within two working days.`} reference={f.submit.reference} />
      ) : (
        <form noValidate onSubmit={f.handleSubmit((v) => formsApi.animalInterest({ ...v, animalId: animal.id, type }))} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Name" autoComplete="name" {...f.bind('name')} />
            <TextField label="Phone" type="tel" autoComplete="tel" {...f.bind('phone')} />
            <TextField label="Email" type="email" autoComplete="email" {...f.bind('email')} />
            <TextField label="City" autoComplete="address-level2" {...f.bind('city')} />
          </div>
          <SelectField label="Home type" placeholder="Choose one" options={['Independent house', 'Apartment', 'Apartment with pet-friendly society rules', 'Other']} {...f.bind('home')} />
          <TextArea label="Tell us about your experience with animals" optional rows={3} {...f.bind('message')} />
          <FormError submit={f.submit} />
          <PrivacyLine />
          <Button type="submit" className="w-full" loading={f.submit.status === 'submitting'}>Send {verb.toLowerCase()} request</Button>
        </form>
      ))}
    </Modal>
  );
}

export function EventRegistrationForm({ event }: { event: NGOEvent }) {
  const f = useForm({ name: '', email: '', phone: '', asVolunteer: false }, { name: [required('Name')], email: [required('Email'), email], phone: [required('Phone'), phoneIN] });
  if (f.submit.status === 'success') return <FormSuccess title="You're registered" text={`We've saved your place for ${event.title}. We'll send details and directions before the day.`} reference={f.submit.reference} />;
  return (
    <form noValidate onSubmit={f.handleSubmit((v) => formsApi.eventRegistration({ ...v, eventId: event.id }))} className="space-y-4" aria-label={`Register for ${event.title}`}>
      <TextField label="Name" autoComplete="name" {...f.bind('name')} />
      <TextField label="Email" type="email" autoComplete="email" {...f.bind('email')} />
      <TextField label="Phone" type="tel" autoComplete="tel" {...f.bind('phone')} />
      {event.volunteersNeeded ? <Checkbox checked={f.values.asVolunteer} onChange={(v) => f.set('asVolunteer', v)} label="I'd like to help as a volunteer at this event" /> : null}
      <FormError submit={f.submit} />
      <Button type="submit" className="w-full" loading={f.submit.status === 'submitting'}>Register</Button>
      <PrivacyLine />
    </form>
  );
}

export function FundraiserForm() {
  const f = useForm({ name: '', email: '', phone: '', cause: '', goal: '', message: '' }, {
    name: [required('Name')], email: [required('Email'), email], phone: [required('Phone'), phoneIN], cause: [required('Cause')], goal: [required('Goal')], message: [maxLen(1000, 'Message')],
  });
  if (f.submit.status === 'success') return <FormSuccess title="Fundraiser request received" text="We'll review your request, confirm the cause and help you set up your fundraiser page." reference={f.submit.reference} onReset={f.reset} />;
  return (
    <form noValidate onSubmit={f.handleSubmit((v) => formsApi.fundraiserInterest(v))} className="space-y-4" aria-label="Start a fundraiser">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Your name" autoComplete="name" {...f.bind('name')} />
        <TextField label="Email" type="email" autoComplete="email" {...f.bind('email')} />
        <TextField label="Phone" type="tel" autoComplete="tel" {...f.bind('phone')} />
        <SelectField label="Cause" placeholder="Choose a cause" options={['Education', 'Women Empowerment', 'Healthcare', 'Food & Essentials', 'Animal Welfare', 'Emergency Relief', 'Environment', 'General Fund']} {...f.bind('cause')} />
        <SelectField label="Fundraising goal" placeholder="Choose a goal" options={['₹10,000', '₹25,000', '₹50,000', '₹1,00,000', 'More than ₹1,00,000']} {...f.bind('goal')} className="sm:col-span-2" />
      </div>
      <TextArea label="Occasion or message" optional rows={3} placeholder="Birthday, marathon, office drive, in memory of…" {...f.bind('message')} />
      <FormError submit={f.submit} />
      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={f.submit.status === 'submitting'}>Request a fundraiser page</Button>
    </form>
  );
}
