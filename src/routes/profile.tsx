import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Boxes, Shield, Star, Award, Calendar, MapPin, Wallet, TrendingUp, QrCode } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile ID — SortirGo" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
        <h1 className="text-3xl font-bold md:text-4xl">ID Pekerja Digital</h1>
        <p className="mt-2 text-muted-foreground">Kartu identitas resmi kamu sebagai pekerja SortirGo.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* ID CARD */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-primary opacity-30 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-dark p-6 shadow-card">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl"/>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-primary"><Boxes className="h-4 w-4 text-primary-foreground"/></div>
                  <span className="font-display font-bold tracking-tight">SortirGo</span>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                  <Shield className="h-3 w-3"/> TERVERIFIKASI
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-primary font-display text-3xl font-bold text-primary-foreground">
                  BS
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Nama</div>
                  <div className="font-display text-xl font-bold">Budi Santoso</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                    <Star className="h-3 w-3 fill-current"/> 4.92 · Pekerja Gold
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">ID Pekerja</div>
                  <div className="font-mono font-semibold">SG-2024-08412</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Sejak</div>
                  <div className="font-semibold">12 Mar 2024</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Domisili</div>
                  <div className="font-semibold">Jakarta Timur</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Spesialisasi</div>
                  <div className="font-semibold">Sortir Paket</div>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-4">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Verifikasi cepat</div>
                  <div className="text-sm font-semibold">Scan QR oleh supervisor</div>
                </div>
                <div className="grid h-16 w-16 place-items-center rounded-lg bg-foreground p-2">
                  <QrCode className="h-full w-full text-background"/>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Tile icon={Wallet} label="Total pendapatan" value="Rp 8.420.000" sub="bulan ini" />
              <Tile icon={Boxes} label="Order selesai" value="142" sub="lifetime" />
              <Tile icon={TrendingUp} label="Tingkat sukses" value="98.6%" sub="30 hari terakhir" />
              <Tile icon={Award} label="Badge" value="3" sub="Gold · Tepat Waktu · Akurat" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Riwayat shift terakhir</div>
                <span className="text-xs text-muted-foreground">7 hari</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { d: "Hari ini", w: "JNE Bekasi", p: "Rp 95.000", s: "Selesai" },
                  { d: "Kemarin", w: "Tokopedia Cakung", p: "Rp 142.000", s: "Selesai" },
                  { d: "2 hari lalu", w: "Shopee Pulogadung", p: "Rp 72.000", s: "Selesai" },
                ].map((r) => (
                  <div key={r.d} className="flex items-center justify-between rounded-lg bg-secondary/40 p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15"><MapPin className="h-4 w-4 text-primary"/></div>
                      <div>
                        <div className="text-sm font-semibold">{r.w}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3"/> {r.d}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">{r.p}</div>
                      <div className="text-[10px] uppercase text-success">{r.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15"><Icon className="h-4 w-4 text-primary"/></div>
      </div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}