import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { useState } from "react";
import { MapPin, Clock, Boxes, Zap, TrendingUp, Wallet, Star } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SortirGo" }] }),
  component: Dashboard,
});

const initialOrders = [
  { id: "ORD-2841", warehouse: "Gudang JNE Bekasi Timur", distance: "2.4 km", duration: "4 jam", packages: 320, pay: 95000, urgency: "tinggi" },
  { id: "ORD-2842", warehouse: "Tokopedia Fulfillment Cakung", distance: "5.1 km", duration: "6 jam", packages: 480, pay: 142000, urgency: "sedang" },
  { id: "ORD-2843", warehouse: "Shopee Xpress Pulogadung", distance: "3.8 km", duration: "3 jam", packages: 210, pay: 72000, urgency: "rendah" },
  { id: "ORD-2844", warehouse: "JNT Bandar Kemayoran", distance: "7.2 km", duration: "5 jam", packages: 390, pay: 118000, urgency: "tinggi" },
];

function Dashboard() {
  const [orders, setOrders] = useState(initialOrders);
  const [online, setOnline] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Halo, Budi 👋</h1>
            <p className="text-sm text-muted-foreground">Order baru muncul setiap detik. Tap untuk terima instan.</p>
          </div>
          <button onClick={() => setOnline(!online)} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${online ? "border-success/50 bg-success/10 text-success" : "border-border bg-secondary text-muted-foreground"}`}>
            <span className={`h-2 w-2 rounded-full ${online ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
            {online ? "Online — siap kerja" : "Offline"}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Stat icon={Wallet} label="Pendapatan hari ini" value="Rp 240.000" accent />
          <Stat icon={Boxes} label="Order selesai" value="3" />
          <Stat icon={Star} label="Rating" value="4.92" />
          <Stat icon={TrendingUp} label="Efisiensi" value="96%" />
        </div>

        {/* Orders */}
        <div className="mt-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Order tersedia</h2>
            <p className="text-sm text-muted-foreground">{orders.length} order menunggu — tanpa antri, tap langsung dapat</p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <Zap className="h-3.5 w-3.5 text-primary" /> Auto-refresh tiap 5 detik
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {orders.map((o) => (
            <div key={o.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-glow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                    <UrgencyBadge level={o.urgency} />
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">{o.warehouse}</h3>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-primary">Rp {o.pay.toLocaleString("id-ID")}</div>
                  <div className="text-xs text-muted-foreground">net pendapatan</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Meta icon={MapPin} label="Jarak" value={o.distance} />
                <Meta icon={Clock} label="Durasi" value={o.duration} />
                <Meta icon={Boxes} label="Paket" value={`${o.packages}`} />
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => setOrders(orders.filter((x) => x.id !== o.id))} className="flex-1 rounded-lg border border-border bg-secondary py-2.5 text-sm font-medium hover:bg-secondary/70">
                  Lewati
                </button>
                <Link to="/navigate" className="flex-1 rounded-lg bg-gradient-primary py-2.5 text-center text-sm font-bold text-primary-foreground shadow-glow">
                  Terima Order
                </Link>
              </div>
            </div>
          ))}
        </div>
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
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${map[level]}`}>{level}</span>;
}