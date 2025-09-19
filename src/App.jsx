import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@//(public)/components/Navbar";
import Footer from "@//(public)/components/Footer";

function App() {
  const location = useLocation();

  const noLayoutRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/verify-email',
  ];

  const isResetPasswordRoute = location.pathname.startsWith('/reset-password');
  const isLayoutExcluded = noLayoutRoutes.includes(location.pathname) || isResetPasswordRoute;
  const isNotFoundPage = location.pathname === '*'; 

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster 
        position="top-right" 
        richColors 
        expand={false}
        closeButton
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e2e8f0',
            zIndex: 100000,
          },
        }}
      />
      {isLayoutExcluded ? (
        <Outlet />
      ) : (
        <>
          <Navbar />
          <main className="pt-20">
            <div>
              <Outlet />
              <SpeedInsights />
            </div>
          </main>
          {/* Don't show footer on 404 page */}
          {!isNotFoundPage && <Footer />}
        </>
      )}
    </ThemeProvider>
  );
}

export default App;