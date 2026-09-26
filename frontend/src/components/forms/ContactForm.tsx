import { Send } from 'lucide-react';
import { useForm } from '@/hooks/useForm';
import { formsApi } from '@/services/api';
import { email, maxLen, minLen, phoneIN, required } from '@/utils/validate';
import { TextArea, TextField, SelectField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { FormError, FormSuccess, PrivacyLine } from './FormStatus';

export const contactSubjects = ['General enquiry', 'Donation or receipt', 'Volunteering', 'CSR / Partnership', 'Animal rescue or adoption', 'Media', 'Feedback or complaint'];

export function ContactForm({ compact }: { compact?: boolean }) {
  const f = useForm({ name: '', email: '', phone: '', subject: '', message: '' }, {
    name: [required('Your name'), maxLen(80, 'Name')], email: [required('Email'), email], phone: [phoneIN],
    subject: [required('Subject')], message: [required('Message'), minLen(10, 'Message'), maxLen(2000, 'Message')],
  });
  if (f.submit.status === 'success') {
    return <FormSuccess title="Message sent" text="Thank you for writing to us. Our team usually replies within two working days." reference={f.submit.reference} onReset={f.reset} />;
  }
  return (
    <form noValidate onSubmit={f.handleSubmit((v) => formsApi.contact(v))} className="space-y-4" aria-label="Contact form">
      <div className={compact ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4 sm:grid-cols-2'}>
        <TextField label="Name" autoComplete="name" {...f.bind('name')} />
        <TextField label="Email" type="email" autoComplete="email" inputMode="email" {...f.bind('email')} />
        <TextField label="Phone" type="tel" autoComplete="tel" inputMode="tel" optional placeholder="+91" {...f.bind('phone')} />
        <SelectField label="Subject" placeholder="Choose a subject" options={contactSubjects} {...f.bind('subject')} />
      </div>
      <TextArea label="Message" rows={compact ? 4 : 6} {...f.bind('message')} />
      <FormError submit={f.submit} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PrivacyLine />
        <Button type="submit" loading={f.submit.status === 'submitting'} icon={<Send className="h-4 w-4" />} className="w-full sm:w-auto">Send message</Button>
      </div>
    </form>
  );
}
