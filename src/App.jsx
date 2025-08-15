import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@//(public)/components/Navbar";
import Footer from "@//(public)/components/Footer";

function App() {

  const location = useLocation()

  const noLayoutRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']
  const isLayoutExcluded = noLayoutRoutes.includes(location.pathname)

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
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
