import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { useEffect, useState } from "react";
import { Navigation, MapPin, Phone, Clock, Route as RouteIcon, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/navigate")({
  head: () => ({ meta: [{ title: "Navigasi GPS — SortirGo" }] }),
  component: NavigatePage,
});

const directions = [
  { d: "200 m", t: "Belok kanan ke Jl. Raya Bekasi" },
  { d: "1.4 km", t: "Lurus, ikuti Jl. Kalimalang" },
  { d: "600 m", t: "Putar balik di U-turn Cipinang" },
  { d: "150 m", t: "Tujuan di sebelah kiri" },
];

function NavigatePage() {
  const [eta, setEta] = useState(8);
  useEffect(() => {
    const t = setInterval(() => setEta((e) => (e > 1 ? e - 1 : e)), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase text-primary">Order ORD-2841 · Aktif</div>
            <h1 className="text-2xl font-bold md:text-3xl">Navigasi ke Gudang JNE Bekasi</h1>
          </div>
          <div className="rounded-full border border-success/40 bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">
            ETA {eta} menit
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          {/* Map */}
          <div className="relative h-[60vh] overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="absolute inset-0 grid-bg opacity-60" />
            {/* Fake map elements */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="route" x1="0" x2="1">
                  <stop offset="0" stopColor="oklch(0.74 0.18 50)"/>
                  <stop offset="1" stopColor="oklch(0.68 0.2 30)"/>
                </linearGradient>
              </defs>
              <path d="M 80 480 Q 220 460 280 380 T 460 280 Q 560 220 680 140" stroke="url(#route)" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="0" filter="drop-shadow(0 0 8px oklch(0.74 0.18 50 / 0.6))"/>
              {/* Streets */}
              <g stroke="oklch(0.3 0.015 60)" strokeWidth="2" fill="none">
                <path d="M 0 200 L 800 200"/>
                <path d="M 0 400 L 800 400"/>
                <path d="M 200 0 L 200 600"/>
                <path d="M 500 0 L 500 600"/>
                <path d="M 700 0 L 700 600"/>
              </g>
            </svg>

            {/* Origin */}
            <div className="absolute left-[10%] top-[80%] -translate-x-1/2 -translate-y-1/2">
              <div className="relative grid h-5 w-5 place-items-center rounded-full bg-primary shadow-glow">
                <div className="absolute inset-0 animate-pulse-ring rounded-full" />
              </div>
              <div className="mt-1 whitespace-nowrap rounded bg-card/90 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">Posisi kamu</div>
            </div>

            {/* Destination */}
            <div className="absolute left-[85%] top-[23%] -translate-x-1/2 -translate-y-1/2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-card border-2 border-primary shadow-glow">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-1 whitespace-nowrap rounded bg-card/90 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">Gudang JNE</div>
            </div>

            {/* Compass / next instruction */}
            <div className="absolute left-4 top-4 max-w-xs rounded-2xl border border-border bg-card/95 p-4 backdrop-blur shadow-card">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary">
                  <ArrowRight className="h-6 w-6 -rotate-45 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Dalam 200 m</div>
                  <div className="font-semibold">Belok kanan</div>
                  <div className="text-xs text-muted-foreground">ke Jl. Raya Bekasi</div>
                </div>
              </div>
            </div>

            <button className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-gradient-primary shadow-glow">
              <Navigation className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><RouteIcon className="h-4 w-4 text-primary"/> Total jarak</div>
                <span className="font-bold">2.4 km</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary"/> Tiba pukul</div>
                <span className="font-bold">14:23 WIB</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="text-xs font-semibold uppercase text-muted-foreground">Petunjuk arah</div>
              <ol className="mt-3 space-y-3">
                {directions.map((d, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{i+1}</div>
                    <div>
                      <div className="text-sm font-semibold">{d.t}</div>
                      <div className="text-xs text-muted-foreground">{d.d}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="text-xs font-semibold uppercase text-muted-foreground">Kontak supervisor</div>
              <div className="mt-2 font-semibold">Pak Hadi</div>
              <div className="text-sm text-muted-foreground">JNE Bekasi Timur</div>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary py-2.5 text-sm font-bold text-primary-foreground shadow-glow">
                <Phone className="h-4 w-4"/> Hubungi
              </button>
            </div>

            <Link to="/dashboard" className="block w-full rounded-lg border border-border bg-secondary py-3 text-center text-sm font-semibold hover:bg-secondary/70">
              Selesaikan order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}