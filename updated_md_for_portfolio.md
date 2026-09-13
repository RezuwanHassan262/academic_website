# Portfolio Content Update Specification

**Target codebase:** `personal_website/` (rezuwan.me) — Create-React-App + TypeScript, React Router, react-bootstrap.
**Source of truth:** `portfolio_content_update_source.md` (academic website content as of 2026-09).
**Audit baseline:** portfolio commit `0c69439` (59 uncommitted local files present at audit time — none affect the content below).

> Content-only. No page, route, component, style, layout, animation or dependency changes are proposed anywhere in this document. Every edit below is a value change inside an existing data array, prop string or JSX text node.

---

## 0. Where the content actually lives (verified by inspection)

The portfolio has **no data directory** apart from one JSON file. All visible text is hard-coded inside components.

| Page (route) | File | What is hard-coded there |
|---|---|---|
| Home `/` | `src/components/sections/Hero.tsx` | Name, typed.js strings `['a Researcher','an Engineer','an Artist']` |
| Resume `/resume` | `src/components/sections/Resume.tsx` | Five tabs as arrays: `experienceData`, `educationData`, `achievementData`, `volunteeringData`, `awardsData` |
| Resume `/resume` | `src/pages/Resume.tsx` | Page-title quote |
| Research `/research` | `src/components/sections/Research.tsx` | `researchData` (publication cards), `filters` |
| Research `/research` | `src/components/sections/Interests.tsx` | `researchInterests` |
| Research `/research` | `src/components/sections/ScholarStats.tsx` + `src/data/scholarData.json` | Citation stats (data-driven) |
| Research `/research` | `src/pages/Research.tsx` | Page-title quote, Scholar/ResearchGate icon links |
| Projects `/projects` | `src/pages/Projects.tsx` | `projects` array, `filters`, page-title quote |
| About `/about` | `src/components/sections/About.tsx` | Identity line, tagline, info grid, bio paragraph |
| About `/about` | `src/pages/About.tsx` | Page-title description (professional summary) |
| About `/about` | `src/components/sections/Skills.tsx` | `skillCategories` (4 categories) |
| About `/about` | `src/components/sections/Hobbies.tsx` | `hobbiesItems` |
| Contact `/contact` | `src/pages/Contact.tsx` | `contactInfo`, Gmail compose target |
| All | `src/components/layout/Footer.tsx` | Tagline, social icon links |
| All | `src/components/layout/Header.tsx` | Nav labels (Home, Resume, Research, Projects, About, Contact) |
| — | `src/utils/constants.ts` | `SOCIAL_LINKS`, `PERSONAL_INFO` (title, email, website) |
| — | `public/index.html`, `public/manifest.json` | `<title>`, app name only |

Tabs that already exist and absorb "academic-only" sections:

- **Resume › Achievement** ← awards, certifications, scholarships
- **Resume › Volunteering** ← Bengali.AI, workshops instructed, ICACT review, blood donation, HMG
- **Resume › Awards and Honors** ← adjudications, invited talks, MoFA recognition

So *Adjudications*, *Teaching*, *Workshops* and *Invited Talks* from the academic site all already have homes. No new section is needed for any priority item.

---

## 1. Audit Summary

**Headline:** the portfolio is much closer to current than the brief assumed. Most of the 2026 items are already there. The work is corrections, a handful of genuine gaps, and one copy-paste error on the Research page.

**Already current (no action):** Sr. Technical Project Manager @ SysModeler (July 2026–Present); AI Engineer @ SysModeler (Oct 2025–Jun 2026); *Meaning Over Morphology* card exists; BAU/BAULC June 2026 workshop; BUET DLSprint4 March 2026; ICACT 2025 reviewer; IELTS Dec 2025; National AI Hackathon runner-up; all 2023–2024 talks and adjudications; both degrees with thesis/supervisor/publication/concentration; Bengali.AI, Quantum Foundation, HMG.

**Genuinely missing:**
1. **DUITS / University of Dhaka "AI Beyond Answers" workshop (Aug 2026)** — absent everywhere, although its nine photos (`duits_0…8.jpeg`) are already in `public/assets/img/others/`.
2. **Systems Engineering skills** (SysML v2, MBSE, Digital Twins, Requirements Engineering, System Modeling) — no trace in Skills.
3. **EEE engineering tools** (MATLAB/Simulink, PSpice, LTspice, Proteus, Arduino, Verilog) — absent.
4. **RoshikBot** (under review, CHI 2026) — not on the Research page.
5. **Academic Portfolio Website (2026)** project — absent (its screenshot `academic_portfolio.PNG` is already in `public/`).
6. **IELTS band score (8)** — the card exists but never states the score.
7. **LaTeX** in skills (portfolio has a generic "Markup" badge instead).

**Outdated:**
- About-page professional summary and bio still describe "an AI engineer … Deep learning, NLP & Computational Cognitive Science" / "advancing Bangla NLP research"; the current positioning is AI + NLP + Speech AI + Systems Engineering, AI-assisted MBSE.
- `PERSONAL_INFO.title` = `'AI Engineer'`; `PERSONAL_INFO.website` = `'rezuwan262.vercel.app'`.
- BRAC role titled **Research Engineer**; academic site now says **Graduate Research Assistant**.
- Lead Academy card says **Full-Time**; the role was contractual (the card's own text says so).
- SysModeler location "United States" → academic site says "Michigan, United States".
- Google collaboration card is titled "Contributed to a Google Project"; academic site names it **Expert (Remote) — Project Niti, Google Research** with a concrete work description.
- `scholarData.json` committed value is 33 citations / 2026-08-26; academic site is at 35 / 2026-09-12.

**Errors found in the portfolio (fix regardless of the academic site):**
- **Research page:** the *Meaning Over Morphology* card's `description` is a verbatim copy of the ASR paper's abstract (Ben-10 corpus etc.). It describes the wrong paper.
- **Research page:** two cards share `id: 2` (ASR paper and RegSpeech12). `expandedCards` is keyed by id, so "See More" on one expands both.
- B.Sc. thesis title on the Research page omits "the BUS4" (present in the Education tab and the source).
- BAU workshop description is split across three `<p>` tags mid-sentence ("…served as a</p><p>workshop instructor…").

**Conflicts to flag, not resolve:**
- RoboFication *AI Engineer* card reads "July, 2025 – Present" while SysModeler AI Engineer starts October 2025. The academic site no longer lists RoboFication at all, so there is no authoritative end date. **Do not invent one.**
- Freelance Data Scientist "July, 2022 – Present" — not on the academic site; unknown whether still active.
- B.Sc. thesis co-author: portfolio (Research card *and* Education card's paper) say **Mohammad Saiful Huq**; source §7 says **Mohammad Saiful Hossain** for the thesis but **Huq** for the ICEPE paper. Same person, spelling differs by document. **Leave as-is; confirm with the author.**
- Email: portfolio uses `rezwanhasan262@gmail.com` throughout; source lists `mdrezuwanhassan@gmail.com` as primary and `rezwanhasan262@gmail.com` as alternative. Both are valid; the update below follows the academic site's primary.

---

## 2. Global / Hero / About Updates

### 2.1 `src/utils/constants.ts` → `PERSONAL_INFO`

**Current**
> `title: 'AI Engineer'`, `email: 'rezwanhasan262@gmail.com'`, `website: 'rezuwan262.vercel.app'`

**Replace with**
> `title: 'Sr. Technical Project Manager'`
> `email: 'mdrezuwanhassan@gmail.com'`
> `website: 'https://rezuwan.me'`

**Reason:** the only hard-coded professional title in the codebase, and the website value points at a retired Vercel host. Verified: `PERSONAL_INFO` is defined but not imported by any component today, so this is invisible on the live site — update it anyway so a stale title cannot resurface if it is wired in later.

### 2.2 `src/pages/About.tsx` → `PageTitle description`

**Current**
> "An Artificial Intelligence (AI) engineer with a strong passion for Deep learning, Natural language processing & Computational Cognitive Science. Dedicated to advancing open-source technologies and aim to combine passion, dedication, and hard work to achieve impactful results by contributing to meaningful initiatives while building my expertise."

**Replace with**
> "Sr. Technical Project Manager at SysModeler, Inc. and an interdisciplinary AI researcher and engineer with a background in Electrical & Electronic Engineering and Computer Science. My interests span AI, Natural Language Processing, Speech AI and Systems Engineering — with a particular focus on AI-assisted Model-Based Systems Engineering — and on advancing open-source technologies through meaningful, impactful work."

**Reason:** presents the current role and the current research direction; keeps the portfolio's "open-source / impactful" note.

### 2.3 `src/components/sections/About.tsx` → bio card paragraph (line ~187)

**Current**
> "Hey, I'm Md. Rezuwan Hassan. I am a curious mind and a heuristic learner who loves to explore and experiment with new technologies. I love to put my merit and skills to use in making the lives of general people easier by developing open-source technologies and contributing to advancing Bangla NLP research."

**Replace with**
> "Hey, I'm Md. Rezuwan Hassan — an interdisciplinary AI researcher and engineer with a background in Electrical & Electronic Engineering and Computer Science. My research interests span AI, Natural Language Processing, Speech AI and Systems Engineering, with a particular interest in AI-assisted MBSE. I'm a curious mind and a heuristic learner, and I want to build intelligent technologies that make complex engineering systems more reliable, efficient and useful to society — while continuing to advance open-source tools and Bangla NLP research."

**Reason:** source §2 is the newer statement; the "curious mind / heuristic learner" and open-source/Bangla NLP phrases are portfolio voice and not contradicted, so they are kept.

### 2.4 `About.tsx` → info grid

| Field | Current | Replace with | Reason |
|---|---|---|---|
| Education | `Masters` | `M.Sc. in Computer Science & Engineering` | Source §3 |
| Email | `rezwanhasan262@gmail.com` | `mdrezuwanhassan@gmail.com` | Source §3 primary address |
| Website | `https://www.rezuwan.me` | keep | Current |
| Birthday / Phone / City | — | keep | Current |

### 2.5 Keep unchanged in this layer
- Hero name and typed strings (`a Researcher / an Engineer / an Artist`) — portfolio identity, matches the academic tagline.
- About identity line `Engineer | Researcher | Artist | Geek | ENFJ-T | Learner | Human | Believer | Bengali 🇧🇩` — identical to source §1.
- About tagline "An artistic soul with a passion for AI" — portfolio-specific, not contradicted.
- Footer tagline "A researcher by day, an engineer by night, and an artist all the way." — identical to source.
- Header nav labels, `public/index.html` title, manifest name.

---

## 3. Experience Updates — `Resume.tsx › experienceData`

### Sr. Technical Project Manager / SysModeler, Inc. (`id: 0`)
**Action:** Correct (one field)
**Current:** `location: "United States"`
**Updated:** `location: "Michigan, United States"`
**Notes:** Title, period (July, 2026 – Present), type, description all already match source §9. Keep the description as written.

### Artificial Intelligence (AI) Engineer / SysModeler, Inc. (`id: 1`)
**Action:** Correct (one field)
**Current:** `location: "United States"`
**Updated:** `location: "Michigan, United States"`
**Notes:** Period Oct 2025 – Jun 2026 and the SysModeler.ai description match the source. Keep. This is the historical role and must stay.

### Artificial Intelligence (AI) Engineer / RoboFication LLC (`id: 2`)
**Action:** Keep — **FLAG**
**Current:** `period: "July, 2025 - Present"`
**Notes:** "Present" overlaps the SysModeler roles that begin October 2025. The academic site no longer lists RoboFication, so no end date is available. Do not invent one; ask the author. Everything else is portfolio-specific history and stays.

### Junior AI Engineer / RoboFication LLC (`id: 3`)
**Action:** Keep. Portfolio-specific history, not contradicted.

### Research Engineer / BRAC University (`id: 4`)
**Action:** Correct (title only)
**Current:** `title: "Research Engineer"`
**Updated:** `title: "Graduate Research Assistant"`
**Notes:** Responsibilities, project involvements, reporting and remote supervisors all match source §9 already. Keep the BRAC University description paragraph (portfolio-specific). Period Feb 2024 – Sep 2025 correct.

### Freelance Data Scientist (`id: 4` — duplicate id)
**Action:** Keep — **FLAG**
**Notes:** Not on the academic site; "– Present" may be stale. Verify with the author. Also note the duplicate `id: 4` (shared with BRAC); harmless today because cards are grouped by company, but give it a unique id if editing nearby.

### Instructor / Lead Academy (`id: 5`)
**Action:** Correct (two fields)
**Current:** `title: "Instructor"`, `employmentType: "Full-Time"`
**Updated:** `title: "Instructor & Course Designer"`, `employmentType: "Contractual"`
**Notes:** Source §9 gives "Instructor / Course Designer — Contractual / Hybrid"; the card's own description already says "on a contractual basis", so "Full-Time" is a visible inconsistency. `locationType: "Hybrid"` is already correct. Keep the description.

### Coding Instructor / Learn Time (`id: 6`)
**Action:** Keep. Period, type (Part-Time), responsibilities match source.

### Neon Aloy ×4 (`id: 7, 7, 8, 9`)
**Action:** Keep. Portfolio-specific history; not on the academic site, not contradicted. (Two entries share `id: 7`; same note as above.)

---

## 4. Education Updates — `Resume.tsx › educationData`

### M.Sc. — Computer Science Engineering (`id: 1`)
**Action:** Keep
**Notes:** Degree, institution, period 2021–2023, thesis (+link), supervisor (+link), publication (+link), concentration and the six CSE7xx courses all match source §10. Course label format ("CSE710: …") differs from the source's ("… (CSE710)") but the content is identical — keep the portfolio format.

### B.Sc. — Electrical and Electronics Engineering (`id: 2`)
**Action:** Correct (cosmetic)
**Current:** `thesis.title: "Efficient approach for reliability evaluation of the BUS4 distribution system considering momentary interruption. "` (trailing ". ")
**Updated:** same text with the trailing period and space removed.
**Notes:** Everything else matches. The portfolio's course list is more detailed (course codes + labs) than the source's — keep it.

### CGPA, scholarship count, VC List, "Fall 27 Aspirant"
`[OPTIONAL / NO EXISTING SLOT]` — the education card has no free-text or CGPA field (fields are thesis / supervisor / publication / concentration / courses). Scholarships and the VC List already appear as separate cards in the **Achievement** tab, so nothing is lost. See §13.

---

## 5. Publications Updates — `Research.tsx › researchData`

### 5.1 Meaning Over Morphology — **Correct (wrong description)**
- **Location:** `researchData[0]` (`id: 1`)
- **Title / Authors / Venue / Link / Type:** already correct (title, six authors, "2026, DialRes Workshop, Language Resources and Evaluation Conference (LREC)", `https://aclanthology.org/2026.dialres-1.24/`, "Workshop Paper"). Keep.
- **Current description:** the ASR paper's abstract ("Conventional research on speech recognition modeling … 78-hour annotated Bengali Speech-to-Text (STT) corpus named Ben-10 …"). **This is a copy-paste error.**
- **Replace description with:** "A multi-metric benchmark of large language models on Bangla dialect translation, published at the DialRes Workshop, LREC 2026."
  (That is the only description the source provides. If a fuller abstract is wanted, take it from the ACL Anthology page linked on the card — do not paraphrase the ASR abstract.)
- **Categories:** keep `["bnlp","nlp","ai"]`.

### 5.2 Are ASR foundation models generalized enough… — Keep
- `id: 2`. Title, authors, venue, link, description, type, categories all match source §5.2.

### 5.3 RegSpeech12 — Correct (id only)
- **Current:** `id: 2` (duplicate of 5.2). **Change to a unique id** (e.g. `9`, since 1–8 are taken). Reason: `expandedCards[research.id]` — with the duplicate, expanding either card expands both. Pure data-value fix; no component change.
- Content matches source §5.3. Keep.

### 5.4 AgriBuddy (Technical Report) — Keep. Matches source §5.4.

### 5.5 RoshikBot — **Add**
- **Title:** RoshikBot: Towards Culturally Grounded Bangla Satire and Humor with Foundation Models
- **Authors:** Nusrat Jahan Mim, Md. Ishmam Tasin, Md. Rezuwan Hassan, Tanmoy Shome, Zumaina Islam, Syed Ishtiaque Ahmed, Farida Chowdhury, S M Taiabul Haque
- **Venue:** "Under review — ACM CHI Conference on Human Factors in Computing Systems (CHI), 2026"
- **Year:** 2026 · **Status:** Under review
- **Type (existing free-text badge):** "Under Review"
- **Description:** "An end-to-end Bangla satire chatbot trained on Bangla satire-based magazine archives, probing whether foundation models can understand and generate culturally grounded humor."
- **Categories:** `["bnlp","nlp","ai"]` (the Research filter list has no HCI entry — do not add one).
- **Link:** **none in the source.** The `ResearchItem.link` field is required by the interface. Options that need no code change: point it at the related project repo already on the Projects page (`https://github.com/RezuwanHassan262/USB_Unmad_Satirical_Bot`) — same project lineage, but note it is not the paper — or hold this card until a preprint/DOI exists. **Author to decide.**
- **Image:** no dedicated asset. `public/assets/img/others/ss2.PNG` (the Unmad-style chatbot screenshot used on the Projects page) is the only related image available. Do not fabricate a figure.
- **Placement:** insert at the top of `researchData`, above *Meaning Over Morphology* (newest first, consistent with the existing order).

### 5.6 IPA Transcription of Bengali Texts — Keep. Matches source §6.
### 5.7 M.Sc. Thesis — Keep. Matches source §7 (portfolio description is the full abstract; keep).
### 5.8 Monte Carlo (ICEPE 2022) — Keep. Matches source §5.7.
### 5.9 Horizontal Federated Random Forest — Keep. Matches source §5.6.

### 5.10 B.Sc. Thesis — Correct (title)
- **Current title:** "Efficient approach for reliability evaluation of distribution system considering momentary interruption"
- **Updated title:** "Efficient approach for reliability evaluation of the BUS4 distribution system considering momentary interruption" (matches source §7 and the Education tab).
- **Authors:** portfolio "…, Mohammad Saiful Huq"; source §7 "…, Mohammad Saiful Hossain". **Conflict — leave unchanged and flag** (see §1).

### 5.11 Research page framing — Keep
`src/pages/Research.tsx` quote and the "Manuscripts I contributed to" subtitle are portfolio voice. The filter list needs no change.

### 5.12 Scholar stats — Refresh data file
`src/data/scholarData.json` holds `citations: 33 … lastUpdated: "2026-08-26"`; the academic site's `_data/scholar.json` is at 35 / 2026-09-12. Not a code edit: run `npm run update-scholar` in the portfolio repo (script exists), or copy the academic repo's `_data/scholar.json` over it (same shape).

---

## 6. Projects Updates — `src/pages/Projects.tsx › projects`

**Project:** Academic Portfolio Website
**Action:** Add
**Recommended title:** Academic Portfolio Website
**Recommended year:** 2026
**Recommended description:** "Academic portfolio website built with React and TypeScript." *(source §14; if you prefer accuracy over the source wording, the live academic site is static HTML with a Node build — confirm with the author before changing the source's text.)*
**Tags (`technologies`):** `['React', 'TypeScript', 'Web Development']`
**Category:** `['web']`
**Image:** `/assets/img/others/academic_portfolio.PNG` (already present)
**Links:** `github: 'https://github.com/RezuwanHassan262/academic_website'`, `demo: 'https://rezuwanhassan262.github.io/academic_website/'` (both are the links shown on the academic site's own project card)
**Existing portfolio location:** append to `projects` (the list is sorted by year at render time, so it will surface first automatically).

**Project:** Prototype system design of Bengali humor in Unmad style (`id: 5`)
**Action:** Update (title)
**Recommended title:** "Bangla Satirical Chatbot — Unmad Style (USB)"
**Recommended description:** keep current (matches source §12 in substance)
**Tags:** keep
**Notes:** Aligns with the academic site's naming and with the RoshikBot paper lineage.

**Project:** AgriBuddy (`id: 8`)
**Action:** Update (description + one category)
**Recommended description:** "AI-powered agent system for Bangladeshi farmers: RAG-based Bangla advisory, CNN rice disease detection, mobile-first PWA. Runner-up at National AI Hackathon 2025."
**Category:** `['bnlp','nlp','aai','cv']` — replace `'ws'` (Web Scraping) with `'cv'` (Computer Vision). The project scrapes nothing; it has a CNN vision module, matching the source tags.
**Tags:** keep `['Python','Langchain','OpenAI','Faiss','CNN']`.

**Project:** Heart Disease Detection using Horizontal Federated Learning (`id: 12`)
**Action:** Update (description)
**Recommended description:** "Federated Random Forest combining decentralized hospital data for heart disease detection — 7.1% accuracy improvement over baseline."
**Notes:** current one-liner is just the paper's title fragment.

**Project:** Portfolio Website (`id: 16`)
**Action:** Update (description)
**Recommended description:** "Personal academic and professional portfolio website built with React and TypeScript."

**Keep as-is (already consistent with source §12–14):** Demographics of Best CS Scientists; 100+ Years Earthquake Data; Aviation Accident Risk Analysis; Titanic EDA; Parrot Classifier; YOLOv8 road detection; Bengali Speech Recognition with Regional Dialects; Automatic Bengali Transcription System; Multi-label Film Genre Classifier; ChemQuery; Background Remover.
*Optional title alignment only, no content change:* "Parrot Classifier" → "Parrot Species Classifier"; "Custom Training YOLOv8 to detect Vehicle, Pedestrians, and Signboards" → "Road Object Detection with YOLOv8". The portfolio titles are accurate; align only if you want parity with the academic site.

**Project filters:** already identical to the academic site's curated list (14 entries). Keep.

---

## 7. Skills Updates — `src/components/sections/Skills.tsx › skillCategories`

The component renders `skillCategories` generically (`map` over categories, `map` over badges). Adding an object to that array is a data change; the component, CSS and layout are untouched. Two of the source's categories have **no** natural home among the existing four ("Programming Languages", "Libraries and Frameworks", "Developer Tools", "Other Tools"), so:

**Preferred — add two entries to the existing array** (renders with the existing badge styling, no new component):

### Add — new category `"Systems Modeling & Engineering"` (insert as the first category)
- SysML v2
- MBSE
- Digital Twins
- Requirements Engineering
- System Modeling

### Add — new category `"EEE & Engineering Tools"` (insert second)
- MATLAB/Simulink
- PSpice
- LTspice
- Proteus
- Arduino
- Verilog

> If a new category object is judged to be a structural change, fold the six EEE tools into **"Other Tools"** and the five SE skills into **"Libraries and Frameworks"** instead. The preferred option is recommended because those two categories are the academic site's headline change and burying them misrepresents the current direction.

**Badge rendering note (data-level, no code change required):** badges with a `logo` use shields.io + simple-icons. Reliable slugs among the new items: `arduino`, `ltspice`. The others (SysML v2, MBSE, Digital Twins, Requirements Engineering, System Modeling, MATLAB/Simulink, PSpice, Proteus, Verilog) have no simple-icons slug — give them a `color` and **no** `logo`/`image` so they render as plain text badges. **Caveat:** the no-logo fallback in `generateBadgeUrl` ends with a stray `}` (`…&fontFamily=Roboto}`), which will appear in the badge URL. That one-character fix is outside "content", so either (a) fix it — it is a bug, not a redesign — or (b) supply an `image` URL for each new badge instead. Flagging for the author.

### Add — into existing categories
- **Programming Languages:** `LaTeX` (see Rename below).
- **Developer Tools:** `Hugging Face Spaces` (source §11 "Deployment"; Netlify and Render already live here).

### Rename / Correct
- **Programming Languages:** `"Markup"` → `"LaTeX"` (source lists LaTeX; "Markup" with a generic icon is the stale stand-in). Logo slug `latex` exists in simple-icons.
- **Libraries and Frameworks:** `"Opencv"` → `"OpenCV"` (capitalisation).

### Remove
None. Nothing in the portfolio's skills is contradicted by the source. `Stack Overflow` is not in the source but is not obsolete — keep.

### Keep
Everything else in all four categories (Python, Dart, HTML5, CSS3, JavaScript, C; NumPy … Bootstrap; Anaconda … Render; Tableau … Premiere Pro). The commented-out Soft Skills block stays commented out — source §11 lists soft skills, but the portfolio deliberately hides them.

---

## 8. Workshops / Talks / Teaching

Existing slots: workshops instructed → **Resume › Volunteering** (that is where BAU/IUT/UIU already live); invited talks → **Resume › Awards and Honors**; teaching → **Resume › Experience** (Lead Academy, Learn Time, BRAC responsibilities).

### DUITS / University of Dhaka — "AI Beyond Answers" (Aug 2026) — **Add**
- **Location:** `Resume.tsx › volunteeringData`, insert as the **second** item (after Bengali.AI, before the BAU workshop — the tab is newest-first after the standing Bengali.AI card).
- **title:** "Workshop Mentor & Speaker – AI Beyond Answers"
- **shortDescription:** "Dhaka University IT Society (DUITS), University of Dhaka • August 2026" *(the `•` separator is what the Volunteering tab splits on — keep it)*
- **logo:** `/assets/img/others/duLogo.jpg` (University of Dhaka logo, already present; no DUITS logo exists in `public/`) · **logoAlt:** "University of Dhaka logo"
- **description (HTML string, matching the BAU card's register):**
  `<p>Spoke alongside <a href="https://www.linkedin.com/in/abdullaharean/" target="_blank" rel="noopener noreferrer">Abdullah Ibne Hanif Arean</a> and <a href="https://www.linkedin.com/in/mirza-nihal-baig-0361971a0/" target="_blank" rel="noopener noreferrer">Mirza Nihal Baig</a> at "AI Beyond Answers", organized by the <a href="https://www.linkedin.com/company/duits-du-bd/" target="_blank" rel="noopener noreferrer">Dhaka University IT Society (DUITS)</a>, where I delivered a session titled "CUTTING THROUGH THE NOISE: A Rigorous Guide to AI Learning Resources That Actually Build Understanding."</p><p>Covered practical ways to use AI tools in everyday and non-technical workflows, how to evaluate AI learning resources, where Bangla currently stands in the AI landscape, and how to make better use of AI in one's native language.</p>`
  *(Speaker names, LinkedIn URLs and the DUITS company URL are taken from the academic site's workshop entry; the session title is verbatim from source §16.)*
- **images:** `duits_0.jpeg` … `duits_8.jpeg` from `/assets/img/others/` (nine files already present), `alt: ""` as the neighbouring cards do.

### BAU / BAULC (June 2026) — Correct (text only)
- **Location:** `volunteeringData`, the "Workshop Instructor - A hands-on guide…" card.
- **Current:** description broken into three `<p>` tags mid-sentence.
- **Updated:** one paragraph: `<p>Invited to Bangladesh Agricultural University (BAU), Mymensingh, to discuss the current state of Bangla in AI as part of a panel discussion. Additionally served as a workshop instructor, demonstrating how AI can be productively leveraged to automate non-technical workflows and everyday tasks. It was an honor to share the stage with this prominent group of Bangla NLP researchers. Special thanks to <a href="https://www.linkedin.com/company/baulc20/" target="_blank" rel="noopener noreferrer">Bangladesh Agricultural University Language Club (BAULC)</a> for the invitation and hospitality.</p>`
- Title, date, logo and eight photos: keep.

### Already present — Keep
| Item | Where | Status |
|---|---|---|
| IUT ভাষা-বিচিত্রা workshop, Mar 2024 | Volunteering | current |
| UIU NLP Datathon Bootcamp, Feb 2024 | Volunteering | current |
| BUCC webinar, Dec 2023 | Awards and Honors | current |
| CUET / ASRRO talk, Aug 2023 | Awards and Honors | current |
| Ministry of Foreign Affairs, Jun 2023 | Awards and Honors | current |
| Tech Topia AI Symposium, May 2023 | Awards and Honors | current |

### Teaching
Lead Academy and Learn Time are in **Experience** (see §3 corrections). BRAC teaching/supervision duties are already in the GRA card's responsibilities. No further action.

---

## 9. Awards / Achievements

### `Resume.tsx › achievementData`

**IELTS Academic** — Correct
- **Current title:** "International English Language Testing System (IELTS) Academic"
- **Updated title:** "International English Language Testing System (IELTS) Academic — Band 8"
- Keep the personal narrative, logo, date and score image.

**Runners up - National AI Hackathon** — Keep. Detailed and consistent with source §19 (team AgriBRACUion, four teammates, AgriBuddy description).

**Contributed to a Google Project** — Update
- **Updated title:** "Expert (Remote) — Project Niti"
- **Updated shortDescription:** "Issued by Google Research\nDecember 2023"
- **Description:** keep the existing narrative paragraphs, and append one paragraph with the concrete work from source §19: `<p><strong>Work included:</strong> adversarial data collection and red-teaming of generative AI models, building high-sensitivity regional-language datasets and cultural-context benchmarks, and strengthening model safety and robustness against localized adversarial or harmful content.</p>`
- Keep the two Google-logo/image URLs as they are.

**Invitee – Google Foo Bar Challenge** — Keep (the "Note" paragraph already carries the Personal Philosophy "Never memorize…" quote — see §13).

**Winner - Photography Contest** — Keep.

**100% Merit Based Scholarship Waiver — Summer 2022 / Spring 2022** — Keep. The portfolio adds "(CGPA: 4.00/4.00) up to the semester of …"; the source says only "based on academic performance". More specific, not contradicted — keep.

**Vice Chancellor's List** — Keep. Matches source ("GPA of 4.00 … 18 credits in Spring 2020").

### `Resume.tsx › awardsData` (adjudications, talks, recognition)

All nine entries are current: BUET DLSprint4 (Mar 2026), IUT Bhashabichitra (Apr 2024), UIU Bhashamul (Mar 2024), DU ITverse (Nov 2023), MoFA recognition (Jun 2023), CUET/ASRRO (Aug 2023), BUCC (Dec 2023), Tech Topia (May 2023), BRACU EEE Club Electroditor (Mar 2021). **Keep all.**

*Optional consistency:* the DLSprint4 description reads "Got invited to be a adjudicator … The problem was bengali Long-Form audio transcription & Multi-Speaker diarization." Grammar tidy: "Invited to adjudicate the national deep learning competition DLSprint4, organized by the CSE department of BUET. The problem set covered Bengali long-form audio transcription and multi-speaker diarization." Content unchanged.

### ICACT 2025 manuscript review — Keep
Already present in **Volunteering** as "Manuscript Reviewer — IEEE • September 2025" with the ICACT 2025 description and certificate image. Matches source §18.

---

## 10. Volunteering / Community — `Resume.tsx › volunteeringData`

| Item | Action | Notes |
|---|---|---|
| AI/ML Researcher \| Assistant Co-ordinator — Bengali.AI | Keep | Source §20 is a condensed version of this card. Portfolio text is richer and not contradicted. |
| Blood Donor — Quantum Foundation, Feb 2021–Present | Keep | Matches. |
| Content Moderator and Musician — Hawai Mithaiyar Gan, Jan 2019–Dec 2020 | Keep | Matches. |
| Manuscript Reviewer — IEEE ICACT 2025 | Keep | See §9. |
| BAU workshop | Correct text | See §8. |
| DUITS workshop | **Add** | See §8. |

---

## 11. Social / Contact / External Links

### `src/pages/Contact.tsx`
- **Email** (`contactInfo[2]` content + `mailto:`): `rezwanhasan262@gmail.com` → `mdrezuwanhassan@gmail.com`
- **Gmail compose URL** (`handleSendMessage`, `&to=`): `rezwanhasan262@gmail.com` → `mdrezuwanhassan@gmail.com`
- Address "Khilgaon, Dhaka-1219, Bangladesh", phone, LinkedIn: **keep** (match source §3).

> If the author prefers to keep `rezwanhasan262@gmail.com` as the public contact (it is listed as a valid alternative), leave all three email sites unchanged — but keep them **consistent** with each other and with `About.tsx` and `constants.ts`.

### `src/utils/constants.ts › SOCIAL_LINKS` and `Footer.tsx › socialLinks`
LinkedIn, GitHub, Google Scholar, Hugging Face, Kaggle — all URLs match the academic site. **Keep.**
`[OPTIONAL / NO EXISTING SLOT]` ResearchGate and Tableau Public are in the source profile list but not in the footer/constants. ResearchGate is already linked on the Research page header. Adding icons to the footer is a visual addition — not recommended under the content-only rule; listed in §13.

### `src/pages/Research.tsx`
Google Scholar and ResearchGate links: keep.

### Website URL
Only `constants.ts` carried a stale host (`rezuwan262.vercel.app`) — corrected in §2.1. All other references already use rezuwan.me.

---

## 12. Content That Should NOT Be Changed

Compared and confirmed current, accurate, or deliberately portfolio-specific:

- **Hero:** name; typed strings; cover image.
- **About:** identity line; "An artistic soul with a passion for AI"; birthday, website, phone, city.
- **Experience:** SysModeler Sr. TPM and AI Engineer descriptions; BRAC responsibilities, project list, reporting and remote supervisor names and links; Learn Time; all four Neon Aloy roles; Junior AI Engineer at RoboFication; BRAC University description paragraph.
- **Education:** both degrees in full (only the trailing ". " on the B.Sc. thesis title is touched).
- **Research page:** all cards except the two corrections (5.1 description, 5.3 id) and the B.Sc. thesis title; filters; page quote and subtitle; Scholar/ResearchGate links. The *authors* strings are all consistent with the source except the Huq/Hossain spelling, which is flagged rather than changed.
- **Research Interests** (`Interests.tsx`): nine entries. The source's list (§4) has the same nine minus "Meta-Learning" and plus "Systems Engineering". **Recommended:** replace the **Meta-Learning** card with **Systems Engineering** — title "Systems Engineering", description "Model-based systems engineering, requirements modelling and safety-critical design", keep the card's `color`, and supply an icon URL of the author's choosing (the academic site uses a flaticon rocket icon: `https://cdn-icons-png.flaticon.com/512/1055/1055646.png`). Same count, same layout. If Meta-Learning is still an active interest, keep it and skip this — the grid handles ten cards without change.
- **Projects:** all cards not named in §6; the 14 filters; page quote.
- **Skills:** all existing badges (see §7 for the few renames).
- **Hobbies:** twelve items — identical to source §23. Keep.
- **Contact:** address, phone, LinkedIn, form copy.
- **Footer / Header:** tagline, social icons, nav labels, copyright.
- **Resume page quote** ("Hard work outweighs talent…"), **Projects page quote**, **Research page quote**: portfolio voice; the academic site's equivalents differ but neither is "newer".
- **Commented-out Soft Skills** in `Skills.tsx`: leave commented.

---

## 13. Potentially Missing Content With No Existing Structural Slot

### CGPA and scholarship count on the degree cards
**Content:** M.Sc. CGPA 3.88/4.00 (two 100% merit waivers); B.Sc. CGPA 3.45/4.00 (VC List, Spring 2020, 4.00/4.00 across 18 credits).
**Why it matters:** headline academic metrics on the academic site's Education section.
**Possible existing slot:** none on `educationData` (no CGPA/result field). Scholarships and the VC List are already cards in the Achievement tab, so the facts are on the site — just not on the degree cards.
**Structural change required:** No recommendation.

### "Fall 27 Aspirant"
**Content:** first line of the academic sidebar.
**Why it matters:** signals current intent to prospective supervisors.
**Possible existing slot:** could be prepended to the About page-title description or the About tagline, but neither is a status field.
**Structural change required:** No recommendation.

### Ongoing research list (source §8)
**Content:** Regional STT, Indigenous STT, Dialect→IPA, Regional transliteration, WSD dictionary, Text→IPA.
**Why it matters:** shows active work beyond published papers.
**Possible existing slot:** the Bengali.AI volunteering card already names three of these in prose. A bullet list could be appended to that card's description without touching the component.
**Structural change required:** No recommendation.

### Testimonials (source §21)
**Content:** three LinkedIn recommendations.
**Why it matters:** third-party credibility.
**Possible existing slot:** none.
**Structural change required:** No recommendation.

### Personal Philosophy (source §22)
**Content:** core belief, learning style, mission.
**Why it matters:** identity.
**Possible existing slot:** the "Never memorize…" quote already lives in the Foo Bar achievement card's Note. The mission sentence is partly in the updated About bio (§2.3).
**Structural change required:** No recommendation.

### ResearchGate / Tableau Public in footer social icons
**Content:** two additional profile links.
**Why it matters:** parity with the academic site's profile list.
**Possible existing slot:** `Footer.tsx › socialLinks` / `constants.ts › SOCIAL_LINKS` arrays — but each entry adds a visible icon. ResearchGate is already on the Research page.
**Structural change required:** No recommendation.

### External platforms (Spotify, SoundCloud, Flickr, DeviantArt, IMDb, Medium)
**Content:** source §24.
**Possible existing slot:** none (Hobbies cards have no link field).
**Structural change required:** No recommendation.

### Lead Academy course "Coverage" bullets; Learn Time details
Already covered in prose on the Experience cards. Nothing missing.

---

## 14. Final Exact Content Map

```text
src/utils/constants.ts
  PERSONAL_INFO.title    'AI Engineer'              -> 'Sr. Technical Project Manager'
  PERSONAL_INFO.email    'rezwanhasan262@gmail.com' -> 'mdrezuwanhassan@gmail.com'
  PERSONAL_INFO.website  'rezuwan262.vercel.app'    -> 'https://rezuwan.me'

src/pages/About.tsx
  PageTitle description  -> new professional summary (§2.2)

src/components/sections/About.tsx
  bio paragraph          -> new bio (§2.3)
  info grid Education    'Masters'                  -> 'M.Sc. in Computer Science & Engineering'
  info grid Email        'rezwanhasan262@gmail.com' -> 'mdrezuwanhassan@gmail.com'

src/pages/Contact.tsx
  contactInfo Email content + mailto  -> 'mdrezuwanhassan@gmail.com'
  Gmail compose &to=                  -> 'mdrezuwanhassan@gmail.com'

src/components/sections/Resume.tsx
  experienceData
    [Sr. TPM, SysModeler]       location 'United States' -> 'Michigan, United States'
    [AI Engineer, SysModeler]   location 'United States' -> 'Michigan, United States'
    [Research Engineer, BRAC]   title -> 'Graduate Research Assistant'
    [Instructor, Lead Academy]  title -> 'Instructor & Course Designer'; employmentType 'Full-Time' -> 'Contractual'
    [AI Engineer, RoboFication] FLAG: 'July, 2025 - Present' overlaps SysModeler; no end date in source — ask author
    [Freelance Data Scientist]  FLAG: '- Present' unverified — ask author
  educationData
    [B.Sc.] thesis.title  strip trailing '. '
  achievementData
    [IELTS]  title -> '... (IELTS) Academic — Band 8'
    [Google] title -> 'Expert (Remote) — Project Niti'; shortDescription -> 'Issued by Google Research\nDecember 2023'; append work-summary paragraph (§9)
  volunteeringData
    ADD  DUITS 'AI Beyond Answers' card (2nd position) — title/short/desc/logo/9 images per §8
    [BAU workshop] description -> single paragraph (§8)

src/components/sections/Research.tsx
  researchData
    ADD  RoshikBot (Under Review, CHI 2026) at top — link/image: author decision (§5.5)
    [Meaning Over Morphology] description -> source §5.1 text (currently the ASR abstract — wrong paper)
    [RegSpeech12]             id 2 -> unique (e.g. 9)  (duplicate id breaks See More)
    [B.Sc. thesis]            title -> '... of the BUS4 distribution system ...'
    [B.Sc. thesis]            FLAG author 'Mohammad Saiful Huq' vs source 'Hossain' — do not change

src/data/scholarData.json
  refresh via `npm run update-scholar` (or copy academic _data/scholar.json): 33/2026-08-26 -> 35/2026-09-12

src/pages/Projects.tsx
  ADD  Academic Portfolio Website (2026, ['web'], academic_portfolio.PNG, github + live links) (§6)
  [Unmad chatbot]   title -> 'Bangla Satirical Chatbot — Unmad Style (USB)'
  [AgriBuddy]       description -> §6 text; category 'ws' -> 'cv'
  [Federated heart] description -> §6 text
  [Portfolio Website] description -> 'Personal academic and professional portfolio website built with React and TypeScript.'
  optional: 'Parrot Classifier' -> 'Parrot Species Classifier'; YOLOv8 title -> 'Road Object Detection with YOLOv8'

src/components/sections/Skills.tsx  (skillCategories)
  ADD category 'Systems Modeling & Engineering': SysML v2, MBSE, Digital Twins, Requirements Engineering, System Modeling
  ADD category 'EEE & Engineering Tools': MATLAB/Simulink, PSpice, LTspice, Proteus, Arduino, Verilog
    (fallback if new categories are ruled structural: fold into 'Other Tools' / 'Libraries and Frameworks')
  Programming Languages: 'Markup' -> 'LaTeX' (logo 'latex')
  Libraries and Frameworks: 'Opencv' -> 'OpenCV'
  Developer Tools: ADD 'Hugging Face Spaces'
  NOTE: logo-less badge fallback URL has a stray '}' — fix or give new badges an image

src/components/sections/Interests.tsx
  [Meta-Learning] -> 'Systems Engineering' (recommended; or keep both)

UNCHANGED: Hero, Header, Footer, Hobbies, all other Resume/Research/Projects cards, filters, page quotes.
```

---

## Second-pass check

1. Inspected the actual codebase — yes (all six pages, every content component, constants, data file, public metadata, image assets).
2. Compared against the source line by line — yes.
3. All genuinely newer content identified — yes; the only new academic items are DUITS 2026, RoshikBot, Academic Portfolio Website, SE/EEE skills, IELTS band, LaTeX.
4. Outdated professional info identified — yes (§2.1, §2.2, §2.3, §3 BRAC/Lead Academy titles).
5. Historical roles preserved — yes; AI Engineer @ SysModeler, RoboFication, Neon Aloy all kept.
6. DialRes/LREC 2026 included — present already; **its description corrected**.
7. DUITS 2026 included — yes (§8).
8. BAU 2026 included — present already; text tidied.
9. BUET DLSprint4 — present already.
10. ICACT review — present already.
11. IELTS Band 8 — added to the existing card title.
12. SysModeler role — already current; location corrected.
13. Systems Engineering / MBSE direction — About summary, bio, Skills, Interests.
14. Technical skills — yes (§7).
15. Nothing invented — every value traces to the source file, the academic site's own markup, or the existing portfolio. Two conflicts and two "Present" dates are flagged, not resolved.
16–18. No redesign, no pages, no navigation changes proposed.
19. Portfolio tone preserved — short card text kept short; the only long text (bio, DUITS description) matches the register of its neighbours.
