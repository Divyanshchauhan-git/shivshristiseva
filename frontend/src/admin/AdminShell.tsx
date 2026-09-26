import { Route, Routes } from 'react-router-dom';
import { AdminDataProvider } from './store';
import { AdminLayout } from './AdminLayout';
import { Dashboard, Donations } from './pages/Overview';
import { AnimalsAdmin, CampaignsAdmin, DocumentsAdmin, EventsAdmin, GalleryAdmin, ImpactAdmin, ProgrammesAdmin, StoriesAdmin } from './pages/ContentAdmin';
import { CsrAdmin, MessagesAdmin, ReportsAdmin, SettingsAdmin, UsersAdmin, VolunteersAdmin } from './pages/PeopleAdmin';

export default function AdminShell() {
  return (
    <AdminDataProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="donations" element={<Donations />} />
          <Route path="campaigns" element={<CampaignsAdmin />} />
          <Route path="programmes" element={<ProgrammesAdmin />} />
          <Route path="volunteers" element={<VolunteersAdmin />} />
          <Route path="stories" element={<StoriesAdmin />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="animals" element={<AnimalsAdmin />} />
          <Route path="impact" element={<ImpactAdmin />} />
          <Route path="csr" element={<CsrAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="reports" element={<ReportsAdmin />} />
          <Route path="documents" element={<DocumentsAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="*" element={<div className="card p-10 text-center"><h1 className="text-2xl">Page not found</h1></div>} />
        </Route>
      </Routes>
    </AdminDataProvider>
  );
}
