"use client";

import { v4 as uuid } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListSectionEditor } from "./list-section-editor";
import type { Experience, Education, Skill, Language } from "@/types/resume";

export function ExperienceForm({ items, onChange }: { items: Experience[]; onChange: (v: Experience[]) => void }) {
  return (
    <ListSectionEditor<Experience>
      title="une expérience"
      items={items}
      onChange={onChange}
      emptyLabel="Aucune expérience ajoutée pour le moment."
      newItem={() => ({
        id: uuid(),
        position: "",
        company: "",
        city: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
      })}
      renderItem={(item, update) => (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Poste</Label>
              <Input value={item.position} onChange={(e) => update({ position: e.target.value })} />
            </div>
            <div>
              <Label>Entreprise</Label>
              <Input value={item.company} onChange={(e) => update({ company: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Ville</Label>
              <Input value={item.city ?? ""} onChange={(e) => update({ city: e.target.value })} />
            </div>
            <div>
              <Label>Début</Label>
              <Input type="month" value={item.startDate} onChange={(e) => update({ startDate: e.target.value })} />
            </div>
            <div>
              <Label>Fin</Label>
              <Input
                type="month"
                value={item.endDate ?? ""}
                disabled={item.isCurrent}
                onChange={(e) => update({ endDate: e.target.value })}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.isCurrent}
              onChange={(e) => update({ isCurrent: e.target.checked, endDate: "" })}
            />
            Poste actuel
          </label>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={item.description ?? ""} onChange={(e) => update({ description: e.target.value })} />
          </div>
        </div>
      )}
    />
  );
}

export function EducationForm({ items, onChange }: { items: Education[]; onChange: (v: Education[]) => void }) {
  return (
    <ListSectionEditor<Education>
      title="une formation"
      items={items}
      onChange={onChange}
      emptyLabel="Aucune formation ajoutée pour le moment."
      newItem={() => ({ id: uuid(), degree: "", school: "", city: "", startDate: "", endDate: "", description: "" })}
      renderItem={(item, update) => (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Diplôme</Label>
              <Input value={item.degree} onChange={(e) => update({ degree: e.target.value })} />
            </div>
            <div>
              <Label>Établissement</Label>
              <Input value={item.school} onChange={(e) => update({ school: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Ville</Label>
              <Input value={item.city ?? ""} onChange={(e) => update({ city: e.target.value })} />
            </div>
            <div>
              <Label>Début</Label>
              <Input type="month" value={item.startDate} onChange={(e) => update({ startDate: e.target.value })} />
            </div>
            <div>
              <Label>Fin</Label>
              <Input type="month" value={item.endDate ?? ""} onChange={(e) => update({ endDate: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={2} value={item.description ?? ""} onChange={(e) => update({ description: e.target.value })} />
          </div>
        </div>
      )}
    />
  );
}

export function SkillsForm({ items, onChange }: { items: Skill[]; onChange: (v: Skill[]) => void }) {
  return (
    <ListSectionEditor<Skill>
      title="une compétence"
      items={items}
      onChange={onChange}
      emptyLabel="Aucune compétence ajoutée pour le moment."
      newItem={() => ({ id: uuid(), name: "", level: 3 })}
      renderItem={(item, update) => (
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label>Compétence</Label>
            <Input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="React" />
          </div>
          <div>
            <Label>Niveau (1-5)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={item.level}
              onChange={(e) => update({ level: Number(e.target.value) })}
            />
          </div>
        </div>
      )}
    />
  );
}

export function LanguagesForm({ items, onChange }: { items: Language[]; onChange: (v: Language[]) => void }) {
  return (
    <ListSectionEditor<Language>
      title="une langue"
      items={items}
      onChange={onChange}
      emptyLabel="Aucune langue ajoutée pour le moment."
      newItem={() => ({ id: uuid(), name: "", level: "Intermédiaire" })}
      renderItem={(item, update) => (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Langue</Label>
            <Input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="Français" />
          </div>
          <div>
            <Label>Niveau</Label>
            <select
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
              value={item.level}
              onChange={(e) => update({ level: e.target.value })}
            >
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Courant</option>
              <option>Bilingue</option>
              <option>Langue maternelle</option>
            </select>
          </div>
        </div>
      )}
    />
  );
}
