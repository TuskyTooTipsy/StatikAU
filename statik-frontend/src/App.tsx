import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import EventsPage from './pages/Events';
import EventDetailPage from './pages/EventDetail';
import SubmitPage from './pages/Submit';
import SignInPage from './pages/SignIn';
import JoinPage from './pages/Join';
import PublicProfilePage from './pages/ProfileDetail';
import ShopPage from './pages/Shop';
import MembersDashboardPage from './pages/members/Dashboard';
import FriendsPage from './pages/members/Friends';
import CommunitiesPage from './pages/members/Communities';
import CommunityDetailPage from './pages/members/CommunityDetail';
import ProfileSettingsPage from './pages/members/ProfileSettings';
import MyGarage from './pages/account/MyGarage';
import MyPosts from './pages/account/MyPosts';
import MyLinks from './pages/account/MyLinks';
import MyQRCode from './pages/account/MyQRCode';
import MyAnalytics from './pages/account/MyAnalytics';
import AdminOverviewPage from './pages/admin/Overview';
import AdminImportsPage from './pages/admin/Imports';
import AdminUsersPage from './pages/admin/Users';
import AdminSettingsPage from './pages/admin/Settings';
import AdminEventsPage from './pages/admin/Events';
import AdminPostsPage from './pages/admin/Posts';
import AdminSubmissionsPage from './pages/admin/Submissions';
import AdminReportsPage from './pages/admin/Reports';
import AdminSponsorsPage from './pages/admin/Sponsors';
import AdminShopPage from './pages/admin/Shop';
import AdminAnnouncementsPage from './pages/admin/Announcements';
import AdminAnalyticsPage from './pages/admin/Analytics';
import AdminRolesPage from './pages/admin/Roles';
import AdminAuditLogsPage from './pages/admin/AuditLogs';
import ShortRedirect from './pages/ShortRedirect';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/profiles/:slug" element={<PublicProfilePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/s/:slug" element={<ShortRedirect />} />

        <Route path="/members" element={<ProtectedRoute><MembersDashboardPage /></ProtectedRoute>} />
        <Route path="/members/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
        <Route path="/members/communities" element={<ProtectedRoute><CommunitiesPage /></ProtectedRoute>} />
        <Route path="/members/communities/:slug" element={<ProtectedRoute><CommunityDetailPage /></ProtectedRoute>} />
        <Route path="/members/profile" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
        <Route path="/members/garage" element={<ProtectedRoute><MyGarage /></ProtectedRoute>} />
        <Route path="/members/posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
        <Route path="/members/links" element={<ProtectedRoute><MyLinks /></ProtectedRoute>} />
        <Route path="/members/qr" element={<ProtectedRoute><MyQRCode /></ProtectedRoute>} />
        <Route path="/members/analytics" element={<ProtectedRoute><MyAnalytics /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminOverviewPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/imports" element={<ProtectedRoute adminOnly><AdminImportsPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettingsPage /></ProtectedRoute>} />

        <Route path="/admin/events" element={<ProtectedRoute adminOnly><AdminEventsPage /></ProtectedRoute>} />
        <Route path="/admin/posts" element={<ProtectedRoute adminOnly><AdminPostsPage /></ProtectedRoute>} />
        <Route path="/admin/submissions" element={<ProtectedRoute adminOnly><AdminSubmissionsPage /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminReportsPage /></ProtectedRoute>} />
        <Route path="/admin/sponsors" element={<ProtectedRoute adminOnly><AdminSponsorsPage /></ProtectedRoute>} />
        <Route path="/admin/shop" element={<ProtectedRoute adminOnly><AdminShopPage /></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute adminOnly><AdminAnnouncementsPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalyticsPage /></ProtectedRoute>} />
        <Route path="/admin/roles" element={<ProtectedRoute adminOnly><AdminRolesPage /></ProtectedRoute>} />
        <Route path="/admin/audit-logs" element={<ProtectedRoute adminOnly><AdminAuditLogsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
