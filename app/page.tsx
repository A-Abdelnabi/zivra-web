import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/visual/hero";
import { Trust } from "@/components/visual/trust";
import { Services } from "@/components/visual/services";
import { Automation } from "@/components/visual/automation";
import Pricing from "@/components/visual/pricing";
import { ContactForm } from "@/components/forms/contact-form";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Trust />
        <Services />
        <Automation />
        <Pricing />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}