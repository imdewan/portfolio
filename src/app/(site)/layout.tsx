import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** The portfolio and blog, with the site's header and footer (product pages like /zepper have their own). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
