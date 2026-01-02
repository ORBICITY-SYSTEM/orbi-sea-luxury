import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { DiscountPopup } from "@/components/DiscountPopup";
import { GoogleReviewPopup } from "@/components/GoogleReviewPopup";
import { StructuredData } from "@/components/StructuredData";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { AIChatbot } from "@/components/AIChatbot";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { MetaPixel } from "@/components/MetaPixel";
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
const AboutUs = lazy(() => import("./pages/AboutUs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PurchaseConditions = lazy(() => import("./pages/PurchaseConditions"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <DiscountPopup />
        <GoogleReviewPopup />
        <StructuredData />
        <WhatsAppFloatingButton />
        <AIChatbot />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <GoogleAnalytics />
          <MetaPixel />
          <AuthProvider>
            <BookingProvider>
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
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/purchase-conditions" element={<PurchaseConditions />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BookingProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
