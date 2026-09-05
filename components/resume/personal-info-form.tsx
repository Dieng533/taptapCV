"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { uploadPhoto } from "@/lib/supabase/storage";
import type { PersonalInfo } from "@/types/resume";

export function PersonalInfoForm({
  value,
  onChange,
  summary,
  onSummaryChange,
  userId,
}: {
  value: PersonalInfo;
  onChange: (v: PersonalInfo) => void;
  summary: string;
  onSummaryChange: (v: string) => void;
  userId?: string;
}) {
  const set = (field: keyof PersonalInfo, v: string) => onChange({ ...value, [field]: v });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploading(true);
    try {
      const photoUrl = await uploadPhoto(file, userId);
      set('photoUrl', photoUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload de la photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    set('photoUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Photo Upload Section */}
      <div>
        <Label>Photo de profil</Label>
        <div className="mt-2 flex items-center gap-4">
          {value.photoUrl ? (
            <div className="relative">
              <img
                src={value.photoUrl}
                alt="Photo de profil"
                className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                onClick={handleRemovePhoto}
              >
                ×
              </Button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              <span className="text-gray-400 text-xs">Aucune photo</span>
            </div>
          )}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading || !userId}
              className="hidden"
              id="photo-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !userId}
            >
              {uploading ? 'Upload en cours...' : 'Choisir une photo'}
            </Button>
            {!userId && (
              <p className="text-xs text-gray-500 mt-1">Connectez-vous pour ajouter une photo</p>
            )}
            <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Prénom</Label>
          <Input value={value.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="Aly" />
        </div>
        <div>
          <Label>Nom</Label>
          <Input value={value.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Dieng" />
        </div>
      </div>
      <div>
        <Label>Titre professionnel</Label>
        <Input
          value={value.jobTitle}
          onChange={(e) => set("jobTitle", e.target.value)}
          placeholder="Développeur Full Stack"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Email</Label>
          <Input type="email" value={value.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <Label>Téléphone</Label>
          <Input value={value.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+221 XX XXX XX XX" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Ville</Label>
          <Input value={value.city ?? ""} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div>
          <Label>Pays</Label>
          <Input value={value.country ?? ""} onChange={(e) => set("country", e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Adresse</Label>
        <Input value={value.address ?? ""} onChange={(e) => set("address", e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Site web</Label>
          <Input value={value.website ?? ""} onChange={(e) => set("website", e.target.value)} />
        </div>
        <div>
          <Label>LinkedIn</Label>
          <Input value={value.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} />
        </div>
        <div>
          <Label>GitHub</Label>
          <Input value={value.github ?? ""} onChange={(e) => set("github", e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Résumé / Profil professionnel</Label>
        <Textarea
          rows={4}
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Développeur passionné avec 5 ans d'expérience..."
        />
      </div>
    </div>
  );
}
