import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/apply")({
  head: () => ({ meta: [{ title: "Daftar — SortirGo" }, { name: "description", content: "Apply sebagai pekerja sortir dengan upload CV." }] }),
  component: ApplyPage,
});

function ApplyPage() {
  const nav = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", city: "", exp: "0-1" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav({ to: "/waiting" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Langkah 1 dari 2</div>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Daftar sebagai pekerja sortir</h1>
          <p className="mt-3 text-muted-foreground">Isi data dan upload CV. Sistem kami akan memverifikasi otomatis.</p>
        </div>

        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
          {/* Upload */}
          <label className="block">
            <span className="text-sm font-medium">CV / Resume (PDF, max 5MB)</span>
            <div className="mt-2 cursor-pointer rounded-xl border-2 border-dashed border-border bg-secondary/40 p-8 text-center transition-colors hover:border-primary/60 hover:bg-primary/5">
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{(file.size/1024).toFixed(0)} KB · siap diunggah</div>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <div className="mt-3 font-semibold">Klik untuk upload CV</div>
                  <div className="text-xs text-muted-foreground">atau drag & drop file ke sini</div>
                </>
              )}
            </div>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama lengkap" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Budi Santoso" required />
            <Field label="No. WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="0812..." required />
            <Field label="Kota domisili" value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="Jakarta Timur" required />
            <label className="block">
              <span className="text-sm font-medium">Pengalaman</span>
              <select value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value })} className="mt-2 h-11 w-full rounded-lg border border-border bg-input px-3 text-sm focus:border-primary focus:outline-none">
                <option value="0-1">Pemula (0-1 tahun)</option>
                <option value="1-3">1-3 tahun</option>
                <option value="3+">Lebih dari 3 tahun</option>
              </select>
            </label>
          </div>

          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4 text-success"/> Yang kamu dapat setelah lolos:</div>
            <ul className="mt-2 grid gap-1 pl-6 text-muted-foreground">
              <li>• ID pekerja digital langsung aktif</li>
              <li>• Akses dashboard order instan</li>
              <li>• Asuransi kerja & bayaran harian</li>
            </ul>
          </div>

          <button type="submit" className="w-full rounded-lg bg-gradient-primary py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01]">
            Kirim & Proses CV
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="mt-2 h-11 w-full rounded-lg border border-border bg-input px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
    </label>
  );
}