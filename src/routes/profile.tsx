import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Boxes, Shield, Star, Award, Calendar, MapPin, Wallet, TrendingUp, QrCode, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile ID — SortirGo" }] }),
  component: ProfilePage,
});

interface Profile {
  full_name: string | null;
  city: string | null;
  worker_id: string;
  rating: number;
  total_orders: number;
  total_earnings: number;
  specialization: string;
  tier: string;
  created_at: string;
}

interface RecentOrder {
  order_code: string;
  warehouse_name: string;
  pay_amount: number;
  status: string;
  accepted_at: string | null;
}

function ProfilePage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: r }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("orders").select("order_code,warehouse_name,pay_amount,status,accepted_at").eq("worker_id", user.id).order("accepted_at", { ascending: false }).limit(5),
      ]);
      setProfile(p as Profile | null);
      setRecent((r ?? []) as RecentOrder[]);
    })();
  }, [user]);

  if (loading || !profile) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin"/></div>;

  const initials = (profile.full_name ?? "U").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
  const since = new Date(profile.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
        <h1 className="text-3xl font-bold md:text-4xl">ID Pekerja Digital</h1>
        <p className="mt-2 text-muted-foreground">Kartu identitas resmi kamu sebagai pekerja SortirGo.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
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
                  {initials}
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Nama</div>
                  <div className="font-display text-xl font-bold">{profile.full_name ?? "Pekerja"}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                    <Star className="h-3 w-3 fill-current"/> {profile.rating.toFixed(2)} · Pekerja {profile.tier}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">ID Pekerja</div>
                  <div className="font-mono font-semibold">{profile.worker_id}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Sejak</div>
                  <div className="font-semibold">{since}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Domisili</div>
                  <div className="font-semibold">{profile.city ?? "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground">Spesialisasi</div>
                  <div className="font-semibold">{profile.specialization}</div>
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

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Tile icon={Wallet} label="Total pendapatan" value={`Rp ${profile.total_earnings.toLocaleString("id-ID")}`} sub="lifetime" />
              <Tile icon={Boxes} label="Order selesai" value={String(profile.total_orders)} sub="lifetime" />
              <Tile icon={TrendingUp} label="Rating" value={profile.rating.toFixed(2)} sub="dari 5.00" />
              <Tile icon={Award} label="Tier" value={profile.tier} sub={profile.specialization} />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Riwayat order terakhir</div>
                <span className="text-xs text-muted-foreground">5 terakhir</span>
              </div>
              <div className="mt-4 space-y-3">
                {recent.length === 0 ? (
                  <div className="rounded-lg bg-secondary/40 p-6 text-center text-sm text-muted-foreground">Belum ada order. Buka dashboard untuk mulai.</div>
                ) : recent.map((r) => (
                  <div key={r.order_code} className="flex items-center justify-between rounded-lg bg-secondary/40 p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15"><MapPin className="h-4 w-4 text-primary"/></div>
                      <div>
                        <div className="text-sm font-semibold">{r.warehouse_name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3"/>
                          {r.accepted_at ? new Date(r.accepted_at).toLocaleDateString("id-ID") : "—"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">Rp {r.pay_amount.toLocaleString("id-ID")}</div>
                      <div className="text-[10px] uppercase text-success">{r.status}</div>
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
