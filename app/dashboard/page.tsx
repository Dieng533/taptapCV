"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileText, Copy, Trash2, Download, Eye, Pencil, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { listResumes, duplicateResume, deleteResume } from "@/services/resumes";
import { createClient } from "@/lib/supabase/client";
import type { Resume } from "@/types/resume";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: userLoading } = useUser();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listResumes();
      setResumes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, user]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleDuplicate = async (resume: Resume) => {
    const copy = await duplicateResume(resume);
    setResumes((prev) => [copy, ...prev]);
  };

  const handleDelete = async (id: string) => {
    await deleteResume(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
    setConfirmDeleteId(null);
  };

  const firstName = profile?.first_name || user?.user_metadata?.first_name || "";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold text-primary">
            TAP TAP CV
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {firstName || "👋"} 👋</h1>
            <p className="text-sm text-muted-foreground">
              {resumes.length} CV · Gérez, modifiez et téléchargez vos CV
            </p>
          </div>
          <Link href="/templates">
            <Button size="lg">
              <Plus className="h-4 w-4" /> Créer un nouveau CV
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">Vous n'avez encore aucun CV.</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Créez votre premier CV professionnel en quelques minutes.
            </p>
            <Link href="/templates">
              <Button className="mt-2">Créer mon premier CV</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <Card key={resume.id} className="overflow-hidden">
                <div className="flex h-40 items-center justify-center bg-muted text-4xl">📄</div>
                <CardContent className="space-y-3 pt-4">
                  <div>
                    <p className="truncate font-semibold">{resume.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Modèle {resume.template_id} · Modifié le{" "}
                      {new Date(resume.updated_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/dashboard/resumes/${resume.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-3.5 w-3.5" /> Modifier
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => handleDuplicate(resume)}>
                      <Copy className="h-3.5 w-3.5" /> Dupliquer
                    </Button>
                    <Link href={`/dashboard/resumes/${resume.id}?tab=download`}>
                      <Button size="sm" variant="outline">
                        <Download className="h-3.5 w-3.5" /> PDF
                      </Button>
                    </Link>
                    {confirmDeleteId === resume.id ? (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(resume.id)}>
                          Confirmer
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                          Annuler
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setConfirmDeleteId(resume.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Supprimer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
