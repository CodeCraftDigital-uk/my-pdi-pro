import { ExternalLink, Shield, Car, FileText, Wrench, Search, BookOpen, Sparkles, ClipboardCheck, ScrollText, MessageSquare, Camera } from "lucide-react";
import autoprovIcon from "@/assets/autoprov_icon.png";

const features = [
  { icon: Shield, title: "Industry-Beating Provenance (HPI) Check", free: false },
  { icon: Car, title: "Valuation Tool", free: true },
  { icon: FileText, title: "DVSA Linked MOT History Check", free: true },
  { icon: BookOpen, title: "Service History Lookup Service", free: false },
  { icon: Wrench, title: "Vehicle Build & Specification Data", free: false },
  { icon: Search, title: "VIN Lookup Tool", free: true },
  { icon: Sparkles, title: "AI Powered Sales Description Generator", free: false },
  { icon: ClipboardCheck, title: "PDI Tool", free: true },
  { icon: ScrollText, title: "Digital Distance Sales Pack Generator", free: true },
  { icon: MessageSquare, title: "AI Powered Dispute Response Generator", free: true },
  { icon: Camera, title: "Remote Vehicle Appraisal Tool", free: true },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0f2137] text-white">
      {/* Hero */}
      <header className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        <img src={autoprovIcon} alt="AutoProv logo" className="h-20 w-20 mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Auto<span className="text-[#c9a227]">Prov</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
          Automotive Compliance Platform for UK Dealers&nbsp;&amp;&nbsp;Traders
        </p>
        <a
          href="https://www.autoprov.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#c9a227] hover:bg-[#b8921f] text-[#0f2137] font-semibold text-lg px-8 py-3 rounded-lg transition-colors"
        >
          Visit AutoProv.ai <ExternalLink className="h-5 w-5" />
        </a>
      </header>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Everything You Need, <span className="text-[#c9a227]">One Platform</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, free }) => (
            <div
              key={title}
              className="flex items-start gap-3 bg-[#1e3a5f]/60 border border-[#2a4f7a] rounded-lg p-4 hover:border-[#c9a227]/50 transition-colors"
            >
              <Icon className="h-5 w-5 mt-0.5 shrink-0 text-[#c9a227]" />
              <span className="text-sm leading-snug">
                {free && <span className="text-[#c9a227] font-semibold">FREE </span>}
                {title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <p className="text-gray-400 leading-relaxed">
          AutoProv is a comprehensive automotive compliance and intelligence platform built for UK
          motor dealers and traders. From provenance checks and valuations to AI-powered dispute
          responses and digital distance sale packs, AutoProv streamlines every aspect of vehicle
          compliance so you can focus on selling.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e3a5f] py-8 text-center text-sm text-gray-500">
        <a
          href="https://www.autoprov.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c9a227] hover:underline"
        >
          autoprov.ai
        </a>
        <span className="mx-2">·</span>
        © {new Date().getFullYear()} AutoProv. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
