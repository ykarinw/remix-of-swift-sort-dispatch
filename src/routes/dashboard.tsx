import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { useEffect, useState } from "react";
import { MapPin, Clock, Boxes, Zap, TrendingUp, Wallet, Star, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SortirGo" }] }),
  component: Dashboard,
});

interface Order {
  id: string;
  order_code: string;
  warehouse_name: string;
  distance_km: number;
  duration_hours: number;
  packages: number;
  pay_amount: number;
  urgency: string;
  status: string;
  max_workers: number;
  current_workers: number;
}

interface Profile {
  full_name: string | null;
  rating: number;
  total_orders: number;
  total_earnings: number;
  is_online: boolean;
}

function Dashboard() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: o }, { data: p }] = await Promise.all([
        supabase.from("orders").select("*").eq("status", "available").order("created_at", { ascending: false }),
        supabase.from("profiles").select("full_name,rating,total_orders,total_earnings,is_online").eq("user_id", user.id).maybeSingle(),
      ]);
      setOrders((o ?? []) as Order[]);
      setProfile(p as Profile | null);
    };
    load();

    const ch = supabase.channel("orders-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const accept = async (o: Order) => {
    if (!user) return;
    setBusy(o.id);
    const { error } = await supabase.from("orders").update({
      status: "accepted", worker_id: user.id, accepted_at: new Date().toISOString(),
    }).eq("id", o.id).eq("status", "available");
    setBusy(null);
    if (error) { toast.error("Gagal menerima order"); return; }
    toast.success(`Order ${o.order_code} diterima!`);
    nav({ to: "/navigate" });
  };

  const toggleOnline = async () => {
    if (!user || !profile) return;
    const next = !profile.is_online;
    setProfile({ ...profile, is_online: next });
    await supabase.from("profiles").update({ is_online: next }).eq("user_id", user.id);
  };

  if (loading || !user) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin"/></div>;

  const firstName = profile?.full_name?.split(" ")[0] ?? "Pekerja";

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Halo, {firstName} 👋</h1>
            <p className="text-sm text-muted-foreground">Order baru muncul real-time. Tap untuk terima instan.</p>
          </div>
          <button onClick={toggleOnline} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${profile?.is_online ? "border-success/50 bg-success/10 text-success" : "border-border bg-secondary text-muted-foreground"}`}>
            <span className={`h-2 w-2 rounded-full ${profile?.is_online ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
            {profile?.is_online ? "Online — siap kerja" : "Offline"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Stat icon={Wallet} label="Total pendapatan" value={`Rp ${(profile?.total_earnings ?? 0).toLocaleString("id-ID")}`} accent />
          <Stat icon={Boxes} label="Order selesai" value={String(profile?.total_orders ?? 0)} />
          <Stat icon={Star} label="Rating" value={(profile?.rating ?? 5).toFixed(2)} />
          <Stat icon={TrendingUp} label="Status" value={profile?.is_online ? "Aktif" : "Istirahat"} />
        </div>

        <div className="mt-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Order tersedia</h2>
            <p className="text-sm text-muted-foreground">{orders.length} order menunggu — tanpa antri, tap langsung dapat</p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <Zap className="h-3.5 w-3.5 text-primary" /> Live update real-time
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Boxes className="mx-auto h-10 w-10 text-muted-foreground"/>
            <p className="mt-3 text-sm text-muted-foreground">Belum ada order tersedia. Tunggu sebentar — order baru muncul otomatis.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {orders.map((o) => (
              <div key={o.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-glow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{o.order_code}</span>
                      <UrgencyBadge level={o.urgency} />
                    </div>
                    <h3 className="mt-1 text-lg font-semibold">{o.warehouse_name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-primary">Rp {o.pay_amount.toLocaleString("id-ID")}</div>
                    <div className="text-xs text-muted-foreground">net pendapatan</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Meta icon={MapPin} label="Jarak" value={`${o.distance_km} km`} />
                  <Meta icon={Clock} label="Durasi" value={`${o.duration_hours} jam`} />
                  <Meta icon={Boxes} label="Paket" value={`${o.packages}`} />
                </div>

                <div className="mt-4 flex gap-2">
                  <button disabled={busy === o.id} onClick={() => accept(o)} className="flex-1 rounded-lg bg-gradient-primary py-2.5 text-center text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60">
                    {busy === o.id ? "Memproses..." : "Terima Order"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-2.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="h-3 w-3"/> {label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}

function UrgencyBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    tinggi: "bg-destructive/15 text-destructive",
    sedang: "bg-warning/15 text-warning",
    rendah: "bg-success/15 text-success",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${map[level] ?? ""}`}>{level}</span>;
}
