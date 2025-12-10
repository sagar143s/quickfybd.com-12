"use client";
import ReduxProvider from "@/lib/ReduxProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "@/app/StoreProvider";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  return (
    <ReduxProvider>
      <Navbar />
      <StoreProvider>
        <Toaster />
        {children}
      </StoreProvider>
      <Footer />
    </ReduxProvider>
  );
}
