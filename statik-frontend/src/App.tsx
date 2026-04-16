import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Cart from './pages/Cart';
import Community from './pages/Community';
import Contact from './pages/Contact';
import EventDetail from './pages/EventDetail';
import Events from './pages/Events';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import Lookbook from './pages/Lookbook';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import ProfileDetail from './pages/ProfileDetail';
import Returns from './pages/Returns';
import Search from './pages/Search';
import Shipping from './pages/Shipping';
import Shop from './pages/Shop';
import Submit from './pages/Submit';
import Updates from './pages/Updates';
import AccountDashboard from './pages/account/Dashboard';
import MyProfile from './pages/account/MyProfile';
import MyGarage from './pages/account/MyGarage';
import MyLinks from './pages/account/MyLinks';
import MyAnalytics from './pages/account/MyAnalytics';
import MySubmissions from './pages/account/MySubmissions';
import MyQRCode from './pages/account/MyQRCode';
import AccountSettings from './pages/account/Settings';
import AdminOverview from './pages/admin/Overview';
import AdminUsers from './pages/admin/Users';
import AdminEvents from './pages/admin/Events';
import AdminImports from './pages/admin/Imports';
import AdminPosts from './pages/admin/Posts';
import AdminSubmissions from './pages/admin/Submissions';
import AdminReports from './pages/admin/Reports';
import AdminSponsors from './pages/admin/Sponsors';
import AdminShop from './pages/admin/Shop';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminRoles from './pages/admin/Roles';
import AdminAuditLogs from './pages/admin/AuditLogs';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/u/:slug" element={<ProfileDetail />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/search" element={<Search />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:categorySlug" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/lookbook" element={<Lookbook />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/account" element={<AccountDashboard />} />
        <Route path="/account/profile" element={<MyProfile />} />
        <Route path="/account/garage" element={<MyGarage />} />
        <Route path="/account/links" element={<MyLinks />} />
        <Route path="/account/analytics" element={<MyAnalytics />} />
        <Route path="/account/submissions" element={<MySubmissions />} />
        <Route path="/account/qr" element={<MyQRCode />} />
        <Route path="/account/settings" element={<AccountSettings />} />

        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/imports" element={<AdminImports />} />
        <Route path="/admin/posts" element={<AdminPosts />} />
        <Route path="/admin/submissions" element={<AdminSubmissions />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/sponsors" element={<AdminSponsors />} />
        <Route path="/admin/shop" element={<AdminShop />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/roles" element={<AdminRoles />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
