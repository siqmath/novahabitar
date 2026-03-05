# Nova Habitar — Project TODO

## Core Features

- [x] Initial site copy with all sections (Hero, Services, Projects, Structure, About, CTA, Footer)
- [x] Brand alignment following nova-habitar-branding guidelines
- [x] Multilingual system (PT/EN) with route-based language switching (/pt and /en)
- [x] Sidebar navigation with expandable menu and language flags
- [x] Project carousel and portfolio pages with filters (status, location, type)
- [x] Admin panel with CRUD for projects and timeline events
- [x] Timeline component integrated into "Nossa História" page (/pt/historia)
- [x] File upload system (images/videos) implemented with backend S3 support
- [x] Admin password protection (password: "0603")
- [x] Contact page with functional form
- [x] Individual project detail pages with gallery, lightbox, and technical data

## Brand & Content

- [x] Hero tagline: "Consolidando grandes projetos em ativos imobiliários [de alto valor], [sólidos], [previsíveis]"
- [x] Subtitle: "Uma plataforma de desenvolvimento imobiliário"
- [x] Address changed to Niterói - RJ (hero badge, footer, contact page)
- [x] Logo Solo (monochromatic) in sidebar/footer
- [x] Logo Branca Lateral in hero
- [x] Language selector with flag icons (Brazil/USA) — selected flag 3x larger

## Navigation & Routing

- [x] First CTA button directs to /contato page
- [x] "Nossa Atuação" section removed from individual project pages
- [x] Timeline moved to separate "Nossa História" page (/pt/historia)
- [x] Admin route hidden (only accessible via /admin URL)
- [x] Portfolio carousel on home page links directly to individual projects
- [x] Project type filters (Residencial, Comercial, Uso Misto) on second row in projects page

## Admin Panel

- [x] FileUpload component integrated for all image/video fields in projects
- [x] FileUpload component integrated for timeline event photos
- [x] All project fields customizable through admin (gallery, technical data, differentials, tags)
- [x] Contact info management tab

## Testing

- [x] TypeScript check passes with no errors
- [x] Vitest tests pass (13 tests across 2 test files)
- [x] Auth logout test
- [x] Upload route and store utility tests

## Known Issues (Being Fixed)

- [x] Image/video upload fixed — replaced tRPC with REST endpoint /api/upload (multer + S3)
- [x] Language selector buttons (🇧🇷 🇺🇸) added to top of sidebar, selected flag 3x larger
- [x] CTA buttons fixed: VER PORTFÓLIO → /projetos, AGENDAR CONVERSA TÉCNICA → /contato
- [x] Nossa História page linked in sidebar navigation (/pt/historia, /en/historia)
- [x] "Introdução da Atuação" and "Nossa Atuação" fields removed from admin panel project form
