import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Boxes, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Masuk — SortirGo" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) nav({ to: "/dashboard" });
  }, [user, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Akun dibuat! Cek email untuk verifikasi.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Selamat datang kembali!");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Gagal");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (r.error) { toast.error("Login Google gagal"); setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary shadow-glow"><Boxes className="h-5 w-5 text-primary-foreground"/></div>
          <span className="font-display text-xl font-bold">SortirGo</span>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <h1 className="text-2xl font-bold">{mode === "login" ? "Masuk" : "Buat Akun"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Masuk untuk lihat order & profil pekerja." : "Buat akun untuk apply jadi pekerja sortir."}
          </p>

          <button onClick={google} disabled={busy} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary py-2.5 text-sm font-semibold hover:bg-secondary/70">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Lanjut dengan Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border"/>atau<div className="h-px flex-1 bg-border"/></div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm focus:border-primary focus:outline-none"/>
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm focus:border-primary focus:outline-none"/>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={6} className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm focus:border-primary focus:outline-none"/>
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin"/>}
              {mode === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>

          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground">
            {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </button>
        </div>
      </div>
    </div>
  );
}
