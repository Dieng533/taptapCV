import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PLANS = [
  {
    name: "Free",
    price: "0 FCFA",
    features: ["Création de CV illimitée", "3 modèles", "Téléchargement PDF", "Personnalisation de base"],
  },
  {
    name: "Premium",
    price: "2 900 FCFA/mois",
    features: [
      "Tous les modèles (8+)",
      "Personnalisation avancée",
      "Templates ATS",
      "Plusieurs CV illimités",
      "Sans branding TAP TAP CV",
      "Assistant IA (bientôt)",
      "Lettres de motivation (bientôt)",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-center text-3xl font-bold">Tarifs</h1>
      <p className="mt-2 text-center text-muted-foreground">Commencez gratuitement, passez au Premium quand vous êtes prêt.</p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-2xl font-bold">{plan.price}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </div>
              ))}
              <Link href="/templates">
                <Button className="mt-4 w-full">Choisir {plan.name}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
