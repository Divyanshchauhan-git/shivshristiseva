import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import { PublicLayout, ScrollToTop } from '@/components/layout/PublicLayout';
import { ToastProvider } from '@/components/ui/Toast';
import { LoadingBlock } from '@/components/ui/States';
import { DemoGatewaySheet } from '@/components/forms/DemoGatewaySheet';
import { isMockApi } from '@/services/api';
import { AuthProvider, RequireAuth } from '@/admin/auth';
import Home from '@/pages/public/Home';

/* Route-level code splitting: each page group is its own chunk. */
const About = lazy(() => import('@/pages/public/About'));
const Impact = lazy(() => import('@/pages/public/Impact'));
const NotFound = lazy(() => import('@/pages/public/NotFound'));
const P = lazy(() => import('@/pages/public/Programmes').then((m) => ({ default: m.Programmes })));
const PD = lazy(() => import('@/pages/public/Programmes').then((m) => ({ default: m.ProgrammeDetail })));
const C = lazy(() => import('@/pages/public/Campaigns').then((m) => ({ default: m.Campaigns })));
const CD = lazy(() => import('@/pages/public/Campaigns').then((m) => ({ default: m.CampaignDetail })));
const Donate = lazy(() => import('@/pages/public/Donate').then((m) => ({ default: m.Donate })));
const DonationStatus = lazy(() => import('@/pages/public/Donate').then((m) => ({ default: m.DonationStatus })));
const Stories = lazy(() => import('@/pages/public/Content').then((m) => ({ default: m.Stories })));
const StoryDetail = lazy(() => import('@/pages/public/Content').then((m) => ({ default: m.StoryDetail })));
const Events = lazy(() => import('@/pages/public/Content').then((m) => ({ default: m.Events })));
const EventDetail = lazy(() => import('@/pages/public/Content').then((m) => ({ default: m.EventDetail })));
const Gallery = lazy(() => import('@/pages/public/Content').then((m) => ({ default: m.Gallery })));
const GetInvolved = lazy(() => import('@/pages/public/Involve').then((m) => ({ default: m.GetInvolved })));
const Volunteer = lazy(() => import('@/pages/public/Involve').then((m) => ({ default: m.Volunteer })));
const Fundraise = lazy(() => import('@/pages/public/Involve').then((m) => ({ default: m.Fundraise })));
const Csr = lazy(() => import('@/pages/public/Involve').then((m) => ({ default: m.Csr })));
const Campus = lazy(() => import('@/pages/public/Involve').then((m) => ({ default: m.Campus })));
const Careers = lazy(() => import('@/pages/public/Involve').then((m) => ({ default: m.Careers })));
const Contact = lazy(() => import('@/pages/public/Info').then((m) => ({ default: m.Contact })));
const Faq = lazy(() => import('@/pages/public/Info').then((m) => ({ default: m.Faq })));
const Transparency = lazy(() => import('@/pages/public/Info').then((m) => ({ default: m.Transparency })));
const Legal = lazy(() => import('@/pages/public/Info').then((m) => ({ default: m.Legal })));

/* Admin bundle is loaded only when /admin is visited. */
const AdminShell = lazy(() => import('@/admin/AdminShell'));
const Login = lazy(() => import('@/admin/pages/Login'));

const Router = ({ children }: { children: ReactNode }) =>
  (import.meta.env.VITE_ROUTER_MODE as string) === 'hash' ? <HashRouter>{children}</HashRouter> : <BrowserRouter>{children}</BrowserRouter>;

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <ScrollToTop />
          {isMockApi && <DemoGatewaySheet />}
          <Suspense fallback={<div className="container-page py-16"><LoadingBlock /></div>}>
            <Routes>
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/*" element={<RequireAuth><AdminShell /></RequireAuth>} />
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="programmes" element={<P />} />
                <Route path="programmes/:slug" element={<PD />} />
                <Route path="our-work" element={<P />} />
                <Route path="campaigns" element={<C />} />
                <Route path="campaigns/:slug" element={<CD />} />
                <Route path="donate" element={<Donate />} />
                <Route path="donate/status/:id" element={<DonationStatus />} />
                <Route path="impact" element={<Impact />} />
                <Route path="stories" element={<Stories />} />
                <Route path="stories/:slug" element={<StoryDetail />} />
                <Route path="events" element={<Events />} />
                <Route path="events/:slug" element={<EventDetail />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="get-involved" element={<GetInvolved />} />
                <Route path="get-involved/campus" element={<Campus />} />
                <Route path="volunteer" element={<Volunteer />} />
                <Route path="fundraise" element={<Fundraise />} />
                <Route path="csr" element={<Csr />} />
                <Route path="careers" element={<Careers />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<Faq />} />
                <Route path="transparency" element={<Transparency />} />
                <Route path="legal/:slug" element={<Legal />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
