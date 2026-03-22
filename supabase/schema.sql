-- Create tables for Nova Habitar Project

CREATE TABLE public.projects (
  id text PRIMARY KEY,
  "createdAt" text NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  "titleEn" text,
  tagline text,
  "taglineEn" text,
  status text NOT NULL,
  type text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  "descriptionEn" text,
  "aboutText" text,
  "aboutTextEn" text,
  "mainImageIndex" integer NOT NULL DEFAULT 0,
  "builtArea" text,
  units text,
  typology text,
  "typologyEn" text,
  differentials jsonb NOT NULL DEFAULT '[]'::jsonb,
  "differentialsEn" jsonb,
  techniques jsonb NOT NULL DEFAULT '[]'::jsonb,
  actuation jsonb NOT NULL DEFAULT '{}'::jsonb,
  "actuationEn" jsonb,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  "order" integer NOT NULL DEFAULT 0
);

CREATE TABLE public.partners (
  id text PRIMARY KEY,
  "createdAt" text NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  logo text,
  actuation text NOT NULL,
  "actuationEn" text,
  "shortDescription" text NOT NULL,
  "shortDescriptionEn" text,
  "fullDescription" text NOT NULL,
  "fullDescriptionEn" text,
  differentials jsonb NOT NULL DEFAULT '[]'::jsonb,
  "differentialsEn" jsonb,
  website text,
  active boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  "order" integer NOT NULL DEFAULT 0,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE public.timeline (
  id text PRIMARY KEY,
  "createdAt" text NOT NULL,
  date text NOT NULL,
  title text NOT NULL,
  "titleEn" text,
  description text NOT NULL,
  "descriptionEn" text,
  photo text,
  link text
);

CREATE TABLE public.contacts (
  id integer PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL DEFAULT '{"email":"", "phone":"", "whatsapp":"", "address":"", "instagram":"", "linkedin":""}'::jsonb
);

CREATE TABLE public.settings (
  id integer PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL DEFAULT '{"historyPageVisible":true}'::jsonb
);

-- Init singletons
INSERT INTO public.contacts (id) VALUES (1) ON CONFLICT DO NOTHING;
INSERT INTO public.settings (id) VALUES (1) ON CONFLICT DO NOTHING;
