# PawTheory SEO Strategy

Site: https://www.pawtheory.site · Type: publisher (evergreen pet-care guides) · Written 2026-11-17

## 1. Where the site is today
- 2 published articles, 10 categories (2 with posts), 3 authors. Brand new, so no authority yet.
- Technical base is solid: prerendered HTML for every public page, sitemap, robots.txt (AI crawlers allowed), llms.txt, Article JSON-LD, admin SEO overrides, Markdown posts with tables, FAQ accordions and images.
- Gaps: no Organization/WebSite schema, no author pages, no `dateModified`, no analytics or Search Console confirmed, and Supabase env vars on Vercel need checking (sitemap/prerender depend on them).

## 2. Goals and KPIs
No baseline data exists yet, so set numbers after 4 weeks of Search Console data. Track:

| Metric | Source | Review |
|---|---|---|
| Indexed pages vs published pages | Search Console | weekly |
| Impressions / clicks / avg position | Search Console | weekly |
| Articles ranking top 20 for a target query | Search Console | monthly |
| Referrals from ChatGPT, Perplexity, Claude | Analytics referrers | monthly |
| Core Web Vitals (INP, LCP, CLS) | Search Console / PageSpeed | monthly |
| Newsletter signups | Supabase `subscribers` | monthly |

## 3. Positioning
Competing with large pet publishers on head terms is not realistic. Win on **vet- and trainer-reviewed, specific, practical guides** (the site's stated angle) in a narrow set of topics, and build depth there before widening.

**Start with 3 pillars, not 10:** Dogs, Cats, Pet Health. Leave the other categories hidden (they already hide until they have posts) until each pillar has 8–10 articles.

## 4. Content plan
Per pillar: 1 hub page (broad guide) + 8–10 supporting articles on specific questions, each linking to the hub and to 2–3 siblings.

- **Format that suits AI answers and rich results:** direct answer in the first 40–60 words, question-style H2/H3, tables for comparisons, a short FAQ section (the site renders these as accordions), original photos with real alt text.
- **Cadence:** 1–2 quality articles per week beats bursts. Refresh each article's facts every 3–6 months and show an updated date.
- **Topic selection:** use Search Console queries once available; until then, mine "People also ask" and autocomplete for each pillar. Keyword volume/difficulty needs a tool (Ahrefs, DataForSEO or similar). I haven't run any here, so no volumes are quoted.
- **Trust rules for pet-health content:** a named vet/trainer as author or reviewer, cited sources, a "not a substitute for a vet" note (already in Terms), no dosing or diagnosis advice without a vet byline.

## 5. Technical roadmap
| Priority | Task |
|---|---|
| 1 | Set Supabase env vars on Vercel; confirm sitemap lists articles and categories |
| 1 | Add site to Google Search Console and Bing Webmaster; submit the sitemap |
| 1 | Add analytics (Search Console is enough to start) |
| 2 | `/authors/<name>` pages (Person + ProfilePage schema) linked from every byline |
| 2 | WebSite + Organization schema on the homepage; real logo and `sameAs` links |
| 2 | `updated_at` column, `dateModified` in JSON-LD, visible "Updated" date |
| 2 | Breadcrumbs (BreadcrumbList schema) on articles and categories |
| 3 | Image pipeline: compress and size covers; set width/height to avoid CLS |
| 3 | Editorial policy and About page detail: who reviews content and how |
| 3 | RSS feed |

Skip: `llms.txt` tuning and FAQ schema. Google says neither helps Search, and FAQ rich results were retired in 2026.

## 6. Authority and AI-search visibility
- Brand mentions matter more than backlinks for AI citations (correlation, not proven): be present on Reddit communities, YouTube (short vet/trainer clips embedded in articles) and LinkedIn for the authors.
- Link-worthy assets: a few original pieces (a survey, a printable checklist, a calculator) beat more generic articles.
- Outreach: local shelters, vet clinics, pet bloggers, and expert quotes (HARO-style requests) for the authors.

## 7. Roadmap
**Weeks 1–4, foundation:** the priority-1 tasks, author pages, homepage schema, publish 6–8 articles across the 3 pillars.
**Weeks 5–12, expansion:** finish the Dogs hub and 8 supporting posts, start Cats and Pet Health, add breadcrumbs and `dateModified`, begin newsletter promotion.
**Weeks 13–24, scale:** first original-data asset, YouTube embeds, outreach, review Search Console for queries to expand into, refresh early posts.
**Months 7–12, authority:** open further categories that have earned impressions, expert roundups, update or merge underperformers.

## 8. Risks
| Risk | Mitigation |
|---|---|
| Thin or generic articles that look mass-produced | Fewer, deeper posts; named expert review; original photos and sources |
| Health advice errors | Vet review before publish; cite sources; avoid dosing guidance |
| Admin edits not reaching crawlers | Rebuild on Vercel after batches of edits (or add a deploy hook) |
| Over-reliance on AI-generated images/text | Disclose where relevant; prefer own photos for covers |

## 9. Next review
After 4 weeks of Search Console data, replace this plan's assumptions with real queries, set numeric KPI targets, and re-run `/seo audit`.
