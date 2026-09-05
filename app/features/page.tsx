import { Check } from "lucide-react";

const FEATURES = [
  "Aperçu en temps réel", "Sauvegarde automatique", "Plusieurs CV", "Duplication de CV",
  "Réorganisation par glisser-déposer", "Sections personnalisées", "8 modèles professionnels",
  "Personnalisation couleurs et polices", "Export PDF haute qualité", "100% responsive",
  "Mode clair / sombre", "Authentification sécurisée (Supabase)",
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">Fonctionnalités</h1>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary" /> {f}
          </div>
        ))}
      </div>
    </div>
  );
}
