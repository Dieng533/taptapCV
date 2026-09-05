const FAQS = [
  { q: "Est-ce gratuit ?", a: "Oui, vous pouvez créer et télécharger votre CV gratuitement avec les modèles de base." },
  { q: "Puis-je créer plusieurs CV ?", a: "Oui, vous pouvez créer, dupliquer et gérer plusieurs CV depuis votre tableau de bord." },
  { q: "Le PDF est-il compatible ATS ?", a: "Le modèle 'ATS Friendly' est spécifiquement optimisé pour les logiciels de recrutement." },
  { q: "Mes données sont-elles sécurisées ?", a: "Oui, toutes les données sont protégées via Supabase avec Row Level Security." },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Questions fréquentes</h1>
      <div className="mt-8 space-y-6">
        {FAQS.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
