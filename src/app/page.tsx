import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LatestRelease from "@/components/LatestRelease";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-[#030308] text-white min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <LatestRelease />
      <About />
      <Contact />
    </main>
  );
}