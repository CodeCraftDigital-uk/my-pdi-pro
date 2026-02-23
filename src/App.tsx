import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import DistanceSale from "./pages/DistanceSale";
import DisputeResponse from "./pages/DisputeResponse";
import RemoteCapture from "./pages/RemoteCapture";
import SellerCapture from "./pages/SellerCapture";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pdi" element={<Index />} />
          <Route path="/distance-sale" element={<DistanceSale />} />
          <Route path="/dispute-response" element={<DisputeResponse />} />
          <Route path="/remote-capture" element={<RemoteCapture />} />
          <Route path="/capture/:token" element={<SellerCapture />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
