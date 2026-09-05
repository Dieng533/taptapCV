import Link from "next/link";
import { Check, FileDown, Palette, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TEMPLATE_NAMES = ["Classic", "Modern", "Minimal", "Executive", "Creative", "Elegant", "ATS Friendly", "Professional"];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-lg font-bold text-primary">TAP TAP CV</span>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/">Accueil</Link>
            <Link href="/templates">Modèles</Link>
            <Link href="/features">Fonctionnalités</Link>
            <Link href="/pricing">Tarifs</Link>
            <Link href="/about">À propos</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Se connecter
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="sm">Créer mon CV</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Créez un CV professionnel en quelques minutes
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Choisissez un modèle, personnalisez votre CV et téléchargez-le en PDF. Simple, rapide et professionnel.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/templates">
            <Button size="lg">Créer mon CV gratuitement</Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline">
              Voir les modèles
            </Button>
          </Link>
        </div>
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-muted/40 p-6">
          <div className="mx-auto aspect-[4/3] max-w-md rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-8">
            <div className="mb-4 h-16 w-16 rounded-full bg-primary/30" />
            <div className="mb-2 h-4 w-2/3 rounded bg-foreground/20" />
            <div className="mb-4 h-3 w-1/2 rounded bg-foreground/10" />
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-foreground/10" />
              <div className="h-2 w-5/6 rounded bg-foreground/10" />
              <div className="h-2 w-4/6 rounded bg-foreground/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold">Pourquoi TAP TAP CV ?</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Feature icon={<Zap className="h-6 w-6" />} title="Rapide" desc="Créez votre CV complet en quelques minutes, sans effort." />
            <Feature icon={<Palette className="h-6 w-6" />} title="Personnalisable" desc="Couleurs, polices, mise en page : adaptez le design à votre profil." />
            <Feature icon={<FileDown className="h-6 w-6" />} title="Export PDF parfait" desc="Un CV prêt à l'emploi, imprimable et compatible ATS." />
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            {[
              "Créez un compte gratuitement",
              "Choisissez un modèle",
              "Remplissez vos informations",
              "Téléchargez votre CV en PDF",
            ].map((step, i) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modèles */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold">Nos modèles</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TEMPLATE_NAMES.map((name) => (
              <Card key={name} className="overflow-hidden">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-muted to-background text-3xl">
                  📄
                </div>
                <CardContent className="p-3 text-center text-sm font-medium">{name}</CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/templates">
              <Button variant="outline">Voir tous les modèles</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold">Fonctionnalités</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "Aperçu en temps réel",
              "Sauvegarde automatique",
              "Plusieurs CV",
              "Réorganisation par glisser-déposer",
              "Sections personnalisées",
              "Export PDF haute qualité",
              "100% responsive",
              "Mode clair / sombre",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-primary" /> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avis */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold">Avis utilisateurs</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { name: "Aminata S.", text: "J'ai créé mon CV en 10 minutes, exactement ce dont j'avais besoin." },
              { name: "Moussa K.", text: "Interface très simple, le rendu PDF est impeccable." },
              { name: "Fatou D.", text: "Les modèles sont modernes et professionnels." },
            ].map((r) => (
              <Card key={r.name}>
                <CardContent className="pt-6">
                  <div className="mb-2 flex gap-0.5 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">"{r.text}"</p>
                  <p className="mt-3 text-sm font-medium">{r.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold">Prêt à créer votre CV ?</h2>
        <p className="mt-2 text-muted-foreground">Gratuit pour commencer, aucune carte bancaire requise.</p>
        <Link href="/templates">
          <Button size="lg" className="mt-6">
            Commencer maintenant
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} TAP TAP CV. Tous droits réservés.</p>
        <p className="mt-1 italic">« Créez votre CV. Tapez, personnalisez, téléchargez. »</p>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
