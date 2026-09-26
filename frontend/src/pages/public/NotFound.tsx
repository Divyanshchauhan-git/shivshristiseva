import { Compass } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { ButtonLink } from '@/components/ui/Button';
import { Scene } from '@/components/media/Scene';

export default function NotFound() {
  useSeo({ title: 'Page not found', noindex: true });
  return (
    <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <div>
        <p className="font-mono text-sm text-muted">Error 404</p>
        <h1 className="mt-3 h-display">This page has flown away.</h1>
        <p className="mt-4 text-lg text-muted">The page you are looking for doesn&rsquo;t exist or has moved. Here are some places to go instead.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/" icon={<Compass className="h-4 w-4" />}>Back to home</ButtonLink>
          <ButtonLink to="/programmes" variant="secondary">Our work</ButtonLink>
          <ButtonLink to="/donate" variant="donate">Donate</ButtonLink>
        </div>
      </div>
      <div className="overflow-hidden rounded-[2rem]"><Scene theme="community" seed={404} className="aspect-[4/3] w-full" /></div>
    </section>
  );
}
