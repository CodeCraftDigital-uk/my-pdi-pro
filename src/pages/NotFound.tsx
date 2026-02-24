import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import autoprovIcon from "@/assets/autoprov_icon.png";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: 'linear-gradient(135deg, #1a3558 0%, #1e3f6b 55%, #0f2240 100%)' }}
    >
      <div
        className="rounded-2xl p-3 mb-6"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(201,162,39,0.3)' }}
      >
        <img src={autoprovIcon} alt="AutoProv" className="w-16 h-16 object-contain" />
      </div>
      <h1 className="text-6xl font-extrabold text-white mb-2">404</h1>
      <p className="text-lg font-semibold mb-1" style={{ color: '#c9a227' }}>Page Not Found</p>
      <p className="text-sm text-slate-400 max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved. Head back to the portal to access the compliance tools.
      </p>
      <Button
        onClick={() => navigate('/')}
        className="gap-2 text-white"
        style={{ background: '#1e3a5f' }}
      >
        <ChevronLeft size={16} /> Back to Portal
      </Button>
    </div>
  );
};

export default NotFound;
