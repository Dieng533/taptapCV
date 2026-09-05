import { createClient } from "@/lib/supabase/client";
import { EMPTY_RESUME_DATA, DEFAULT_SECTION_ORDER, type Resume, type ResumeData } from "@/types/resume";

export async function listResumes() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data as Resume[];
}

export async function getResume(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("resumes").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Resume;
}

export async function createResume(templateId: string, title = "Mon CV") {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non authentifié");

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title,
      template_id: templateId,
      data: EMPTY_RESUME_DATA,
      section_order: DEFAULT_SECTION_ORDER,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Resume;
}

export async function updateResume(id: string, patch: Partial<Resume>) {
  const supabase = createClient();
  const { data, error } = await supabase.from("resumes").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data as Resume;
}

export async function updateResumeData(id: string, data: ResumeData) {
  return updateResume(id, { data });
}

export async function duplicateResume(resume: Resume) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non authentifié");

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: `${resume.title} (copie)`,
      template_id: resume.template_id,
      data: resume.data,
      primary_color: resume.primary_color,
      font_family: resume.font_family,
      photo_shape: resume.photo_shape,
      section_order: resume.section_order,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Resume;
}

export async function deleteResume(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("resumes").delete().eq("id", id);
  if (error) throw error;
}
