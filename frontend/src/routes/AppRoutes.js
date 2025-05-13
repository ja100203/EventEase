import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Public Pages
import Home from '../pages/Home';
import Login from '../auth/Login';
import Signup from '../auth/Signup';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManageEvents from '../pages/Admin/EventsList';
import AdminBookings from '../pages/Admin/BookingsList';
import AdminPayments from '../pages/Admin/PaymentsList';
import AnalyticsDashboard from "../pages/Admin/AnalyticsDashboard";


// Organizer Pages
import OrganizerDashboard from '../pages/Organizer/OrganizerDashboard';
import CreateEvents from '../pages/Organizer/CreateEvent';
import ManageMyEvents from '../pages/Organizer/ManageEvents';
import BookedEvents from '../pages/Organizer/OrganizerEventBookings';
import OrganizerAnalytics from "../pages/Organizer/OrganizerAnalytics";
import PrivatePartyUpload from '../pages/Organizer/PrivateParty';

// Attendee Pages
import AttendeeDashboard from '../pages/Attendee/AttendeeDashboard';
import Events from '../pages/Attendee/Event';
import Bookings from '../pages/Attendee/Booking';
import MyBookings from '../pages/Attendee/MyBookings';
import Notifications from '../pages/Attendee/Notification';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ✅ Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<ManageEvents />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
      </Route>

      {/* ✅ Organizer Routes */}
      <Route element={<PrivateRoute allowedRoles={['organizer']} />}>
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/create_events" element={<CreateEvents />} />
        <Route path="/organizer/manage_events" element={<ManageMyEvents />} />
        <Route path="/organizer/booked_events" element={<BookedEvents />} />
        <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
        <Route path="/organizer/private-party" element={<PrivatePartyUpload />} />
      </Route>

      {/* ✅ Attendee Routes */}
      <Route element={<PrivateRoute allowedRoles={['attendee']} />}>
        <Route path="/attendee/dashboard" element={<AttendeeDashboard />} />
        <Route path="/attendee/events" element={<Events />} />
        <Route path="/book/:eventId" element={<Bookings />} />
        <Route path="/attendee/bookings" element={<MyBookings />} />
        <Route path="/attendee/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
