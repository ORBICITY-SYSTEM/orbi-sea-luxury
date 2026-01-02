import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminBookings } from '@/components/admin/AdminBookings';
import { AdminPendingReservations } from '@/components/admin/AdminPendingReservations';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminLoyaltyPoints } from '@/components/admin/AdminLoyaltyPoints';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminContactSubmissions } from '@/components/admin/AdminContactSubmissions';
import { AdminSEO } from '@/components/admin/AdminSEO';
import { AdminPromoCodes } from '@/components/admin/AdminPromoCodes';
import { AdminExperiments } from '@/components/admin/AdminExperiments';
import { AdminContent } from '@/components/admin/AdminContent';
import { AdminMedia } from '@/components/admin/AdminMedia';
import { AdminStyleGuide } from '@/components/admin/AdminStyleGuide';
import { AdminPricing } from '@/components/admin/AdminPricing';

const Admin = () => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="pending" element={<div className="p-6"><AdminPendingReservations /></div>} />
              <Route path="bookings" element={<div className="p-6"><AdminBookings /></div>} />
              <Route path="pricing" element={<div className="p-6"><AdminPricing /></div>} />
              <Route path="contacts" element={<div className="p-6"><AdminContactSubmissions /></div>} />
              <Route path="content" element={<div className="p-6"><AdminContent /></div>} />
              <Route path="media" element={<div className="p-6"><AdminMedia /></div>} />
              <Route path="users" element={<div className="p-6"><AdminUsers /></div>} />
              <Route path="loyalty" element={<div className="p-6"><AdminLoyaltyPoints /></div>} />
              <Route path="promo-codes" element={<div className="p-6"><AdminPromoCodes /></div>} />
              <Route path="experiments" element={<div className="p-6"><AdminExperiments /></div>} />
              <Route path="seo" element={<div className="p-6"><AdminSEO /></div>} />
              <Route path="style-guide" element={<div className="p-6"><AdminStyleGuide /></div>} />
              <Route path="settings" element={<div className="p-6"><AdminSettings /></div>} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
