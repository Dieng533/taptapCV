"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "Bleu", value: "#2563eb" },
  { name: "Noir", value: "#111827" },
  { name: "Vert", value: "#059669" },
  { name: "Rouge", value: "#dc2626" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Orange", value: "#ea580c" },
];

const FONTS = ["Inter", "Roboto", "Poppins", "Open Sans", "Lato", "Montserrat"];

export function CustomizePanel({
  color,
  font,
  photoShape,
  onColorChange,
  onFontChange,
  onPhotoShapeChange,
}: {
  color: string;
  font: string;
  photoShape: "circle" | "square" | "none";
  onColorChange: (v: string) => void;
  onFontChange: (v: string) => void;
  onPhotoShapeChange: (v: "circle" | "square" | "none") => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Couleur principale</Label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.name}
              onClick={() => onColorChange(c.value)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                color === c.value ? "border-foreground" : "border-transparent"
              )}
              style={{ backgroundColor: c.value }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded-full border border-border"
            title="Personnalisée"
          />
        </div>
      </div>

      <div>
        <Label>Typographie</Label>
        <select
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
          value={font}
          onChange={(e) => onFontChange(e.target.value)}
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Photo</Label>
        <div className="flex gap-2">
          {(["circle", "square", "none"] as const).map((shape) => (
            <button
              key={shape}
              type="button"
              onClick={() => onPhotoShapeChange(shape)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs capitalize",
                photoShape === shape ? "border-primary bg-primary/10 text-primary" : "border-border"
              )}
            >
              {shape === "circle" ? "Cercle" : shape === "square" ? "Carrée" : "Sans photo"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
