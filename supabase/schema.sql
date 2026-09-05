-- =========================================================
-- TAP TAP CV — SCHEMA POSTGRESQL / SUPABASE
-- =========================================================

-- Extension pour uuid
create extension if not exists "uuid-ossp";

-- =========================================================
-- 1. PROFILES
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- 2. TEMPLATES (catalogue des modèles de CV)
-- =========================================================
create table if not exists public.templates (
  id text primary key,
  name text not null,
  description text,
  is_premium boolean not null default false,
  preview_url text,
  created_at timestamptz not null default now()
);

insert into public.templates (id, name, description, is_premium) values
  ('classic', 'Classic', 'Mise en page sobre et intemporelle', false),
  ('modern', 'Modern', 'Design épuré avec accents de couleur', false),
  ('minimal', 'Minimal', 'Minimaliste, focus sur le contenu', false),
  ('executive', 'Executive', 'Pour profils senior / direction', true),
  ('creative', 'Creative', 'Mise en page originale pour profils créatifs', true),
  ('elegant', 'Elegant', 'Typographie soignée, style premium', true),
  ('ats', 'ATS Friendly', 'Optimisé pour les logiciels de recrutement', false),
  ('professional', 'Professional', 'Format classique orienté entreprise', true)
on conflict (id) do nothing;

-- =========================================================
-- 3. RESUMES (CV) — données dynamiques en JSONB
-- =========================================================
create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Mon CV',
  template_id text not null default 'classic' references public.templates(id),
  data jsonb not null default '{}'::jsonb,      -- infos perso, résumé, sections custom, ordre des sections
  primary_color text not null default '#2563eb',
  font_family text not null default 'Inter',
  photo_shape text not null default 'circle' check (photo_shape in ('circle','square','none')),
  section_order text[] not null default array['profile','experience','education','skills','languages'],
  is_public boolean not null default false,
  public_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on public.resumes(user_id);

-- =========================================================
-- 4. EXPERIENCES
-- =========================================================
create table if not exists public.experiences (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  position text,
  company text,
  city text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  sort_order int not null default 0
);

-- =========================================================
-- 5. EDUCATIONS
-- =========================================================
create table if not exists public.educations (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  degree text,
  school text,
  city text,
  start_date date,
  end_date date,
  description text,
  sort_order int not null default 0
);

-- =========================================================
-- 6. SKILLS
-- =========================================================
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  name text not null,
  level int not null default 3 check (level between 1 and 5),
  sort_order int not null default 0
);

-- =========================================================
-- 7. LANGUAGES
-- =========================================================
create table if not exists public.languages (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  name text not null,
  level text not null default 'Intermédiaire',
  sort_order int not null default 0
);

-- =========================================================
-- 8. CERTIFICATIONS
-- =========================================================
create table if not exists public.certifications (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  name text not null,
  issuer text,
  issued_date date,
  sort_order int not null default 0
);

-- =========================================================
-- 9. PROJECTS
-- =========================================================
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  name text not null,
  description text,
  technologies text,
  link text,
  sort_order int not null default 0
);

-- =========================================================
-- 10. INTERESTS
-- =========================================================
create table if not exists public.interests (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  name text not null,
  description text,
  sort_order int not null default 0
);

-- =========================================================
-- 11. REFERENCES
-- =========================================================
create table if not exists public."references" (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  name text not null,
  role text,
  organization text,
  email text,
  phone text,
  sort_order int not null default 0
);

-- =========================================================
-- 12. RESUME_SECTIONS (sections personnalisées)
-- =========================================================
create table if not exists public.resume_sections (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  title text not null,
  content jsonb not null default '[]'::jsonb,
  sort_order int not null default 0
);

-- =========================================================
-- TRIGGER updated_at générique
-- =========================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.resumes;
create trigger set_updated_at before update on public.resumes
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.experiences enable row level security;
alter table public.educations enable row level security;
alter table public.skills enable row level security;
alter table public.languages enable row level security;
alter table public.certifications enable row level security;
alter table public.projects enable row level security;
alter table public.interests enable row level security;
alter table public."references" enable row level security;
alter table public.resume_sections enable row level security;
alter table public.templates enable row level security;

-- Templates : lecture publique
create policy "templates_public_read" on public.templates for select using (true);

-- Profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Resumes : propriétaire uniquement, + lecture publique si is_public = true
create policy "resumes_select_own" on public.resumes for select
  using (auth.uid() = user_id or is_public = true);
create policy "resumes_insert_own" on public.resumes for insert
  with check (auth.uid() = user_id);
create policy "resumes_update_own" on public.resumes for update
  using (auth.uid() = user_id);
create policy "resumes_delete_own" on public.resumes for delete
  using (auth.uid() = user_id);

-- Tables enfants : accès via le resume_id qui appartient à l'utilisateur
create policy "experiences_owner" on public.experiences for all
  using (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()));

create policy "educations_owner" on public.educations for all
  using (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()));

create policy "skills_owner" on public.skills for all
  using (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()));

create policy "languages_owner" on public.languages for all
  using (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()));

create policy "certifications_owner" on public.certifications for all
  using (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()));

create policy "projects_owner" on public.projects for all
  using (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()));

create policy "interests_owner" on public.interests for all
  using (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()));

create policy "references_owner" on public."references" for all
  using (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()));

create policy "resume_sections_owner" on public.resume_sections for all
  using (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid()));

-- =========================================================
-- STORAGE BUCKETS
-- =========================================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false)
  on conflict (id) do nothing;

create policy "avatar_owner_write" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatar_owner_update" on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatar_owner_delete" on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatar_public_read" on storage.objects for select
  using (bucket_id = 'avatars');

create policy "resume_files_owner" on storage.objects for all
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
