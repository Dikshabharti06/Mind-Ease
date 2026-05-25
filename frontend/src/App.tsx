
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Meditation from "./pages/Meditation";
import Chat from "./pages/Chat";
import Community from "./pages/Community";
import CommunityPost from "./pages/CommunityPost";
import Tools from "./pages/Tools";
import Sleep from "./pages/Sleep";
import Therapy from "./pages/Therapy";
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer";  

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {/* Navbar - Now inside Router context */}
            <NavBar />
            
            {/* Main Content */}
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/meditation" element={<Meditation />} />
                <Route path="/sleep" element={<Sleep />} />
                <Route path="/therapy" element={<Therapy />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/:id" element={<CommunityPost />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            {/* Global Footer */}
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
