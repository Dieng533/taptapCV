"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Pencil, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { getResume, updateResume } from "@/services/resumes";
import { useAutosave } from "@/hooks/use-autosave";
import { CvPreview } from "@/components/templates/cv-preview";
import { PersonalInfoForm } from "@/components/resume/personal-info-form";
import { ExperienceForm, EducationForm, SkillsForm, LanguagesForm } from "@/components/resume/sections-forms";
import { CustomizePanel } from "@/components/resume/customize-panel";
import { PdfDownloadButton } from "@/components/resume/pdf-download-button";
import type { Resume } from "@/types/resume";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const STEPS = [
  { key: "personal", label: "Informations personnelles" },
  { key: "experience", label: "Expérience" },
  { key: "education", label: "Formation" },
  { key: "skills", label: "Compétences" },
  { key: "languages", label: "Langues" },
  { key: "customize", label: "Personnalisation" },
];

export default function ResumeBuilderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
      
      getResume(params.id)
        .then(setResume)
        .catch(() => router.push("/dashboard"))
        .finally(() => setLoading(false));
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const saveStatus = useAutosave(
    resume,
    useCallback(async (r: Resume | null) => {
      if (!r) return;
      await updateResume(r.id, {
        title: r.title,
        data: r.data,
        template_id: r.template_id,
        primary_color: r.primary_color,
        font_family: r.font_family,
        photo_shape: r.photo_shape,
        section_order: r.section_order,
      });
    }, [])
  );

  if (loading || !resume) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const patchData = (patch: Partial<Resume["data"]>) =>
    setResume((r) => (r ? { ...r, data: { ...r.data, ...patch } } : r));

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Input
            value={resume.title}
            onChange={(e) => setResume({ ...resume, title: e.target.value })}
            className="h-8 w-48 border-none bg-transparent px-1 text-sm font-medium focus-visible:ring-1"
          />
          <SaveStatusBadge status={saveStatus} />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5 lg:hidden">
            <button
              className={cn("rounded-md px-3 py-1 text-xs", mobileView === "edit" && "bg-primary text-primary-foreground")}
              onClick={() => setMobileView("edit")}
            >
              <Pencil className="mr-1 inline h-3 w-3" /> Modifier
            </button>
            <button
              className={cn("rounded-md px-3 py-1 text-xs", mobileView === "preview" && "bg-primary text-primary-foreground")}
              onClick={() => setMobileView("preview")}
            >
              <Eye className="mr-1 inline h-3 w-3" /> Aperçu
            </button>
          </div>
          <PdfDownloadButton resume={resume} />
        </div>
      </header>

      <div className="border-b border-border bg-background px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Progress value={progress} className="flex-1" />
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            Étape {step + 1}/{STEPS.length}
          </span>
        </div>
        <div className="mx-auto mt-2 flex max-w-6xl flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(i)}
              className={cn(
                "rounded-full px-3 py-1 text-xs",
                i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-2">
        <section className={cn("space-y-6", mobileView === "preview" && "hidden lg:block")}>
          {step === 0 && (
            <PersonalInfoForm
              value={resume.data.personalInfo}
              onChange={(personalInfo) => patchData({ personalInfo })}
              summary={resume.data.summary}
              onSummaryChange={(summary) => patchData({ summary })}
              userId={userId}
            />
          )}
          {step === 1 && (
            <ExperienceForm items={resume.data.experiences} onChange={(experiences) => patchData({ experiences })} />
          )}
          {step === 2 && (
            <EducationForm items={resume.data.educations} onChange={(educations) => patchData({ educations })} />
          )}
          {step === 3 && <SkillsForm items={resume.data.skills} onChange={(skills) => patchData({ skills })} />}
          {step === 4 && (
            <LanguagesForm items={resume.data.languages} onChange={(languages) => patchData({ languages })} />
          )}
          {step === 5 && (
            <CustomizePanel
              color={resume.primary_color}
              font={resume.font_family}
              photoShape={resume.photo_shape}
              onColorChange={(primary_color) => setResume({ ...resume, primary_color })}
              onFontChange={(font_family) => setResume({ ...resume, font_family })}
              onPhotoShapeChange={(photo_shape) => setResume({ ...resume, photo_shape })}
            />
          )}
          <div className="flex justify-between pt-4">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Précédent
            </Button>
            <Button disabled={step === STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>
              Suivant
            </Button>
          </div>
        </section>

        <section className={cn("flex justify-center", mobileView === "edit" && "hidden lg:flex")}>
          <div className="scale-[0.5] origin-top sm:scale-[0.65] lg:scale-[0.55] xl:scale-[0.7]">
            <CvPreview resume={resume} id="cv-print-area" />
          </div>
        </section>
      </main>
    </div>
  );
}

function SaveStatusBadge({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
  if (status === "idle") return null;
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      {status === "saving" && (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="h-3 w-3 text-green-600" /> Sauvegardé
        </>
      )}
      {status === "error" && <span className="text-red-600">Erreur de sauvegarde</span>}
    </span>
  );
}
