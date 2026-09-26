import { useForm } from '@/hooks/useForm';
import { formsApi } from '@/services/api';
import { email, maxLen, phoneIN, required } from '@/utils/validate';
import { SelectField, TextArea, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { FormError, FormSuccess, PrivacyLine } from './FormStatus';

export const csrInterests = ['Education', 'Women Empowerment', 'Healthcare', 'Food & Essentials', 'Livelihood & Skills', 'Animal Welfare', 'Emergency Relief', 'Environment & Community', 'Employee volunteering', 'Not sure yet'];
export const budgets = ['Under ₹5 lakh', '₹5–10 lakh', '₹10–25 lakh', '₹25 lakh+', 'Prefer to discuss'];

export function PartnershipForm() {
  const f = useForm({ company: '', contactPerson: '', email: '', phone: '', interest: '', budget: '', message: '' }, {
    company: [required('Company name'), maxLen(120, 'Company name')], contactPerson: [required('Contact person')], email: [required('Work email'), email],
    phone: [required('Phone'), phoneIN], interest: [required('Area of interest')], budget: [required('Budget range')], message: [maxLen(2000, 'Message')],
  });
  if (f.submit.status === 'success') {
    return <FormSuccess title="Thank you for reaching out" text="Our partnerships team will contact you within three working days to understand your goals and share a proposal." reference={f.submit.reference} onReset={f.reset} resetLabel="Send another enquiry" />;
  }
  return (
    <form noValidate onSubmit={f.handleSubmit((v) => formsApi.partnership(v))} className="space-y-4" aria-label="CSR partnership enquiry">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Company name" autoComplete="organization" {...f.bind('company')} />
        <TextField label="Contact person" autoComplete="name" {...f.bind('contactPerson')} />
        <TextField label="Work email" type="email" autoComplete="email" {...f.bind('email')} />
        <TextField label="Phone" type="tel" autoComplete="tel" placeholder="+91" {...f.bind('phone')} />
        <SelectField label="CSR interest" placeholder="Choose an area" options={csrInterests} {...f.bind('interest')} />
        <SelectField label="Budget range" placeholder="Choose a range" options={budgets} {...f.bind('budget')} />
      </div>
      <TextArea label="Tell us about your goals" optional rows={4} {...f.bind('message')} />
      <FormError submit={f.submit} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PrivacyLine />
        <Button type="submit" size="lg" loading={f.submit.status === 'submitting'} className="w-full sm:w-auto">Send enquiry</Button>
      </div>
    </form>
  );
}
