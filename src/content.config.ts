import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

// Texto nos dois idiomas
const i18n = <T extends z.ZodTypeAny>(shape: T) => z.object({ pt: shape, en: shape });

// Artigos: um .md por artigo em src/content/blog
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tag: z.string(),
      readTime: z.string(),
      cover: image().optional(), // capa própria; sem ela usa a ilustração automática
      draft: z.boolean().default(false), // true = não publica
    }),
});

// Projetos: um .yaml por projeto em src/content/projects
const projects = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      order: z.number().default(99),
      illustration: z.enum(["duel", "ffmpeg", "sheet", "none"]).default("none"),
      image: image().optional(), // print real; substitui a ilustração
      techs: z.array(z.string()),
      demo: z.string().url().optional(),
      code: z.string().url().optional(),
      text: i18n(z.object({ title: z.string(), desc: z.string() })),
    }),
});

// Trajetória (formato de commits), do mais recente ao mais antigo
const career = defineCollection({
  loader: file("./src/content/data/career.yaml"),
  schema: z.object({
    order: z.number(),
    hash: z.string(),
    year: z.string(),
    type: z.string().default("feat"),
    ref: i18n(z.string()).optional(),
    branch: z.boolean().default(false),
    tags: z.array(z.string()),
    text: i18n(z.object({ title: z.string(), desc: z.string() })),
  }),
});

// Fotos do celular em "Fora da tela" (arquivos em src/assets/hobbies)
const photos = defineCollection({
  loader: file("./src/content/data/photos.yaml"),
  schema: z.object({
    order: z.number(),
    file: z.string(),
    text: i18n(z.object({ chip: z.string(), alt: z.string(), caption: z.string(), meta: z.string() })),
  }),
});

// Livros da estante
const books = defineCollection({
  loader: file("./src/content/data/books.yaml"),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    author: z.string(),
    color: z.string(),
    textColor: z.string().default("#FFFFFF"),
    width: z.number().default(34),
    height: z.number().default(200),
    lean: z.boolean().default(false),
    status: z.enum(["reading", "read", "queue"]).default("queue"), // lendo | lido | na fila
    progress: z.number().min(0).max(100).optional(), // % lido (status reading)
    review: z.string().optional(), // slug do artigo de review em src/content/blog
    note: i18n(z.string()).optional(), // frase curta enquanto não há review
  }),
});

// Faixas de tecnologias (logos em src/assets/techs)
const techs = defineCollection({
  loader: file("./src/content/data/techs.yaml"),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    logo: z.string(),
    row: z.union([z.literal(1), z.literal(2)]),
  }),
});

export const collections = { blog, projects, career, photos, books, techs };
