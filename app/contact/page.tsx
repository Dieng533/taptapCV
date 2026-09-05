"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-muted-foreground">Une question ? Écrivez-nous.</p>
      {sent ? (
        <p className="mt-6 text-sm">Merci, votre message a bien été envoyé.</p>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <Label>Nom</Label>
            <Input required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" required />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea rows={5} required />
          </div>
          <Button type="submit">Envoyer</Button>
        </form>
      )}
    </div>
  );
}
