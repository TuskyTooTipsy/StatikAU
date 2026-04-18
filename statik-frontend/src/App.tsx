import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import EventsPage from './pages/Events';
import EventDetailPage from './pages/EventDetail';
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
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/profiles/:slug" element={<PublicProfilePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/shop" element={<ShopPage />} />

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
