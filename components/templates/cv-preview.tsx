"use client";

import type { Resume } from "@/types/resume";
import { formatMonthYear } from "@/lib/utils";

const FONT_STACK: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  Roboto: "'Roboto', sans-serif",
  Poppins: "'Poppins', sans-serif",
  "Open Sans": "'Open Sans', sans-serif",
  Lato: "'Lato', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
};

// Modèles qui utilisent une bande latérale colorée (sidebar) vs un en-tête classique
const SIDEBAR_TEMPLATES = new Set(["modern", "creative", "elegant", "professional"]);
const MINIMAL_TEMPLATES = new Set(["minimal", "ats"]);

export function CvPreview({ resume, id }: { resume: Resume; id?: string }) {
  const { data, primary_color, font_family, photo_shape, section_order } = resume;
  const { personalInfo: p } = data;
  const fontFamily = FONT_STACK[font_family] || FONT_STACK.Inter;
  const useSidebar = SIDEBAR_TEMPLATES.has(resume.template_id);
  const isMinimal = MINIMAL_TEMPLATES.has(resume.template_id);

  const photoClasses =
    photo_shape === "circle" ? "rounded-full" : photo_shape === "square" ? "rounded-md" : "hidden";

  const renderSection = (key: string) => {
    switch (key) {
      case "experience":
        return data.experiences.length > 0 ? (
          <Section key={key} title="Expérience professionnelle" color={primary_color} minimal={isMinimal}>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">{exp.position || "Poste"}</p>
                  <p className="text-xs text-gray-500">
                    {formatMonthYear(exp.startDate)} — {exp.isCurrent ? "Présent" : formatMonthYear(exp.endDate)}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  {exp.company}
                  {exp.city ? ` · ${exp.city}` : ""}
                </p>
                {exp.description && <p className="mt-1 text-xs leading-relaxed text-gray-700">{exp.description}</p>}
              </div>
            ))}
          </Section>
        ) : null;
      case "education":
        return data.educations.length > 0 ? (
          <Section key={key} title="Formation" color={primary_color} minimal={isMinimal}>
            {data.educations.map((ed) => (
              <div key={ed.id} className="mb-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">{ed.degree || "Diplôme"}</p>
                  <p className="text-xs text-gray-500">
                    {formatMonthYear(ed.startDate)} — {formatMonthYear(ed.endDate)}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  {ed.school}
                  {ed.city ? ` · ${ed.city}` : ""}
                </p>
                {ed.description && <p className="mt-1 text-xs text-gray-700">{ed.description}</p>}
              </div>
            ))}
          </Section>
        ) : null;
      case "skills":
        return data.skills.length > 0 ? (
          <Section key={key} title="Compétences" color={primary_color} minimal={isMinimal}>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full px-2.5 py-1 text-[11px]"
                  style={{ backgroundColor: `${primary_color}1a`, color: primary_color }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        ) : null;
      case "languages":
        return data.languages.length > 0 ? (
          <Section key={key} title="Langues" color={primary_color} minimal={isMinimal}>
            <ul className="space-y-1 text-xs text-gray-700">
              {data.languages.map((l) => (
                <li key={l.id}>
                  <span className="font-medium">{l.name}</span> — {l.level}
                </li>
              ))}
            </ul>
          </Section>
        ) : null;
      case "certifications":
        return data.certifications.length > 0 ? (
          <Section key={key} title="Certifications" color={primary_color} minimal={isMinimal}>
            <ul className="space-y-1 text-xs text-gray-700">
              {data.certifications.map((c) => (
                <li key={c.id}>
                  {c.name} {c.issuer ? `— ${c.issuer}` : ""} {c.issuedDate ? `(${formatMonthYear(c.issuedDate)})` : ""}
                </li>
              ))}
            </ul>
          </Section>
        ) : null;
      case "projects":
        return data.projects.length > 0 ? (
          <Section key={key} title="Projets" color={primary_color} minimal={isMinimal}>
            {data.projects.map((pr) => (
              <div key={pr.id} className="mb-2">
                <p className="text-sm font-semibold">{pr.name}</p>
                {pr.technologies && <p className="text-xs text-gray-500">{pr.technologies}</p>}
                {pr.description && <p className="text-xs text-gray-700">{pr.description}</p>}
              </div>
            ))}
          </Section>
        ) : null;
      case "interests":
        return data.interests.length > 0 ? (
          <Section key={key} title="Centres d'intérêt" color={primary_color} minimal={isMinimal}>
            <p className="text-xs text-gray-700">{data.interests.map((i) => i.name).join(" · ")}</p>
          </Section>
        ) : null;
      case "references":
        return data.references.length > 0 ? (
          <Section key={key} title="Références" color={primary_color} minimal={isMinimal}>
            {data.references.map((r) => (
              <div key={r.id} className="mb-1 text-xs text-gray-700">
                <span className="font-medium">{r.name}</span>
                {r.role ? ` — ${r.role}` : ""} {r.organization ? `(${r.organization})` : ""}
              </div>
            ))}
          </Section>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div
      id={id}
      className="cv-page cv-print-area mx-auto overflow-hidden text-gray-900"
      style={{ fontFamily }}
    >
      {useSidebar ? (
        <div className="flex h-full">
          <aside className="w-1/3 p-6 text-white" style={{ backgroundColor: primary_color }}>
            {photo_shape !== "none" && (
              <div className={`mb-4 h-24 w-24 bg-white/20 ${photoClasses}`} />
            )}
            <h1 className="text-xl font-bold leading-tight">
              {p.firstName} {p.lastName}
            </h1>
            <p className="mt-1 text-sm opacity-90">{p.jobTitle}</p>
            <div className="mt-6 space-y-1 text-xs opacity-90">
              {p.email && <p>{p.email}</p>}
              {p.phone && <p>{p.phone}</p>}
              {(p.city || p.country) && <p>{[p.city, p.country].filter(Boolean).join(", ")}</p>}
              {p.linkedin && <p>{p.linkedin}</p>}
              {p.github && <p>{p.github}</p>}
              {p.website && <p>{p.website}</p>}
            </div>
          </aside>
          <div className="flex-1 p-6">
            {data.summary && <p className="mb-4 text-xs leading-relaxed text-gray-700">{data.summary}</p>}
            {section_order.map(renderSection)}
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="mb-6 flex items-center gap-4 border-b pb-4" style={{ borderColor: primary_color }}>
            {photo_shape !== "none" && <div className={`h-20 w-20 shrink-0 bg-gray-200 ${photoClasses}`} />}
            <div>
              <h1 className="text-2xl font-bold" style={{ color: primary_color }}>
                {p.firstName} {p.lastName}
              </h1>
              <p className="text-sm text-gray-600">{p.jobTitle}</p>
              <p className="mt-1 text-xs text-gray-500">
                {[p.email, p.phone, p.city].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
          {data.summary && <p className="mb-4 text-xs leading-relaxed text-gray-700">{data.summary}</p>}
          {section_order.map(renderSection)}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  color,
  minimal,
  children,
}: {
  title: string;
  color: string;
  minimal?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h2
        className={
          minimal
            ? "mb-2 text-xs font-bold uppercase tracking-wider text-gray-800"
            : "mb-2 text-xs font-bold uppercase tracking-wider"
        }
        style={minimal ? {} : { color }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
