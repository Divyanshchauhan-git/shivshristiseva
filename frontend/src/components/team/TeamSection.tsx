import type { ReactNode } from 'react';
import { SectionHeader } from '@/components/ui/Section';
import { cn } from '@/utils/format';

interface TeamSectionProps {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bg?: 'default' | 'subtle' | 'white';
}

export function TeamSection({
  id,
  eyebrow,
  title,
  text,
  action,
  children,
  className,
  bg = 'default',
}: TeamSectionProps) {
  const bgClasses = {
    default: 'bg-transparent',
    subtle: 'bg-surface-2/60',
    white: 'bg-surface',
  };

  return (
    <section id={id} className={cn('section', bgClasses[bg], className)} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="container-page">
        <SectionHeader
          id={id ? `${id}-title` : undefined}
          eyebrow={eyebrow}
          title={title}
          text={text}
          action={action}
        />
        {children}
      </div>
    </section>
  );
}
