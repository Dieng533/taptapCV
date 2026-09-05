"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createResume } from "@/services/resumes";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";

const TEMPLATES = [
  { id: "classic", name: "Classic", desc: "Mise en page sobre et intemporelle", premium: false },
  { id: "modern", name: "Modern", desc: "Design épuré avec accents de couleur", premium: false },
  { id: "minimal", name: "Minimal", desc: "Minimaliste, focus sur le contenu", premium: false },
  { id: "executive", name: "Executive", desc: "Pour profils senior / direction", premium: true },
  { id: "creative", name: "Creative", desc: "Mise en page originale pour profils créatifs", premium: true },
  { id: "elegant", name: "Elegant", desc: "Typographie soignée, style premium", premium: true },
  { id: "ats", name: "ATS Friendly", desc: "Optimisé pour les logiciels de recrutement", premium: false },
  { id: "professional", name: "Professional", desc: "Format classique orienté entreprise", premium: true },
];

export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useUser();
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const handleUse = async (templateId: string) => {
    if (!user) {
      router.push("/register");
      return;
    }
    setCreatingId(templateId);
    try {
      const resume = await createResume(templateId);
      router.push(`/dashboard/resumes/${resume.id}`);
    } finally {
      setCreatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold text-primary">
            TAP TAP CV
          </Link>
          <Link href={user ? "/dashboard" : "/login"}>
            <Button variant="outline" size="sm">
              {user ? "Mon tableau de bord" : "Se connecter"}
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold">Choisissez un modèle</h1>
        <p className="mt-2 text-muted-foreground">
          8 modèles professionnels, tous personnalisables et compatibles PDF.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <Card key={t.id} className="overflow-hidden">
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-muted to-background text-5xl">
                🗂️
              </div>
              <CardContent className="space-y-2 pt-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{t.name}</p>
                  {t.premium && <Badge>Premium</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={creatingId === t.id}
                  onClick={() => handleUse(t.id)}
                >
                  {creatingId === t.id ? "Création..." : "Utiliser ce modèle"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
