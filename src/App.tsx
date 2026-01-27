import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { GoogleReviewPopup } from "@/components/GoogleReviewPopup";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { StructuredData } from "@/components/StructuredData";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { AIChatbot } from "@/components/AIChatbot";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { MetaPixel } from "@/components/MetaPixel";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { TawkTo } from "@/components/TawkTo";
import { LanguageSelectionPopup } from "@/components/LanguageSelectionPopup";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import { PushNotificationPrompt } from "@/components/PushNotificationPrompt";
import { Loader2 } from 'lucide-react';

// Lazy loaded pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Apartments = lazy(() => import("./pages/Apartments"));
const ApartmentDetail = lazy(() => import("./pages/ApartmentDetail"));
const YouTubeVideos = lazy(() => import("./pages/YouTubeVideos"));
const Amenities = lazy(() => import("./pages/Amenities"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Location = lazy(() => import("./pages/Location"));
const Contact = lazy(() => import("./pages/Contact"));
const LoyaltyProgram = lazy(() => import("./pages/LoyaltyProgram"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPostDetail = lazy(() => import("./pages/BlogPostDetail"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PurchaseConditions = lazy(() => import("./pages/PurchaseConditions"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const GuestDashboard = lazy(() => import("./pages/GuestDashboard"));
const InstallApp = lazy(() => import("./pages/InstallApp"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LocalSEO = lazy(() => import("./pages/LocalSEO"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes cache
    },
  },
});

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <LanguageSelectionPopup />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StructuredData />
          <PWAUpdatePrompt />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <GoogleAnalytics />
            <MetaPixel />
            <GoogleTagManager />
            <TawkTo />
            <AuthProvider>
              <BookingProvider>
                <GoogleReviewPopup />
                <ExitIntentPopup />
                <WhatsAppFloatingButton />
                <AIChatbot />
                <PushNotificationPrompt variant="banner" showAfterDelay={15000} />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/apartments" element={<Apartments />} />
                    <Route path="/apartments/:id" element={<ApartmentDetail />} />
                    <Route path="/youtube-videos" element={<YouTubeVideos />} />
                    <Route path="/amenities" element={<Amenities />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/location" element={<Location />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/loyalty-program" element={<LoyaltyProgram />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPostDetail />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/purchase-conditions" element={<PurchaseConditions />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<GuestDashboard />} />
                    <Route path="/install-app" element={<InstallApp />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="/location/:slug" element={<LocalSEO />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BookingProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
