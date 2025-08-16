import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from 'sonner';
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

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster position="top-right" richColors /> 
      {isLayoutExcluded ? (
        <Outlet />
      ) : (
        <>
          <Navbar />
          <main className="pt-25">
            <div>
              <Outlet />
            </div>
          </main>
          <Footer />
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
