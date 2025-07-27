
import { EnhancedHero } from "@/components/home/EnhancedHero";
import { Footer } from "@/components/home/Footer";
import { SimplifiedCTA } from "@/components/home/SimplifiedCTA";
import { SimplifiedDiscover } from "@/components/home/SimplifiedDiscover";
import { NavbarSafeLayout } from "@/components/layout/NavbarSafeLayout";

export default function Index() {
  console.log('Index page rendering - streamlined version');
  
  return (
    <NavbarSafeLayout hero className="bg-[#141416] min-h-screen flex flex-col overflow-hidden">
      <main className="w-full flex-1">
        <EnhancedHero />
        <SimplifiedDiscover />
        <SimplifiedCTA />
      </main>
      <Footer />
    </NavbarSafeLayout>
  );
}
