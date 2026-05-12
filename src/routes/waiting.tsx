import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

export const Route = createFileRoute("/waiting")({
  head: () => ({ meta: [{ title: "Memproses CV — SortirGo" }] }),
  component: WaitingPage,
});

const steps = [
  "Menerima CV kamu",
  "Memverifikasi data identitas",
  "Mencocokkan pengalaman & lokasi",
  "Membuat ID pekerja digital",
];

function WaitingPage() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProgress((p) => (p < steps.length ? p + 1 : p)), 1400);
    return () => clearInterval(t);
  }, []);
  const done = progress >= steps.length;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-8 md:py-24">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-card">
          <div className="flex justify-center">
            <div className="relative grid h-24 w-24 place-items-center rounded-full bg-primary/15">
              {done ? (
                <CheckCircle2 className="h-12 w-12 text-success" />
              ) : (
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              )}
              {!done && <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse" />}
            </div>
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold md:text-4xl">{done ? "Kamu diterima!" : "Sedang memproses..."}</h1>
            <p className="mt-2 text-muted-foreground">
              {done ? "Selamat, kamu resmi jadi pekerja SortirGo." : "Estimasi 1-2 menit. Jangan tutup halaman ini."}
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {steps.map((s, i) => {
              const isDone = i < progress;
              const isActive = i === progress && !done;
              return (
                <div key={s} className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${isDone ? "border-success/40 bg-success/5" : isActive ? "border-primary/50 bg-primary/5" : "border-border bg-secondary/30"}`}>
                  {isDone ? <CheckCircle2 className="h-5 w-5 text-success" /> : isActive ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                  <span className={`text-sm ${isDone || isActive ? "font-semibold" : "text-muted-foreground"}`}>{s}</span>
                </div>
              );
            })}
          </div>

          {done && (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              <Link to="/profile" className="rounded-lg border border-border bg-secondary py-3 text-center text-sm font-semibold hover:bg-secondary/70">Lihat ID Pekerja</Link>
              <Link to="/dashboard" className="rounded-lg bg-gradient-primary py-3 text-center text-sm font-bold text-primary-foreground shadow-glow">Mulai Terima Order →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}