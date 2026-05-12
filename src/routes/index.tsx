import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Zap, MapPin, FileCheck, BadgeCheck, ArrowRight, Boxes, Clock, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span className="relative inline-flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span></span>
                127 order tersedia sekarang
              </div>
              <h1 className="mt-6 text-5xl font-bold leading-[1.05] md:text-7xl">
                Kerja Sortir,<br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">Tanpa Antri.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                Apply CV sekali, terima orderan instan kapan saja. Sistem auto-match dengan gudang terdekat. Bayaran cair harian.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/apply" className="group inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]">
                  Daftar dengan CV <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-secondary">
                  Lihat Dashboard
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
                {[
                  { v: "12k+", l: "Pekerja aktif" },
                  { v: "< 30dtk", l: "Match order" },
                  { v: "Rp 18rb", l: "Per jam rata-rata" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-2xl font-bold text-primary">{s.v}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Mock phone */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-primary opacity-20 blur-2xl" />
              <div className="relative rounded-3xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15"><Boxes className="h-5 w-5 text-primary"/></div>
                    <div>
                      <div className="text-xs text-muted-foreground">Order baru</div>
                      <div className="text-sm font-semibold">Gudang JNE Bekasi</div>
                    </div>
                  </div>
                  <div className="rounded-full bg-success/15 px-2 py-1 text-xs font-semibold text-success">+Rp 95k</div>
                </div>
                <div className="mt-4 h-40 overflow-hidden rounded-xl border border-border grid-bg relative">
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-glow" />
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring relative" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-secondary p-2"><Clock className="mx-auto h-4 w-4 text-primary"/><div className="mt-1 font-semibold">4 jam</div></div>
                  <div className="rounded-lg bg-secondary p-2"><MapPin className="mx-auto h-4 w-4 text-primary"/><div className="mt-1 font-semibold">2.4 km</div></div>
                  <div className="rounded-lg bg-secondary p-2"><Boxes className="mx-auto h-4 w-4 text-primary"/><div className="mt-1 font-semibold">320 pkg</div></div>
                </div>
                <button className="mt-4 w-full rounded-lg bg-gradient-primary py-3 text-sm font-bold text-primary-foreground">TERIMA ORDER</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <h2 className="text-3xl font-bold md:text-5xl">Cara kerja, simpel.</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Tiga langkah dari upload CV ke terima order pertama.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { i: FileCheck, t: "Upload CV", d: "Sistem akan memproses dan verifikasi data kamu otomatis dalam hitungan menit." },
              { i: BadgeCheck, t: "Verifikasi Instan", d: "Lulus seleksi langsung dapat ID pekerja digital dan akses dashboard." },
              { i: Zap, t: "Terima Order", d: "Order auto-masuk ke dashboard. Tap 'Terima', ikuti GPS ke lokasi sortir." },
            ].map((s, i) => (
              <div key={s.t} className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-glow">
                <div className="absolute right-6 top-6 font-display text-5xl font-bold text-primary/15">0{i+1}</div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15"><s.i className="h-6 w-6 text-primary"/></div>
                <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { i: Wallet, t: "Bayaran harian", d: "Cair otomatis tiap selesai shift" },
            { i: Clock, t: "Jam fleksibel", d: "Pilih shift sesukamu, tanpa minimum" },
            { i: MapPin, t: "Gudang terdekat", d: "Algoritma cari lokasi paling efisien" },
          ].map((p) => (
            <div key={p.t} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15"><p.i className="h-5 w-5 text-primary"/></div>
              <div>
                <div className="font-semibold">{p.t}</div>
                <div className="text-sm text-muted-foreground">{p.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-16 overflow-hidden rounded-3xl border border-primary/40 bg-gradient-dark p-10 md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative">
            <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">Siap kerja malam ini juga?</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">Daftar sekarang, proses CV cuma 5 menit. Order pertama bisa langsung kamu ambil.</p>
            <Link to="/apply" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow">
              Apply sekarang <ArrowRight className="h-4 w-4"/>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        © 2026 SortirGo · Platform kerja sortir barang instan
      </footer>
    </div>
  );
}
