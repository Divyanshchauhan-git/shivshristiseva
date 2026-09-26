import { useForm } from '@/hooks/useForm';
import { formsApi } from '@/services/api';
import { email, maxLen, phoneIN, range, required } from '@/utils/validate';
import { ChipGroup, SelectField, TextArea, TextField, Checkbox } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { programmes } from '@/data/programmes';
import { FormError, FormSuccess, PrivacyLine } from './FormStatus';

export const volunteerInterests = ['Teaching & mentoring', 'Animal care', 'Health camps', 'Field distribution', 'Events', 'Photography & media', 'Fundraising', 'Tech & data', 'Counselling', 'Emergency response'];
const availability = ['Weekday mornings', 'Weekday evenings', 'Weekends', 'Flexible', 'Remote only', 'During emergencies'];

export function VolunteerForm({ defaultProgramme = '' }: { defaultProgramme?: string }) {
  const f = useForm({
    name: '', email: '', phone: '', age: '', city: '', skills: '', interests: [] as string[], programme: defaultProgramme, availability: '', message: '', agree: false,
  }, {
    name: [required('Full name'), maxLen(80, 'Name')], email: [required('Email'), email], phone: [required('Phone'), phoneIN],
    age: [required('Age'), range(16, 90, 'Age')], city: [required('City')], skills: [required('Skills'), maxLen(300, 'Skills')],
    interests: [required('At least one interest')], programme: [required('Preferred programme')], availability: [required('Availability')],
    message: [maxLen(1000, 'Message')], agree: [required('Agreement to the code of conduct')],
  });
  if (f.submit.status === 'success') {
    return <FormSuccess title="Application received" text="Thank you for offering your time. Our volunteer coordinator will review your application and contact you about orientation." reference={f.submit.reference} onReset={f.reset} resetLabel="Submit another application" />;
  }
  return (
    <form noValidate onSubmit={f.handleSubmit(({ agree: _a, age, ...v }) => formsApi.volunteer({ ...v, age: Number(age) }))} className="space-y-5" aria-label="Volunteer application">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" autoComplete="name" {...f.bind('name')} />
        <TextField label="Email" type="email" autoComplete="email" {...f.bind('email')} />
        <TextField label="Phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91" {...f.bind('phone')} />
        <div className="grid grid-cols-[6rem_1fr] gap-3">
          <TextField label="Age" type="number" inputMode="numeric" min={16} max={90} {...f.bind('age')} hint="16+" />
          <TextField label="City" autoComplete="address-level2" {...f.bind('city')} />
        </div>
      </div>
      <TextField label="Skills" placeholder="e.g. teaching maths, driving, photography, nursing" {...f.bind('skills')} />
      <ChipGroup legend="Interests" options={volunteerInterests} value={f.values.interests} onChange={(v) => f.set('interests', v)} error={f.errors.interests} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Preferred programme" placeholder="Choose a programme" options={[...programmes.map((p) => p.title), 'Anywhere I am needed']} {...f.bind('programme')} />
        <SelectField label="Availability" placeholder="Choose availability" options={availability} {...f.bind('availability')} />
      </div>
      <TextArea label="Anything else we should know?" optional rows={3} {...f.bind('message')} />
      <Checkbox checked={f.values.agree} onChange={(v) => f.set('agree', v)} error={f.errors.agree}
        label="I agree to follow the Volunteer Code of Conduct and Safeguarding Policy." description="Roles with children or vulnerable adults need an ID and background check before starting." />
      <FormError submit={f.submit} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PrivacyLine />
        <Button type="submit" size="lg" loading={f.submit.status === 'submitting'} className="w-full sm:w-auto">Submit application</Button>
      </div>
    </form>
  );
}
