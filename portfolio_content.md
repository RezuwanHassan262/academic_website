# Portfolio Content Extraction — Md. Rezuwan Hassan

> Source: `personal_website` (Create React App + TypeScript + React Router v7 + React-Bootstrap).
> All copy below is reproduced **verbatim** from the codebase. Inline markup (`<p>`, `<a>`, `<br>`, `<ul>`) that is stored *inside* string fields is preserved as-is, because it is part of the data, not the layout.

---

## 0. Architecture Identification & Central Data Sweep

### 0.1 Verdict

**There is no centralized content file.** The site has exactly one small shared constants module and one auto-generated JSON file; **all remaining content is hardcoded as typed arrays inside the React component that renders it.**

| Storage type | File | What lives there |
| --- | --- | --- |
| Shared constants (partially used) | `src/utils/constants.ts` | `SOCIAL_LINKS[]`, `PERSONAL_INFO{}` |
| Auto-generated JSON | `src/data/scholarData.json` | Google Scholar metrics (scraped every 24h) |
| Hardcoded in component | `src/components/sections/Resume.tsx` | `experienceData[]`, `educationData[]`, `achievementData[]`, `volunteeringData[]`, `awardsData[]` |
| Hardcoded in component | `src/components/sections/Research.tsx` | `researchData[]`, `filters[]` |
| Hardcoded in component | `src/pages/Projects.tsx` | `projects[]`, `filters[]` |
| Hardcoded in component | `src/components/sections/Skills.tsx` | `skillCategories[]` |
| Hardcoded in component | `src/components/sections/Interests.tsx` | `researchInterests[]` |
| Hardcoded in component | `src/components/sections/Hobbies.tsx` | `hobbiesItems[]` + "other platforms" links |
| Hardcoded in component | `src/pages/Contact.tsx` | `contactInfo[]` + contact form copy |
| Hardcoded in component | `src/components/layout/Footer.tsx` | `socialLinks[]` (a **second, divergent** copy of the socials) |
| Hardcoded in component | `src/components/sections/About.tsx` | bio, quick-facts key/value lists |
| Hardcoded in component | `src/components/sections/Hero.tsx` | name + typed.js rotating strings |
| Hardcoded in page props | `src/pages/*.tsx` | `<PageTitle>` titles, taglines, breadcrumbs |

> `backup_rezuwan.md` (repo root) is a pre-existing, **stale** manual content dump (Scholar metrics from Oct 2025, older role list). No component imports it. This document is generated from the live code and supersedes it.

### 0.2 Existing data schemas — preserve these field names on migration

```ts
// src/utils/constants.ts
SOCIAL_LINKS: { name: string; url: string; icon: string }[]
PERSONAL_INFO: { name; title; email; phone; location; website }

// src/data/scholarData.json
{ citations; citationsSince2021; hIndex; hIndexSince2021;
  i10Index; i10IndexSince2021; sinceYear; lastUpdated }

// src/components/sections/Resume.tsx
interface MediaItem { src: string; alt: string }
interface SimpleResumeItem {
  id: number; title: string; shortDescription?: string;
  description?: string | string[]; images?: MediaItem[];
  logo?: string; logoAlt?: string;
}
type TabType = 'experience' | 'education' | 'achievement' | 'volunteering' | 'awards'

// experienceData item (implicit type):
{ id; title; company; companyUrl; logo; logoAlt; employmentType; locationType;
  location; period; description; responsibilities?: string[];
  supervisors?: { name; link }[]; otherSupervisors?: { name; link }[];
  projects?: string[] }

// educationData item (implicit type):
{ id; degree; field; institution; location; logo; logoAlt; period;
  thesis: { title; link }; supervisor: { name; link };
  publication: { title; link }; concentration; courses: string[] }

// src/components/sections/Research.tsx
interface ResearchItem {
  id: number; title: string; authors: string; venue: string; image: string;
  link: string; presentationLink?: string; description: string;
  type: string; categories: string[];
}

// src/pages/Projects.tsx
interface ProjectLinks {
  github?; demo?; live?; dataset?; tableauDashboard?; huggingfaceSpace?;
  report?; presentation?; model?; datathon?; paper?
}
interface Project {
  id: number; title: string; category: string[]; image: string;
  description: string; technologies: string[]; links: ProjectLinks; year: string;
}

// src/components/sections/Skills.tsx
interface SkillItem { name: string; logo?: string; image?: string;
                      color: string; logoColor?: string; style?: string }
interface SkillCategory { title: string; skills: SkillItem[] }

// src/components/sections/Hobbies.tsx
interface HobbyItem { title: string; image: string; description: string; color: string }

// src/components/sections/Interests.tsx (implicit)
{ title; image; description; color }

// src/pages/Contact.tsx (implicit)
{ icon; title; content; link: string | null }

// src/components/layout/Footer.tsx
interface SocialLink { name; url; icon; alt; height; width }

// src/components/sections/PageTitle.tsx (props)
{ title; description; breadcrumbs: { name; path? }[];
  image?; imageAlt?; imageQuote? }
```

### 0.3 Routes / site map

```
/          -> Home      -> Hero
/resume    -> Resume    -> PageTitle + Resume (5 tabs)
/research  -> Research  -> PageTitle + social links + ScholarStats + Research + Interests
/projects  -> Projects  -> PageTitle + filters + project grid
/about     -> About     -> PageTitle + About + Skills + Hobbies
/contact   -> Contact   -> PageTitle + contact info + contact form
```

### 0.4 Site metadata

```yaml
html_title: "Md. Rezuwan Hassan"
meta_description: "Md. Rezuwan Hassan - Personal Portfolio Website"
theme_color: "#000000"
manifest_short_name: "MRH"
manifest_name: "MRH - Md. Rezuwan Hassan"
favicon: "/assets/img/favicon.png"
apple_touch_icon: "/assets/img/apple-touch-icon.png"
fonts: [Poppins, Roboto, Raleway, "Retro Signature"]
accent_color: "#20BEFF"
hero_background: "#1A1A1A"
navbar_background: "#000000"
```

### 0.5 Data hygiene issues found (worth fixing during migration)

- `experienceData`: `id: 4` used twice (Research Engineer, Freelance Data Scientist); `id: 7` used twice (Chief Author & Coordinator, Sr. Content Writer & Coordinator).
- `achievementData`: `id: 1` used twice (IELTS, Runners up - National AI Hackathon).
- `volunteeringData`: `id: 2` used twice (BAU workshop, IUT workshop).
- Socials are duplicated across `src/utils/constants.ts` and `src/components/layout/Footer.tsx` with different icon sources; `constants.ts` `PERSONAL_INFO.website` is `rezuwan262.vercel.app` while About/Projects use `https://www.rezuwan.me`.
- Two `Research.tsx` entries share `id: 2` (AACL-IJCNLP paper and RegSpeech12).

---

## 1. Hero / Header

### 1.1 Hero (`src/components/sections/Hero.tsx`)

```yaml
name: "Md. Rezuwan Hassan"
typed_prefix: "I'm"
typed_strings:
  - "a Researcher"
  - "an Engineer"
  - "an Artist"
typed_config: { typeSpeed: 50, backSpeed: 50, backDelay: 2000, loop: true, cursorChar: "|" }
image: "/assets/img/cover.jpg"
image_alt: "Profile"
ctas: []   # the hero has no buttons and no resume download link
```

> **Migration flag:** the codebase contains **no resume/CV download link and no PDF asset anywhere**. The `/resume` route renders an interactive tabbed section instead.

### 1.2 Professional titles used across the site

```yaml
constants_title: "AI Engineer"                       # src/utils/constants.ts
about_identity: "Engineer | Researcher | Artist | Geek | ENFJ-T | Learner | Human | Believer | Bengali"
footer_tagline: "A researcher by day, an engineer by night, and an artist all the way."
current_role: "Sr. Technical Project Manager, SysModeler, Inc."
```

### 1.3 Navbar (`src/components/layout/Header.tsx`)

```yaml
brand: "Md. Rezuwan Hassan"    # 'Retro Signature' font, color #20BEFF
nav_items:
  - { label: "Home",     path: "/",         icon: "bi bi-house" }
  - { label: "Resume",   path: "/resume",   icon: "bi bi-file-earmark-text" }
  - { label: "Research", path: "/research", icon: "bi bi-search" }
  - { label: "Projects", path: "/projects", icon: "bi bi-briefcase" }
  - { label: "About",    path: "/about",    icon: "bi bi-person" }
  - { label: "Contact",  path: "/contact",  icon: "bi bi-envelope" }
```

### 1.4 Page titles, taglines & breadcrumbs (`<PageTitle>` props)

**/about**
```yaml
title: "Myself"
description: "An Artificial Intelligence (AI) engineer with a strong passion for Deep learning, Natural language processing & Computational Cognitive Science. Dedicated to advancing open-source technologies and aim to combine passion, dedication, and hard work to achieve impactful results by contributing to meaningful initiatives while building my expertise."
breadcrumbs: [ { name: "Home", path: "/" }, { name: "Myself" } ]
```

**/resume**
```yaml
title: "Resume"
imageQuote: "The commitment that drives my continuous learning and improvement."
description: |
  "Hard work outweighs talent — every time."

  ~ Kobe Bryant
breadcrumbs: [ { name: "Home", path: "/" }, { name: "Resume" } ]
# commented out in source:
# image: "/assets/img/others/kobe_bryant_1.png"
# imageAlt: "Kobe Bryant"
```

**/research**
```yaml
title: "Research"
description: "Machines require large datasets and extensive computational training to replicate what comes to you naturally, so embrace your innate abilities and prioritize your humanity."
breadcrumbs: [ { name: "Home", path: "/" }, { name: "Research" } ]
```

**/projects**
```yaml
title: "Projects"
description: "AI projects aren't built on code alone, but on curiosity, patience, and a thousand tiny experiments."
breadcrumbs: [ { name: "Home", path: "/" }, { name: "Projects" } ]
```

**/contact**
```yaml
title: "Contact"
description: "Feel free to reach out to me for any inquiries, collaborations, or just to say hello! I'm always open to new opportunities and connections."
breadcrumbs: [ { name: "Home", path: "/" }, { name: "Contact" } ]
```

---

## 2. About Section

### 2.1 Identity headline (`src/components/sections/About.tsx`)

```
Engineer | Researcher | Artist | Geek | ENFJ-T
Learner | Human | Believer
Bengali  🇧🇩
```

Commented-out secondary headline still present in source:

```
Human | Learner | Believer | Bengali 🇧🇩
```

### 2.2 Tagline

> *An artistic soul with a passion for AI*

### 2.3 Quick facts (two-column key/value grid)

```yaml
column_1:
  - { label: "Birthday",       value: "20th August" }
  - { label: "Website",        value: "https://www.rezuwan.me" }
  - { label: "Phone/WhatsApp", value: "+8801735066946" }
column_2:
  - { label: "Education", value: "Masters" }
  - { label: "Email",     value: "rezwanhasan262@gmail.com" }
  - { label: "City",      value: "Dhaka, Bangladesh" }
```

### 2.4 Biography (rendered card)

> Hey, I'm Md. Rezuwan Hassan. I am a curious mind and a heuristic learner who loves to explore and experiment with new technologies. I love to put my merit and skills to use in making the lives of general people easier by developing open-source technologies and contributing to advancing Bangla NLP research.

### 2.5 Biography — paragraphs currently **commented out** in source (recoverable)

> I completed both my B.Sc. in Electrical and Electronic Engineering and my M.Sc. in Computer Science and Engineering, specializing in Artificial Intelligence, at BRAC University. AI has been my passion for years, and I'm driven to contribute meaningfully across its many domains.

> My fascination with languages—especially my mother tongue, Bengali—started early. I've always found it to be grammatically intricate yet exquisitely beautiful, a quality that shines in classical literature and song lyrics. The elegance and melody of the language drew me naturally toward Natural Language Processing as my core research area.

### 2.6 About images

```yaml
profile_image: "/assets/img/others/me_pic.jpg"
profile_image_alt: "Md. Rezuwan Hassan"
```

---

## 3. Skills & Technologies

Section headings:

```yaml
h2: "Skills"
subheading: "Skills & Technical Expertise"
```

Badges are generated from `img.shields.io` using `logo` / `color` / `logoColor` / `style`; entries carrying an `image` field render that URL directly instead. **No proficiency levels or skill-level tags exist in the data.**

### 3.1 Programming Languages

| Name | logo | color | logoColor | style | direct image |
| --- | --- | --- | --- | --- | --- |
| Python | python | 3776AB | fff | flat | — |
| Dart | dart | 01d2b9 | 04599c | flat-square | — |
| HTML5 | html5 | E34F26 | fff | flat-square | — |
| CSS3 | — | ffffff | 000000 | flat-square | `https://img.icons8.com/fluent/512/css3.png` |
| JavaScript | javascript | F7DF1E | 000 | flat-square | — |
| C | c | A8B9CC | fff | flat-square | — |
| Markup | — | ffffff | 000000 | flat | `https://static.thenounproject.com/png/4199129-200.png` |

### 3.2 Libraries and Frameworks

| Name | logo | color | logoColor | style | direct image |
| --- | --- | --- | --- | --- | --- |
| NumPy | numpy | 013243 | fff | flat-square | — |
| Pandas | pandas | 150458 | fff | flat-square | — |
| Plotly | plotly | 3F4F75 | fff | flat-square | — |
| SciPy | scipy | 0C55A5 | white | flat-square | — |
| scikit-learn | scikitlearn | F7931E | fff | flat-square | — |
| Keras | keras | D00000 | white | flat-square | — |
| TensorFlow | tensorflow | FF6F00 | fff | flat-square | — |
| PyTorch | pytorch | EE4C2C | fff | flat-square | — |
| Langchain | langchain | 43B02A | fff | flat-square | — |
| Fast.AI | — | ffffff | 000000 | flat-square | `https://repository-images.githubusercontent.com/487949797/588d1667-9115-4d58-b2f7-955a33b88a4e` |
| Unsloth AI | — | 15b788 | ffffff | flat-square | `https://dn721905.ca.archive.org/0/items/github.com-unslothai-unsloth_-_2023-12-04_04-59-00/cover.jpg` |
| Hugging Face | huggingface | FFD21E | 000 | flat-square | — |
| OpenAI | openai | ffffff | 000000 | flat-square | — |
| Gemini API | googlegemini | a093d8 | 3a8cfc | flat-square | — |
| LanceDB | databricks | 4285F4 | ffffff | flat-square | — |
| Faiss | meta | 1877F2 | ffffff | flat-square | — |
| Opencv | opencv | 0C55A5 | ffff80 | flat-square | — |
| ONNX | onnx | ffffff | 000000 | flat-square | — |
| Selenium | selenium | 43B02A | fff | flat-square | — |
| Flask | flask | ffffff | 000000 | flat-square | — |
| Flutter | flutter | 0CC1F3 | white | flat-square | — |
| Bootstrap | bootstrap | 7952B3 | fff | flat-square | — |

### 3.3 Developer Tools

| Name | logo | color | logoColor | style | direct image |
| --- | --- | --- | --- | --- | --- |
| Anaconda | anaconda | 44A833 | fff | flat-square | — |
| Jupyter | jupyter | F37626 | fff | flat-square | — |
| Google Colab | googlecolab | F9AB00 | fff | flat-square | — |
| Kaggle | kaggle | 20BEFF | fff | flat-square | — |
| Project IDX | — | ffffff | 000000 | flat-square | `https://aipill.io/content/images/2024/10/Project-IDX.svg` |
| Visual Studio Code | — | ffffff | 000000 | flat-square | `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1024px-Visual_Studio_Code_1.35_icon.svg.png` |
| GitHub | github | 181717 | fff | flat-square | — |
| SQLite | sqlite | 003B57 | fff | flat-square | — |
| OpenRouter | — | ffffff | 000000 | flat-square | `https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/openrouter-icon.png` |
| Netlify | netlify | ffffff | 00C7B7 | flat-square | — |
| Gradio | gradio | fab500 | fff | flat-square | — |
| Streamlit | streamlit | 20242f | 7d343b | flat-square | — |
| Render | render | ffffff | 000000 | flat-square | — |

### 3.4 Other Tools

| Name | logo | color | logoColor | style | direct image |
| --- | --- | --- | --- | --- | --- |
| Tableau | — | FFA500 | 000000 | flat-square | `https://www.pngmart.com/files/23/Tableau-Logo-PNG-HD.png` |
| Overleaf | overleaf | 47A141 | fff | flat-square | — |
| Figma | figma | F24E1E | fff | flat-square | — |
| Stack Overflow | stackoverflow | F58025 | fff | flat-square | — |
| Roboflow | roboflow | 6706cf | fff | flat-square | — |
| LabelBox | — | ffffff | 000000 | flat-square | `https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_6f5397785edd4310fc73c2e81e62f52f/labelbox.png` |
| Photoshop | — | ffffff | 000000 | flat-square | `https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/1051px-Adobe_Photoshop_CC_icon.svg.png` |
| Illustrator | — | ffffff | 000000 | flat-square | `https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Adobe_Illustrator_CC_icon.svg/2101px-Adobe_Illustrator_CC_icon.svg.png` |
| Premiere Pro | — | ffffff | 000000 | flat-square | `https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg` |

### 3.5 Soft Skills — **commented out** in source (recoverable)

```
Interpersonal Communication · Punctuality · Teamwork · Critical Thinking ·
Time Management · Creativity · Problem Solving
```

---

## 4. Resume — Tab Structure

The `/resume` page is a five-tab interface (`type TabType`):

| Tab id | Label | Icon | Data source |
| --- | --- | --- | --- |
| `experience` | Experience | `bi bi-briefcase` | `experienceData` |
| `education` | Education | `bi bi-mortarboard` | `educationData` |
| `achievement` | Achievement | `bi bi-trophy` | `achievementData` |
| `volunteering` | Volunteering | `bi bi-people` | `volunteeringData` |
| `awards` | Awards and Honors | `bi bi-award` | `awardsData` |

Inline sub-headings rendered by the experience/education tabs: `Key Responsibilities:`, `Project Involvements:`, `Reporting Supervisors:`, `Remote Supervisors:`, `Thesis:`, `Supervisor:`, `Publication:`, `Concentration:`, `Courses:`, `Gallery`.

Experience entries are grouped by `company` at render time, so multiple positions at one employer stack inside a single card.

---

## 5. Work Experience (`experienceData`)

### 5.1 Sr. Technical Project Manager — SysModeler, Inc.

```yaml
id: 0
title: "Sr. Technical Project Manager"
company: "SysModeler, Inc."
companyUrl: "http://sysmodeler.ai/"
logo: "/assets/img/others/sysmodeler_logo.jpg"
logoAlt: "SysModeler, Inc. logo"
employmentType: "Full-Time"
locationType: "Remote"
location: "United States"
period: "July, 2026 - Present"
```

**description:**
> Over the past few years, I've had the opportunity to contribute as an AI Engineer, working alongside talented researchers and engineers on AI, Software Development and Systems Engineering projects. As our team continues to grow, my role is evolving toward technical leadership and project execution. I'm grateful for the trust placed in me and excited to support such a talented group of people as we continue building and scaling together.

### 5.2 Artificial Intelligence (AI) Engineer — SysModeler, Inc.

```yaml
id: 1
title: "Artificial Intelligence (AI) Engineer"
company: "SysModeler, Inc."
companyUrl: "http://sysmodeler.ai/"
logo: "/assets/img/others/sysmodeler_logo.jpg"
logoAlt: "SysModeler, Inc. logo"
employmentType: "Full-Time"
locationType: "Remote"
location: "United States"
period: "October, 2025 - June, 2026"
```

**description:**
> SysModeler.ai is an advanced, cloud-native platform that leverages artificial intelligence to automate and accelerate Model-Based Systems Engineering (MBSE). It empowers engineers to instantly generate all 9 types of standard SysML diagrams by interpreting a variety of inputs, including natural language descriptions, code snippets from over 20 programming languages, and even real-time voice commands. By using powerful AI models, the tool translates complex system requirements into compliant visual models, which can then be refined using an intuitive drag-and-drop editor. This approach significantly speeds up the design process, improves collaboration, and simplifies documentation for engineers, particularly those working in safety-critical industries.

### 5.3 Artificial Intelligence (AI) Engineer — RoboFication LLC

```yaml
id: 2
title: "Artificial Intelligence (AI) Engineer"
company: "RoboFication LLC"
companyUrl: "http://robofication.net/"
logo: "/assets/img/others/RoboFicationLogo.png"
logoAlt: "RoboFication LLC logo"
employmentType: "Full-Time"
locationType: "Remote"
location: "Detroit, Michigan, United States"
period: "July, 2025 - Present"
```

**description:**
> RoboFication LLC is an US-based (Detroit, Michigan) company that specializes in automating systems engineering and certification processes for safety-critical industries like automotive, aerospace, defense, and robotics using AI and Formal Methods. Their AI-powered tools enhance efficiency by automating safety analyses, generating precise requirements, and ensuring regulatory compliance.

### 5.4 Junior AI Engineer — RoboFication LLC

```yaml
id: 3
title: "Junior AI Engineer"
company: "RoboFication LLC"
companyUrl: "http://robofication.net/"
logo: "/assets/img/others/RoboFicationLogo.png"
logoAlt: "RoboFication LLC logo"
employmentType: "Full-Time"
locationType: "Remote"
location: "Detroit, Michigan, United States"
period: "March, 2025 - July, 2025"
description: ""
```

**responsibilities:**
- Develop AI-driven automation tools for safety-critical industries
- Learn and implement advanced AI techniques to enhance existing systems
- Assist in developing natural language processing capabilities
- Support integration of AI functionalities into current applications
- Help design and automate workflows to minimize repetitive tasks
- Collaborate with other team members on various projects

### 5.5 Research Engineer — BRAC University

```yaml
id: 4
title: "Research Engineer"
company: "BRAC University"
companyUrl: "https://www.bracu.ac.bd/"
logo: "/assets/img/others/BRACUniversityLogo.png"
logoAlt: "BRAC University logo"
employmentType: "Full-Time"
locationType: "Hybrid"
location: "Dhaka, Bangladesh"
period: "February, 2024 - September, 2025"
```

**description:**
> BRAC University is a leading private university in Bangladesh, known for its innovative research and academic programs. The university focuses on interdisciplinary studies and aims to produce graduates who are not only knowledgeable but also socially responsible. The research initiatives at BRAC University emphasize real-world applications and community engagement.

**responsibilities:**
- Develop research protocols, pipeline, and methodology
- Process and analyze multiple types of raw data
- Automate research projects and fine-tune deep learning models
- Co-supervise and evaluate undergraduate thesis students
- Perform exam invigilation and lab classes when required

**supervisors** (rendered as "Reporting Supervisors"):
- Dr. Farig Yousuf Sadeque — `https://scholar.google.com/citations?user=ULNaeowAAAAJ&hl=en`
- Dr. Golam Rabiul Alam — `https://scholar.google.com/citations?user=t4GrJR4AAAAJ&hl=en`
- Dr. S M Taiabul Haque — `https://scholar.google.com/citations?user=tMCRaaEAAAAJ&hl=en`
- Dr. Swakkhar Shatabda — `https://scholar.google.com/citations?user=2DhrWFgAAAAJ&hl=en`

**otherSupervisors** (rendered as "Remote Supervisors"):
- Dr. Syed Ishtiaque Ahmed — `https://scholar.google.com/citations?user=A42gaP4AAAAJ&hl=en`
- Dr. Nusrat Jahan Mim — `https://scholar.google.com/citations?user=HojHDRUAAAAJ&hl=en`
- Dr. Ashik Ahmed — `https://scholar.google.com/citations?user=UodF0fIAAAAJ&hl=en`

**projects** (rendered as "Project Involvements"):
- Bengali Speech Recognition, Diarization, and Synthesis
- Transliteration and standardization of Bengali Dialects
- Various Bengali Text-to-Speech projects
- Speech to IPA Conversion
- Speech Biometric System (Voice signature authentication)
- AI-Driven Agentic Agriculture Support System
- Bengali humor and cultural roots with agentic AI
- Algorithmic Amnesia: An Empirical Study of Bengali Folklore Generation in Large Language Models
- Integrating Large Language Models for Intelligent Fault Diagnosis and Remedial Strategy Development in Power Transmission Systems
- AI-Driven Insights into Microfiber Pollution: Employing Large Language Models for Source Identification and Remediation

### 5.6 Freelance Data Scientist — Freelance

```yaml
id: 4   # duplicate id in source
title: "Freelance Data Scientist"
company: "Freelance"
companyUrl: ""
logo: "https://cdn.worldvectorlogo.com/logos/freelancer-1.svg"
logoAlt: "Freelancer logo"
employmentType: "Freelance"
locationType: "Remote"
location: "Dhaka, Bangladesh"
period: "July, 2022 - Present"
```

**description:**
> I sometimes do freelance Machine Learning, Deep Learning, Data Science, or any AI domain-related projects to challenge and hone my technical skills.
>
> So far, I have pulled off a substantial amount of gigs/tasks given to me by clients from not only from Bangladesh, but also from foreign countries (US, UK & Germany to be more specific).

### 5.7 Instructor — Lead Academy

```yaml
id: 5
title: "Instructor"
company: "Lead Academy"
companyUrl: "https://www.lead.academy/"
logo: "/assets/img/others/LeadAcademyLogo.jpg"
logoAlt: "Lead Academy logo"
employmentType: "Full-Time"
locationType: "Hybrid"
location: "Dhaka, Bangladesh"
period: "October, 2023 - December, 2023"
```

**description** (contains an inline anchor in the source string):
> Lead Academy approached me to design and take a NLP course by developing relevant pre-recorded contents for the course and I accepted the offer.
>
> I worked as an instructor there on a contractual basis. So far, I have only developed one course titled "`<a href="https://lead.academy/course/natural-language-processing-nlp-for-beginners-online-course">`Natural Language Processing (NLP) for Beginners using Python`</a>`" where I covered all the relevant topics one might need to get started with Natural Language Processing (NLP), from the very basics of NLP to developing deep learning models and using few existing large language models. Apart from covering the theories, I also demonstrated the concepts practically using the programming language Python and also demonstrated the usage of a few other relevant tools and platforms.

### 5.8 Coding Instructor — Learn Time

```yaml
id: 6
title: "Coding Instructor"
company: "Learn Time"
companyUrl: "https://www.learntime.com.bd/math"
logo: "/assets/img/others/learntimeLogo.jpg"
logoAlt: "Learn Time logo"
employmentType: "Part-Time"
locationType: "Remote"
location: "Rajshahi, Bangladesh"
period: "November, 2021 - December, 2022"
```

**description:**
> LearnTime is a Rajshahi-based e-learning platform. This is a remote part-time job where I provide 3-4 hours a week.

**responsibilities:**
- Teach programming (With Python) to people(of all ages, especially kids) from non-programming backgrounds who have little to no prior programming experience.
- Make notes, and documents, and set problems for the tests.
- Provide solutions to the problems students are struggling withh
- Teach data analytics using Python to interested people.

### 5.9 Chief Author & Coordinator (Music Segment) — নিয়ন আলোয় - Neon Aloy

```yaml
id: 7
title: "Chief Author & Coordinator (Music Segment)"
company: "নিয়ন আলোয় - Neon Aloy"
companyUrl: "https://www.linkedin.com/company/neonaloy/posts/?feedView=all"
logo: "/assets/img/others/neonaloy_logo.jpg"
logoAlt: "Neon Aloy logo"
employmentType: "Part-Time"
locationType: "Remote"
location: "Sylhet, Bangladesh"
period: "March, 2019 - December, 2019"
```

**description:**
> Neon Aloy was a Sylhet based online portal founded by 4 SUST graduates. I worked at a online bangla portal or Magazine named "NEON ALOY". I started as a Coordinator of the music segment in September 2018, and with proven experience and dedication, I was promoted to Chief Author & Coordinator in March 2019, leading the entire music content strategy and team.

**responsibilities:**
- Train and proofread new authors' work and provide feedback
- Coordinate with the editorial team for content planning
- Manage the music segment's content calendar
- Write music articles and song/album reviews of local and international artists
- Interview local artists and write follow-up reports
- Organize online events and webinars featuring local artists

### 5.10 Sr. Content Writer & Coordinator (Music Segment) — নিয়ন আলোয় - Neon Aloy

```yaml
id: 7   # duplicate id in source
title: "Sr. Content Writer & Coordinator (Music Segment)"
company: "নিয়ন আলোয় - Neon Aloy"
companyUrl: "https://www.linkedin.com/company/neonaloy/posts/?feedView=all"
logo: "/assets/img/others/neonaloy_logo.jpg"
logoAlt: "Neon Aloy logo"
employmentType: "Part-Time"
locationType: "Remote"
location: "Sylhet, Bangladesh"
period: "September, 2018 - February, 2019"
```

**description:**
> After some time as a Content Writer, I was promoted to Senior Content Writer for my dedication and contributions, and later took on the additional role of Music Segment Coordinator, where I oversaw all music-related content and led efforts to strengthen the publication's presence in this domain.

**responsibilities:**
- Coordinated the contents and managed a team of content writers in crafting engaging music articles and reviews
- Oversaw music articles, reviews, and event coverage to ensure editorial excellence
- Coordinated with photographers, writers, and editors for comprehensive music stories
- Researched and approved new content ideas aligned with audience interests
- Managed deadlines and weekly publication schedules

### 5.11 Content Writer — নিয়ন আলোয় - Neon Aloy

```yaml
id: 8
title: "Content Writer"
company: "নিয়ন আলোয় - Neon Aloy"
companyUrl: "https://www.linkedin.com/company/neonaloy/posts/?feedView=all"
logo: "/assets/img/others/neonaloy_logo.jpg"
logoAlt: "Neon Aloy logo"
employmentType: "Part-Time"
locationType: "Remote"
location: "Sylhet, Bangladesh"
period: "March, 2018 - August, 2018"
```

**description:**
> After completing my trainee period, I was promoted to a full Content Writer role, focusing primarily on music-related content and establishing my expertise in the field.

**responsibilities:**
- Write high-quality music articles and reviews
- Cover local and international music events
- Research and write about music trends and industry news
- Collaborate with editorial team on content strategy
- Meet weekly content publication targets

### 5.12 Trainee Content Writer — নিয়ন আলোয় - Neon Aloy

```yaml
id: 9
title: "Trainee Content Writer"
company: "নিয়ন আলোয় - Neon Aloy"
companyUrl: "https://www.linkedin.com/company/neonaloy/posts/?feedView=all"
logo: "/assets/img/others/neonaloy_logo.jpg"
logoAlt: "Neon Aloy logo"
employmentType: "Part-Time"
locationType: "Remote"
location: "Sylhet, Bangladesh"
period: "November, 2017 - February, 2018"
```

**description:**
> I started my journey at Neon Aloy as a trainee content writer, learning the fundamentals of bangla content writing. I learned the underrated hacks and minuscule details of writing during this period. This is where I developed my content writing skills and also fast typing skills. This was also a part time job that I used to do besides academic works & study.

**responsibilities:**
- Learn content writing fundamentals and best practices
- Write trainee-level articles under supervision
- Research on various topics and trends
- Assist senior writers and editor with content research and proof reading
- Participate in editorial meetings and training sessions

---

## 6. Education (`educationData`)

### 6.1 Master of Science - M.Sc

```yaml
id: 1
degree: "Master of Science - M.Sc"
field: "Computer Science Engineering"
institution: "BRAC University"
location: "Dhaka, Bangladesh"
logo: "/assets/img/others/BRACUniversityLogo.png"
logoAlt: "BRAC University logo"
period: "2021 - 2023"
concentration: "Natural Language Processing & Speech Recognition"
thesis:
  title: "A character gram modeling approach towards Bengali Speech to Text with Regional Dialects"
  link: "https://dspace.bracu.ac.bd/xmlui/handle/10361/25982"
supervisor:
  name: "Dr. Golam Rabiul Alam"
  link: "https://scholar.google.com/citations?user=t4GrJR4AAAAJ&hl=en"
publication:
  title: "Are ASR foundation models generalized enough to capture features of regional dialects for low-resource languages?"
  link: "https://aclanthology.org/2025.ijcnlp-short.17/"
courses:
  - "CSE710: Advanced Artificial Intelligence"
  - "CSE711: Symbolic Machine Learning"
  - "CSE712: Natural Language Processing"
  - "CSE713: Synthetic Pattern & Speech Recognition"
  - "CSE715: Neural Networks & Fuzzy Systems"
  - "CSE799: Data Science"
```

### 6.2 Bachelor of Science - B.Sc

```yaml
id: 2
degree: "Bachelor of Science - B.Sc"
field: "Electrical and Electronics Engineering"
institution: "BRAC University"
location: "Dhaka, Bangladesh"
logo: "/assets/img/others/BRACUniversityLogo.png"
logoAlt: "BRAC University logo"
period: "2016 - 2020"
concentration: "Networking, Signal Processing & Wireless Technologies"
thesis:
  title: "Efficient approach for reliability evaluation of the BUS4 distribution system considering momentary interruption. "
  link: "https://dspace.bracu.ac.bd/xmlui/handle/10361/14487"
supervisor:
  name: "Dr. A.S. Nazmul Huda"
  link: "https://scholar.google.com/citations?user=-QIR2lUAAAAJ&hl=en"
publication:
  title: "Monte Carlo Simulation for Reliability Worth Assessment of Distribution System Considering Momentary Interruptions"
  link: "https://ieeexplore.ieee.org/document/10044904/"
courses:
  - "EEE201 | EEE202: Electrical Circuits I | Electrical Circuits I Laboratory"
  - "EEE203 | EEE204: Electrical Circuits II | Electrical Circuits II Laboratory"
  - "EEE205 | EEE206: Electrical Devices I | Electrical Devices I Laboratory"
  - "EEE207 | EEE208: Electrical Devices II | Electrical Devices II Laboratory"
  - "EEE209: Semiconductor Devices and Materials"
  - "EEE221: Energy Conversion I"
  - "EEE223 | EEE224: Energy Conversion II | Energy Conversion II Laboratory"
  - "EEE241: Electromagnetic Fields and Waves"
  - "EEE243: Signal and Systems"
  - "EEE301 | EEE302: Digital Electronics | Digital Electronics Laboratory"
  - "EEE305 | EEE306: Control Systems | Control Systems Laboratory"
  - "EEE341 | EEE342: Introduction to Communication Engineering | Introduction to Communication Engineering Laboratory"
  - "EEE343 | EEE344: Digital Signal Processing | Digital Signal Processing Laboratory"
  - "EEE361 | EEE362: Data Communication | Data Communication Laboratory"
  - "EEE365 | EEE366: Microprocessor and Interfacing | Microprocessor and Interfacing Laboratory"
  - "EEE411 | EEE412: VLSI Design | VLSI Design Laboratory"
  - "EEE445 | EEE446: Digital Communications | Digital Communications Laboratory"
  - "EEE455 | EEE456: Fundamentals of Wireless LAN | Fundamentals of Wireless LAN Laboratory"
```

---

## 7. Achievements & Certifications (`achievementData`)

### 7.1 International English Language Testing System (IELTS) Academic

```yaml
id: 1
shortDescription: "Issued by British Council\nDecember 2025"
logo: "https://ielts.org/cdn/ielts-and-partner-logos/british-council-logo.webp?fit=cover&height=370&width=370&s=HTciCjfBUwMOFDTB4dMO71XWvW6VvoqvYiJF48BEWXI"
logoAlt: "British Council logo"
images:
  - { src: "/assets/img/others/ielts_score.jpg", alt: "" }
```

**description:**
> Did a very rushed prep in the final 1.5 days (Basically the last weekend), and honestly couldn't have pulled it off without 2 of my favorite juniors.
>
> Grateful to [U Mong Sain Chak](https://www.linkedin.com/in/u-mong-sain-chak-b055241a6/) for the last-minute push when I needed it the most, and to [Rubayet Sabbir Faruque](https://www.linkedin.com/in/rubayet-sabbir-faruque/) for being my mock examiner for all the speaking practice and honest feedback.

### 7.2 Runners up - National AI Hackathon

```yaml
id: 1   # duplicate id in source
shortDescription: "Issued by Bangladesh Innovation Conclave\nMay 2025"
logo: "/assets/img/others/bangladesh_innovation_conclave_logo.jpg"
logoAlt: "Bangladesh Innovation Conclave logo"
images:
  - { src: "/assets/img/others/pic_1.jpg", alt: "AI Hackathon Team Photo" }
  - { src: "/assets/img/others/ss.PNG",    alt: "AI Hackathon Presentation" }
  - { src: "/assets/img/others/ht3.jpg",   alt: "AI Hackathon Award Ceremony" }
  - { src: "/assets/img/others/ht4.jpg",   alt: "AI Hackathon Team Discussion" }
  - { src: "/assets/img/others/ht5.jpg",   alt: "AI Hackathon Project Demo" }
  - { src: "/assets/img/others/ht6.jpg",   alt: "AI Hackathon Final Results" }
```

**description:**
> Participated in the National AI Hackathon with my team ([MD. Shaleh Islam Tonmoy](https://www.linkedin.com/in/tontus/?originalSubdomain=bd) bhai, [Tanmoy Shome](https://www.linkedin.com/in/tanmoy-shome/?originalSubdomain=bd), [Rawhatur Rabbi](https://www.linkedin.com/in/rawhatur-rabbi-rafin/?originalSubdomain=bd), and [Ruwad Naswan](https://www.linkedin.com/in/ruwad-naswan-612673245/?originalSubdomain=bd)) named "AgriBRACUion". We participated under the Agriculture category, and we present AgriBuddy, an AI-powered, agentic support system designed to provide personalized and real-time agricultural guidance to farmers in Bangladesh. AgriBuddy combines advanced language and vision models, including a Retrieval-Augmented Generation (RAG) framework, to deliver Bangla-language recommendations through a smart chatbot.
>
> **It supports:**
> - Natural Bangla or Banglish text queries.
> - Image-based rice disease detection using CNN.
> - Context-aware farming advice tailored to the user's region, crop, and conditions.
>
> **Core Features:**
> - Multilingual query understanding (Bangla, English, Banglish)
> - Rice disease identification from images (Total 10 classes: 9 diseases and 1 for normal case scenario)
> - Expert agricultural advisory via integrated knowledge base
> - Personalized recommendations using user profiles and memory agents
> - Tools for weather, soil condition analysis, and cultivation tips
>
> **Technical Highlights:**
> - Modular agent-based design with Smart Query, Memory, and Expert Agents
> - CNN-based disease detection trained on the Paddy Doctor dataset
> - RAG-powered answer generation with Bangla embeddings
> - Deployment via a mobile-first Progressive Web App (PWA).
>
> Our idea was shortlisted and made it into the finals to compete against other teams with some excellent ideas as well. We didn't win first place, but we were really close. Also, the entire experience was everything. Brainstorming for ideas, coding all night after the daytime job, debugging, and lots of heuristic learning.
>
> Also, a big shoutout to our professor [Dr. Swakkhar Shatabda](https://scholar.google.com/citations?user=2DhrWFgAAAAJ&hl=en) sir for motivating us to begin with. This project wouldn't have taken shape if Swakkhar Sir hadn't given us the initial push.

### 7.3 Contributed to a Google Project

```yaml
id: 2
shortDescription: "Issued by Google\nDecember 2023"
logo: "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
logoAlt: "Google logo"
images:
  - { src: "https://diplo-media.s3.eu-central-1.amazonaws.com/2024/10/google-ai-security-update-remote-phone-locking.png", alt: "" }
```

**description:**
> Google approached our (Bengali.AI) founder [Ahmed Imtiaz Humayun (Prio)](https://www.linkedin.com/in/ahmed-imtiaz-prio/) bhai for a possible collaboration with members of the Bengali.AI team with a proposal to conduct a research project related to our very own mother tongue, the language Bengali.
>
> A small team was formed for this and I was one of the selected team members. Wrapped up the project within few months and submitted the work successfully to Google.
>
> It was fun working on this project. Got some better insights into my own mother tongue as well as got an initial idea of how LLM research works on Google.
>
> So yeah, Officially worked & contributed to a Google project.

### 7.4 Invitee – Google Foo Bar Challenge

```yaml
id: 3
shortDescription: "Issued by Google\nJuly 2023"
logo: "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
logoAlt: "Google logo"
images:
  - { src: "/assets/img/others/foo1.jpg", alt: "" }
  - { src: "/assets/img/others/foo2.jpg", alt: "" }
```

**description:**
> Back in 2023, while coding for a research project, I Googled the Lambda function syntax and unexpectedly got invited to Google's Foo Bar Challenge. Google's Foo Bar Challenge is an invitation-only secret recruitment program for Google career opportunities, events, and programs.
>
> The program was shut down in April 2024.
>
> **Note:** Einstein's quote, "Never memorize what you can look up in books," is a cornerstone of my learning philosophy. I hardly even try to memorize something that I know I can look up to at any time. I remember the process, not the syntax. Even as a daily data manipulation library Pandas user, I look things up as needed rather than overloading my memory with syntax. I believe if it's available out there, there's no point in remembering the syntax, as I'm just a human.

### 7.5 Winner - Photography Contest

```yaml
id: 4
shortDescription: "Issued by Fotoboss\nJuly 2023"
logo: "https://www.fotoboss.cz/wp-content/uploads/2022/04/fotobosss-logo.png"
logoAlt: "Fotoboss logo"
description: "Won the photography contest themed \"All about Green\" by Fotoboss."
images:
  - { src: "/assets/img/others/winp1.jpg", alt: "Winning Photo" }
  - { src: "/assets/img/others/winp2.jpg", alt: "Mail Screenshot" }
```

### 7.6 100% Merit Based Scholarship Waiver for Summer 2022

```yaml
id: 5
shortDescription: "Issued by BRAC University\nApril 2022"
logo: "https://www.bracu.ac.bd/sites/all/themes/sloth/images/f-logo.svg"
logoAlt: "BRAC University logo"
description: "Received a 100% tuition fee waiver as a merit scholarship based on academic results (CGPA: 4.00/4.00) up to the semester of Summer 2022."
```

### 7.7 100% Merit Based Scholarship Waiver for Spring 2022

```yaml
id: 6
shortDescription: "Issued by BRAC University\nJanuary 2022"
logo: "https://www.bracu.ac.bd/sites/all/themes/sloth/images/f-logo.svg"
logoAlt: "BRAC University logo"
description: "Received a 100% tuition fee waiver as a merit scholarship based on academic results (CGPA: 4.00/4.00) up to the semester of Spring 2022."
```

### 7.8 Vice Chancellor's List

```yaml
id: 7
shortDescription: "Issued by BRAC University\nApril 2020"
logo: "https://www.bracu.ac.bd/sites/all/themes/sloth/images/f-logo.svg"
logoAlt: "BRAC University logo"
description: "Got into the Vice Chancellor's list for achieving a GPA of 4.00 (out of a scale of 4.00) with 18 credits in the semester SPRING 2020."
images:
  - { src: "https://i.ibb.co.com/Mx3JDt5m/Capture.png", alt: "" }
```

---

## 8. Volunteering (`volunteeringData`)

### 8.1 AI/ML Researcher | Assistant Co-ordinator — Bengali.AI

```yaml
id: 1
shortDescription: "Bengali.AI"
logo: "assets/img/others/bai_logo.PNG"
logoAlt: "Bengali.AI logo"
images:
  - { src: "https://i.ibb.co.com/39BmKYVp/504277869-10222684872909678-3265587526765701363-n.jpg", alt: "Bengali.AI team photo" }
  - { src: "/assets/img/others/bai1.jpg",       alt: "Bengali.AI media photo" }
  - { src: "/assets/img/others/bai2.jpg",       alt: "Bengali.AI media photo" }
  - { src: "/assets/img/others/bai_meetup.jpg", alt: "Bengali.AI media photo" }
```

**description:**
> Founded in 2018, Bengali.AI has been developing open-source AI language tools & technologies for the Bengali language for common people to use as well as resources for both deep learning and linguistic researchers to comprehend and understand the language better from both computational and linguistic aspects.
>
> It is a non-profit initiative mostly working to solve the absence of open-sourced datasets and tools for Bengali Computer Vision/Natural Language Processing/Speech recognition, and Computational linguistic research with the ultimate aspiration of lifting our mother tongue Bengali from being a low-resourced language someday.
>
> I mostly work on speech projects and with audio data.
>
> Eg: Bengali speech-to-text with regional accents and dialects (Currently leading this project), Indigenous-speech-text and speech-to-IPA transcriptions, etc.
>
> And different other projects as well and contribute however I can on those projects with both my technical and soft skills.

### 8.2 Workshop Instructor - A hands-on guide to AI tools for non-technical workflows

```yaml
id: 2
shortDescription: "Bangladesh Agricultural University • June 2026"
logo: "/assets/img/others/bau_logo.jpg"
logoAlt: "Bangladesh Agricultural University logo"
images:
  - { src: "/assets/img/others/bau_poster.jpg",     alt: "" }
  - { src: "/assets/img/others/bau_workshop_1.jpg", alt: "" }
  - { src: "/assets/img/others/bau_workshop_2.jpg", alt: "" }
  - { src: "/assets/img/others/bau_workshop_3.jpg", alt: "" }
  - { src: "/assets/img/others/bau_workshop_4.jpg", alt: "" }
  - { src: "/assets/img/others/bau_workshop_5.jpg", alt: "" }
  - { src: "/assets/img/others/bau_workshop_6.jpg", alt: "" }
  - { src: "/assets/img/others/bau_workshop_7.jpg", alt: "" }
```

**description:**
> Invited to Bangladesh Agricultural University (BAU), Mymensingh, to discuss the current state of Bangla in AI as part of a panel discussion. Additionally, served as a
>
> workshop instructor, demonstrating how AI can be productively leveraged to automate non-technical workflows and everyday tasks. It was an honor to share the stage
>
> with this prominent group of Bangla NLP researchers. Special thanks to [Bangladesh Agricultural University Language Club (BAULC)](https://www.linkedin.com/company/baulc20/) for the invitation and hospitality.

### 8.3 Workshop Host & Mentor - National AI Workshop on Speech Recognition

```yaml
id: 2   # duplicate id in source
shortDescription: "Islamic University of Technology • March 2024"
logo: "/assets/img/others/iut_logo.jpg"
logoAlt: "Islamic University of Technology logo"
images:
  - { src: "/assets/img/others/bai4.jpg", alt: "" }
```

**description:**
> Bengali.AI, along with IUT Computer Society(IUTCS), is running a nationwide AI competition called "ভাষা-বিচিত্রা" (Language Variety) to find the next big talents in speech recognition for regional dialects.
>
> Despite advancements in Automatic Speech Recognition (ASR), our findings indicate limitations in current technology for accurate zero-shot and fine-tuning performance on local dialects. This challenge highlights a critical area for further research and development. This datathon targets this gap by seeking solutions that enhance ASR capabilities for diverse Bengali dialects, a language lacking extensive technological support for these regional variations.
>
> Along with me & my teammates from Bengali.AI, "Team Apocalypse" will also took the workshop with us side by side.

### 8.4 Workshop Host & Mentor – NLP Datathon Bootcamp

```yaml
id: 3
shortDescription: "United International University • February 2024"
logo: "/assets/img/others/uiu_logo.png"
logoAlt: "United International University logo"
images:
  - { src: "/assets/img/others/bai5.jpg", alt: "" }
  - { src: "/assets/img/others/bai6.jpg", alt: "" }
  - { src: "/assets/img/others/bai7.jpg", alt: "" }
```

**description:**
> Took a workshop on behalf of Bengali.AI along with some of my teammates for the inter-university natural language processing competition's bootcamp, organized by UIUCCL

### 8.5 Manuscript Reviewer

```yaml
id: 4
shortDescription: "Institute of Electrical and Electronics Engineers (IEEE) • September 2025"
logo: "/assets/img/others/ieee_logo.png"
logoAlt: "ieee reviewer certificate logo"
images:
  - { src: "/assets/img/others/ieee_reviewer.PNG", alt: "" }
```

**description:**
> Honored to have been invited to serve as a paper reviewer by the organizing committee of the IEEE International Conference on Advanced Computing Technologies (ICACT 2025).
>
> Had the opportunity to review papers focusing on AI-driven innovations and contributing to maintaining the conference's academic quality and integrity.

### 8.6 Blood Donor

```yaml
id: 5
shortDescription: "Quantum Foundation • February 2021 - Present"
logo: "/assets/img/others/quantum_foundation_logo.png"
logoAlt: "Quantum Foundation logo"
images:
  - { src: "/assets/img/others/qf1.jpg", alt: "" }
  - { src: "/assets/img/others/qf2.jpg", alt: "" }
```

**description:**
> I donate my blood here in every 4 months.
> I've lost count of how many times I've donated blood, whether it was after a sudden phone call or a post that showed up on Facebook feed.

### 8.7 Content Moderator and Musician

```yaml
id: 6
shortDescription: "Hawai Mithaiyar Gan • January 2019 - December 2020"
logo: "/assets/img/others/hmg_logo.jpg"
logoAlt: "Hawai Mithaiyar Gan logo"
images:
  - { src: "/assets/img/others/hmg_1.jpg", alt: "" }
```

**description:**
> Hawai Mithaiyar Gan is basically a duo of 2 multi-instrumentalist "Murshedul Arefin Riyad" & "Tasin Bin Noor" and also a platform for musicians from different genres to collaborate.
>
> I used to plan, create, and moderate the content of their YouTube channel and social media platforms and sometimes also contributed to music.
>
> Youtube Channel: [https://www.youtube.com/@hawaimithaiiyergan8330](https://www.youtube.com/channel/UC7f0CqF5fqOq5Qtb1_mxC8g)

---

## 9. Awards and Honors (`awardsData`)

### 9.1 Adjudicator — BUET

```yaml
id: 1
title: "Adjudicator"
shortDescription: "Bangladesh University of Engineering and Technology\nMarch 2026"
logo: "/assets/img/others/BUETLogo.png"
logoAlt: "BUET logo"
images:
  - { src: "/assets/img/others/adj11.jpg", alt: "" }
  - { src: "/assets/img/others/adj12.jpg", alt: "" }
  - { src: "/assets/img/others/adj13.jpg", alt: "" }
```

**description:**
> Got invited to be a adjudicator for the national deep learning competition "DLSprint4" organized by CSE department of BUET. The problem was bengali Long-Form audio transcription & Multi-Speaker diarization.

### 9.2 Adjudicator — Islamic University of Technology

```yaml
id: 2
title: "Adjudicator"
shortDescription: "Islamic University of Technology\nApril 2024"
logo: "/assets/img/others/iut_logo.jpg"
logoAlt: "Islamic University of Technology logo"
images:
  - { src: "/assets/img/others/adj2.jpg", alt: "" }
  - { src: "/assets/img/others/adj3.jpg", alt: "" }
  - { src: "/assets/img/others/adj4.jpg", alt: "" }
  - { src: "https://i.ibb.co.com/fzm10bSp/504158011-10222700763666937-3820733829808306677-n.jpg", alt: "" }
```

**description:**
> I'm pleased to announce that the dataset that was utilized in this national ICT fest's datathon segment "Bhashabichitra: ASR for Regional Dialects" was an extended version of the dataset that I developed from scratch as a part of my master's thesis research which I later extended with my team here in Bengali.AI
>
> Huge thanks to the IUT Computer Society(IUTCS) for orchestrating such a fantastic event. Grateful to have been a part of such a grand national event.

### 9.3 Adjudicator — United International University

```yaml
id: 3
title: "Adjudicator"
shortDescription: "United International University\nMarch 2024"
logo: "/assets/img/others/uiu_logo.png"
logoAlt: "United International University logo"
images:
  - { src: "/assets/img/others/adj5.jpg", alt: "" }
  - { src: "/assets/img/others/adj6.jpg", alt: "" }
  - { src: "/assets/img/others/adj7.jpg", alt: "" }
  - { src: "https://i.ibb.co.com/whrnxWgC/503511178-10222684872989680-1500352243817215248-n.jpg", alt: "" }
```

**description:**
> I'm pleased to announce that the dataset that was utilized in this national level datathon "Bhashamul: Bengali Text with Regional Dialects to IPA Transcription Modeling" was a prototype dataset from one of the researches I'm currently leading here with my team at Bengali.AI.
>
> Thanks to UIU Cse department & UIU Computer Club for organizing such an amazing event. Glad to have been able to be a part of this datathon.

### 9.4 Adjudicator — University of Dhaka

```yaml
id: 4
title: "Adjudicator"
shortDescription: "University of Dhaka\nNovember 2023"
logo: "/assets/img/others/duLogo.jpg"
logoAlt: "University of Dhaka logo"
images:
  - { src: "/assets/img/others/adj8.jpg",  alt: "" }
  - { src: "/assets/img/others/adj9.jpg",  alt: "" }
  - { src: "/assets/img/others/adj10.jpg", alt: "" }
```

**description:**
> One of my recent co-authored research paper's dataset (Bengali text to IPA transcription) was utilized in the national deep learning competition "Datathon Challenge - Cefalo Presents ITverse 2023" arranged by Dhaka University's "IIT Software Engineers' Community" and I was invited to be one of the judges of the competition on behalf of Bengali.AI and evaluate the submissions of the top participant teams from all over the Bangladesh.

### 9.5 Recognition from the Ministry of Foreign Affairs, Bangladesh

```yaml
id: 5
shortDescription: "Issued by Ministry of Foreign Affairs, Bangladesh\nJune 2023"
logo: "/assets/img/others/ministry_of_foreign_affairs_bangladesh_logo.jpg"
logoAlt: "Ministry of Foreign Affairs, Bangladesh logo"
description: "I was invited to talk about multiple open-source linguistic project initiatives and represent BengaliAI to the Ministry of Foreign Affairs of Bangladesh."
images:
  - { src: "/assets/img/others/rec1.jpg", alt: "" }
  - { src: "/assets/img/others/rec2.jpg", alt: "" }
```

### 9.6 Invited Speaker – Talk with Researchers: Bengali Language in NLP

```yaml
id: 6
shortDescription: "Andromeda Space & Robotics Research Organization - August 2023"
logo: "/assets/img/others/asrro_logo.jpg"
logoAlt: "Andromeda Space & Robotics Research Organization logo"
images:
  - { src: "/assets/img/others/rec3.jpg", alt: "" }
```

**description:**
> Was invited to be a speaker at a webinar on AI and Bangla NLP organized by Andromeda Space & Robotics Research Organization from CUET

### 9.7 Invited Speaker – AI Research & Academic Development Webinar

```yaml
id: 7
shortDescription: "BRAC University Computer Club - December 2023"
logo: "/assets/img/others/bucc_logo.jpg"
logoAlt: "BRAC University Computer Club logo"
images:
  - { src: "/assets/img/others/rec4.jpg", alt: "" }
```

**description:**
> Was invited to be a speaker at a webinar on AI, Bangla NLP, and the importance of doing impactful research, and how a student should pick good topics for their undergrad thesis, organized by BRAC University Computer Club

### 9.8 Invited Speaker – AI Symposium : Exploring Bangla NLP with Bengali.AI

```yaml
id: 8
shortDescription: "Tech Topia - May 2023"
logo: "/assets/img/others/ttl.jpg"
logoAlt: "Tech Topia logo"
images:
  - { src: "/assets/img/others/rec5.jpg", alt: "" }
```

**description:**
> Got invited as a speaker for Talk about Bangla NLP organized by TechTopia

### 9.9 Adjudicator — BRAC University Electrical and Electronic Club

```yaml
id: 9
title: "Adjudicator"
shortDescription: "BRAC University Electrical and Electronic Club\nMarch 2021"
logo: "/assets/img/others/bueec_logo.jpg"
logoAlt: "BRAC University EEE Club logo"
images: []
```

**description:**
> Was invited to evaluate the writings of the participants in a tech write-up contest "Electroditor" organized by Brac University Electrical and Electronics Club.

---

## 10. Research

### 10.1 Section copy (`src/components/sections/Research.tsx`)

```yaml
h2: "Research Papers"
subheading: "Manuscripts I contributed to"
subtitle: "Research papers I contributed to that showcase my exploration in AI, Machine Learning, and both electrical and computational science."
card_cta_primary: "Read Paper"
card_cta_secondary: "View Presentation"
expand_toggle: ["... See More", "See Less"]   # description truncated at 200 chars
```

### 10.2 Research filters

```yaml
filters:
  - { id: "all",         name: "All" }
  - { id: "ai",          name: "Artificial Intelligence" }
  - { id: "federated",   name: "Federated Learning" }
  - { id: "power",       name: "Power Distribution System" }
  - { id: "agentic",     name: "Agentic AI" }
  - { id: "agriculture", name: "Smart Agriculture" }
  - { id: "nlp",         name: "NLP" }
  - { id: "snlp",        name: "Speech NLP" }
  - { id: "bnlp",        name: "Bangla NLP" }
```

### 10.3 Google Scholar stats (`src/data/scholarData.json` → `ScholarStats.tsx`)

```json
{
  "citations": 33,
  "citationsSince2021": 33,
  "hIndex": 4,
  "hIndexSince2021": 4,
  "i10Index": 1,
  "i10IndexSince2021": 1,
  "sinceYear": "2021",
  "lastUpdated": "2026-08-26"
}
```

Rendered labels: `Citations`, `h-index`, `i10-index`, `Since 2021`, and the footnote:

> The stats are automatically scraped and synced with Google Scholar every 24 hours

Research page academic profile links (rendered above the stats card):

```yaml
- { name: "Google Scholar", url: "https://scholar.google.com/citations?user=ZUrWZhQAAAAJ&hl=en&authuser=1", icon: "/assets/img/google-scholar.png" }
- { name: "ResearchGate",   url: "https://www.researchgate.net/profile/Md-Hassan-82",                       icon: "https://user-images.githubusercontent.com/511683/28757557-f82cff1a-7585-11e7-9317-072a838dcca3.png" }
```

### 10.4 Publications (`researchData`)

#### [1] Meaning Over Morphology: A Multi-Metric Benchmark of LLMs for Bangla Dialect Translation

```yaml
id: 1
authors: "Soumik Deb Niloy, Subhey Sadi Rahman, Mahbub E Sobhani, Golam Rabiul Alam, Farig Sadeque, Md. Rezuwan Hassan"
venue: "2026, DialRes Workshop, Language Resources and Evaluation Conference (LREC)"
type: "Workshop Paper"
image: "/assets/img/research/dialres2.png"
link: "https://aclanthology.org/2026.dialres-1.24/"
categories: ["bnlp", "nlp", "ai"]
```

**description:**
> Conventional research on speech recognition modeling relies on the canonical form for most low-resource languages while automatic speech recognition (ASR) for regional dialects is treated as a fine-tuning task. To investigate the effects of dialectal variations on ASR we develop a 78-hour annotated Bengali Speech-to-Text (STT) corpus named Ben-10. Investigation from linguistic and data-driven perspectives shows that speech foundation models struggle heavily in regional dialect ASR, both in zero-shot and fine-tuned settings. We observe that all deep learning methods struggle to model speech data under dialectal variations but dialect specific model training alleviates the issue. Our dataset also serves as a out of-distribution (OOD) resource for ASR modeling under constrained resources in ASR algorithms. The dataset and code developed for this project are publicly available.

#### [2] Are ASR foundation models generalized enough to capture features of regional dialects for low-resource languages?

```yaml
id: 2
authors: "Tawsif Tashwar Dipto, Azmol Hossain, Rubayet Sabbir Faruque, Md. Rezuwan Hassan, Kanij Fatema, Tanmoy Shome, Ruwad Naswan, Md.Foriduzzaman Zihad, Mohaymen Ul Anam, Nazia Tasnim, Hasan Mahmud, Md Kamrul Hasan, Md. Mehedi Hasan Shawon, Farig Sadeque, Tahsin Reasat"
venue: "2025, Association for Computational Linguistics – International Joint Conference on Natural Language Processing (AACL-IJCNLP)"
type: "Conference Paper"
image: "/assets/img/research/asr_general.PNG"
link: "https://aclanthology.org/2025.ijcnlp-short.17/"
categories: ["snlp", "bnlp", "nlp", "ai"]
```

**description:**
> Conventional research on speech recognition modeling relies on the canonical form for most low-resource languages while automatic speech recognition (ASR) for regional dialects is treated as a fine-tuning task. To investigate the effects of dialectal variations on ASR we develop a 78-hour annotated Bengali Speech-to-Text (STT) corpus named Ben-10. Investigation from linguistic and data-driven perspectives shows that speech foundation models struggle heavily in regional dialect ASR, both in zero-shot and fine-tuned settings. We observe that all deep learning methods struggle to model speech data under dialectal variations but dialect specific model training alleviates the issue. Our dataset also serves as a out of-distribution (OOD) resource for ASR modeling under constrained resources in ASR algorithms. The dataset and code developed for this project are publicly available.

#### [3] RegSpeech12: A Regional Corpus of Bengali Spontaneous Speech Across Dialects

```yaml
id: 2   # duplicate id in source
authors: "Md. Rezuwan Hassan, Azmol Hossain, Kanij Fatema, Rubayet Sabbir Faruque, Tanmoy Shome, Ruwad Naswan, Trina Chakraborty, Md. Foriduzzaman Zihad, Tawsif Tashwar Dipto, Nazia Tasnim, Nazmuddoha Ansary, Md. Mehedi Hasan Shawon, Ahmed Imtiaz Humayun, Md. Golam Rabiul Alam, Farig Sadeque, Asif Sushmit"
venue: "2025, ArXiv"
type: "Preprint"
image: "/assets/img/research/regspeech12.png"
link: "https://arxiv.org/abs/2510.24096"
categories: ["snlp", "bnlp", "nlp", "ai"]
```

**description:**
> The Bengali language, spoken extensively across South Asia and among diasporic communities, exhibits considerable dialectal diversity shaped by geography, culture, and history. Phonological and pronunciation-based classifications broadly identify five principal dialect groups: Eastern Bengali, Manbhumi, Rangpuri, Varendri, and Rarhi. Within Bangladesh, further distinctions emerge through variation in vocabulary, syntax, and morphology, as observed in regions such as Chittagong, Sylhet, Rangpur, Rajshahi, Noakhali, and Barishal. Despite this linguistic richness, systematic research on the computational processing of Bengali dialects remains limited. This study seeks to document and analyze the phonetic and morphological properties of these dialects while exploring the feasibility of building computational models particularly Automatic Speech Recognition (ASR) systems tailored to regional varieties. Such efforts hold potential for applications in virtual assistants and broader language technologies, contributing to both the preservation of dialectal diversity and the advancement of inclusive digital tools for Bengali-speaking communities. The dataset created for this study is released for public use.

#### [4] AgriBuddy: An AI-powered Agent-based System for Bangladeshi Agriculture Using RAG and Vision Models

```yaml
id: 3
authors: "Shaleh Islam Tonmoy, Rawhatur Rabbi, Md. Rezuwan Hassan, Ruwad Naswan, Tanmoy Shome"
venue: "2025, Technical Report"
type: "Technical Report"
image: "/assets/img/research/agriBuddy.jpg"
link: "https://www.researchgate.net/publication/392194862_AgriBuddy_An_Agentic_AI_System_for_Bangladeshi_Agriculture_Using_RAG_and_Vision_Models"
categories: ["bnlp", "agentic", "agriculture", "ai"]
```

**description:**
> Bangladesh's agriculture sector faces pressing challenges from climate variability, limited rural expert access, and the need for real-time, personalized farming advice. This paper presents AgriBuddy, an AI-powered, agent-based system that delivers localized agricultural recommendations in natural Bangla dialogue. AgriBuddy combines a Retrieval-Augmented Generation framework with specialized agents—Smart Query Handler, User Memory Agent, and Expert Advisory Agent—and a CNN-based vision module for rice disease detection. It draws on structured and unstructured data, including BRRI crop variants, community-sourced disease images, and advisory texts. Designed as a mobile-first chatbot, AgriBuddy lets farmers ask questions, share images, and receive actionable guidance. Early deployment shows strong accuracy in disease classification and high relevance in responses. We describe the system's design, architecture, and deployment, and outline future enhancements such as voice interaction, IoT integration, and real-time climate adaptation. With contributors' consent, a project overview video and source repository have been released on YouTube and GitHub as open-source resources.

#### [5] IPA Transcription of Bengali Texts

```yaml
id: 4
authors: "Kanij Fatema, Fazle Dawood Haider, Nirzona Ferdousi Turpa, Azmol Hossain, Sourav Ahmed, Navid Hasan, Mohammad Akhlaqur Rahman, Biplab Kumar Sarkar, Afrar Jahin, Md. Rezuwan Hassan, Md Foriduzzaman Zihad, Rubayet Sabbir Faruque, Asif Sushmit, Mashrur Imtiaz, Farig Sadeque, Syed Shahrier Rahman"
venue: "2024, OpenReview"
type: "Preprint"
image: "/assets/img/research/ipa_table.PNG"
link: "https://openreview.net/forum?id=W9gVRjWL8e&referrer=%5Bthe+profile+of+Farig+Sadeque%5D%28%2Fprofile%3Fid%3D%7EFarig_Sadeque1%29"
categories: ["bnlp", "nlp"]
```

**description:**
> The International Phonetic Alphabet (IPA) serves to systematize phonemes in language, enabling precise textual representation of pronunciation. In Bengali phonology and phonetics, ongoing scholarly deliberations persist concerning the IPA standard and core Bengali phonemes. This work examines prior research, identifies current and potential issues, and suggests a framework for a Bengali IPA standard, facilitating linguistic analysis and NLP resource creation and downstream technology development. In this work, we present a comprehensive study of Bengali IPA transcription and introduce a novel IPA transcription framework incorporating a novel dataset with DL-based benchmarks.

#### [6] A character gram modeling approach towards Bengali Speech to Text with Regional Dialects

```yaml
id: 5
authors: "Md. Rezuwan Hassan"
venue: "Masters Thesis, BracU Institutional Repository, 2023"
type: "Thesis"
image: "/assets/img/research/w2v2_char_tok.png"
link: "https://dspace.bracu.ac.bd/xmlui/handle/10361/25982"
categories: ["bnlp", "nlp", "snlp", "ai"]
```

**description:**
> The Bengali language, spoken in various regions of south-Asia and also among the Bengali diaspora, exhibits rich diversity with regional dialects or variations that reflect the cultural, geographic, and historical influences of different regional/sociocultural communities. Based on phonology and pronunciation, Bengali is said to have 5 distinct major dialectal variations, such as Eastern Bengali Dialect, Manbhumi, Rangpuri, Varendri, and Rarhi. For the dialects present in Bangladesh, even finer stratification can be done based on the used vocabulary, pronunciation, phonology, syntax, and morphology.These regional Bengali dialects are found in regions such as Bangladesh in the regions of Chittagong, Sylhet, Rangpur, Rajshahi, Noakhali, Barishal, etc possess unique phonetic, lexical, and syntactic features that set them apart from standard Bengali and also unique from each other. However, research and resources dedicated to understanding and harnessing the potential of natural language processing of regional Bengali languages remain limited. To bridge this gap, this work aims to investigate and document the characteristics of regional Bengali languages through comprehensive data-driven linguistic analyses, including phonetic and morphological studies. We also aim to study the feasibility of developing computational models, including Automatic Speech Recognition (ASR) systems, tailored to regional Bengali languages, which can facilitate applications like virtual voice command assistants and language processing tools. Our research findings will contribute to the understanding of regional Bengali languages, paving the way to foster the advancement of language technologies that can cater to the diverse linguistic needs of Bengali-speaking communities. Through this study, we intend to promote preservation of the regional dialects of the Bengali language, foster cultural inclusivity, and facilitate effective communication in the Bengali-speaking regions.

#### [7] Monte Carlo Simulation for Reliability Worth Assessment of Distribution System Considering Momentary Interruptions

```yaml
id: 6
authors: "Md Tanjil Ahmed, Md Rezuwan Hassan, Palash Chandra Ghosh, Mohammad Saiful Huq, Mohaimenul Islam, AS Nazmul Huda"
venue: "2022 International Conference on Energy and Power Engineering (ICEPE), 1-6"
type: "Conference Paper"
image: "/assets/img/research/monte_carlo_paper_fig.png"
link: "https://ieeexplore.ieee.org/document/10044904"
categories: ["power"]
```

**description:**
> This paper deals with the reliability worth assessment of electric power distribution system considering momentary interruptions. Reliability worth study quantifies the interrupted energy and also monetary losses incurred by utility customers due to electric power failures. Sequential Monte Carlo (MC) simulation technique is applied for the assessment purpose. The advantage of using MC simulation over the analytical approach is that uncertainty of associated random variables can be taken into consideration in MC simulation. Case studies are conducted on the Roy Billinton Test System connected to bus 4 distribution system. The results of MC simulation technique are complementary to those calculated by the analytical method.

#### [8] A Horizontal Federated Random Forest for Heart Disease Detection from Decentralized Local Data

```yaml
id: 7
authors: "Shafin Mahmud Jalal, Md. Rezuwan Hassan, Md Ashfaqul Haque, Md Golam Rabiul Alam"
venue: "2022 IEEE 10th Region 10 Humanitarian Technology Conference (R10-HTC), 191-196"
type: "Conference Paper"
image: "/assets/img/research/federated-gif.gif"
link: "https://ieeexplore.ieee.org/document/9929490"
categories: ["federated", "ai"]
```

**description:**
> In the modern world, reliable data is a thriving need in every sector. As the data increases, maintaining data privacy is also becoming a big concern. The healthcare sector is no different than that. Privacy in the healthcare sector is a topmost concern when sharing with other institutes. As data from a single healthcare institute is not always enough to get properly predicted outputs in machine learning approaches. There comes the idea of sharing data among multiple hospitals for having a more specified model with keeping the data details private. So, we have designed a model combining a federated central model and clients for the application of Federated Learning on heart disease patients' data. Here, we have implemented an approach for sharing only the model parameters among the clients and central in horizontal federated learning infused with random forest. At the evaluation of our model, we have come up with improved accuracy of 7.1, 2, and 6 percent respectively for the federated central and both clients.

#### [9] Efficient approach for reliability evaluation of distribution system considering momentary interruption

```yaml
id: 8
authors: "Tanjil Ahmed, Md. Rezuwan Hassan, Palash Chandra Ghosh, Mohammad Saiful Huq"
venue: "Undergraduate Thesis, BracU Institutional Repository, 2020"
type: "Thesis"
image: "/assets/img/research/monte_carlo_thesis_fig.png"
link: "https://dspace.bracu.ac.bd/xmlui/handle/10361/14487"
categories: ["power"]
```

**description:**
> The purpose of an electric power system is to provide electricity to its customers with acceptable levels of reliability at the lowest possible cost. In this thesis, we propose an efficient method for power distribution system reliability evaluation considering momentary interruption. The proposed method is based on sequential Monte Carlo (MC) simulation technique. The method is effectively used for evaluating cost of customer interruption and duration of interruption length in a complex distribution system. A comparative analysis between analytical and MC time sequential simulation based results is also presented. Satisfactory results are obtained from the analysis. Sensitivity analysis of different variables of distribution system reliability is also conducted.

---

## 11. Research Interests (`src/components/sections/Interests.tsx`)

Section copy:

```yaml
h2: "Research Interests"
subheading: "I'm interested in"
subtitle: "The topics that make me excited to explore, test ideas, and chase answers."
```

| Title | Description | color | image |
| --- | --- | --- | --- |
| Computational Cognitive Science | Understanding human cognition through computational models and AI | `#ffbb2c` | `https://cdn-icons-png.flaticon.com/512/1610/1610171.png` |
| Human-Computer Interaction | Designing intuitive interfaces and user experiences | `#5578ff` | `https://www.vhv.rs/dpng/d/466-4660054_iap43345-human-computer-interaction-logo-hd-png-download.png` |
| Computational Social Science | Understanding social behavior through computational models | `#e80368` | `https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/42/2d33a37006421bbba9bbaf6f834b37/DSV1078_1200x1200.png` |
| Natural Language Processing | Enabling machines to understand and respond to human language | `#33fd70ff` | `https://cdn-icons-png.flaticon.com/512/9831/9831356.png` |
| Generative AI | Creating new content and ideas through AI | `#9e13eeff` | `https://static.vecteezy.com/system/resources/previews/034/846/004/non_2x/artificial-intelligence-ai-logo-icon-vector.jpg` |
| Federated Learning | Distributed machine learning with privacy preservation | `#d3c015ff` | `https://static.vecteezy.com/system/resources/previews/053/124/328/non_2x/synthetic-data-blue-gradient-concept-icon-type-of-privacy-enhancing-technologies-information-round-shape-line-illustration-abstract-idea-graphic-design-easy-to-use-in-article-vector.jpg` |
| Meta-Learning | Learning to learn and few-shot learning approaches | `#47aeff` | `https://static.vecteezy.com/system/resources/previews/016/530/479/non_2x/icon-meta-learning-related-to-machine-learning-symbol-blue-eyes-style-simple-design-editable-simple-illustration-simple-icons-vector.jpg` |
| Reinforcement Learning | AI agents learning through interaction and feedback | `#ffa76e` | `https://cdn-icons-png.flaticon.com/512/9304/9304481.png` |
| Healthcare/Medical AI | AI applications in healthcare and medical diagnosis | `#11dbcf` | `https://static.vecteezy.com/system/resources/previews/029/272/386/non_2x/ai-in-healthcare-icon-vector.jpg` |

Commented-out alternate icon for HCI: `https://cdn-icons-png.flaticon.com/512/1828/1828778.png`

---

## 12. Projects (`src/pages/Projects.tsx`)

### 12.1 Project filters

```yaml
filters:
  - { id: "all",  name: "All" }
  - { id: "fl",   name: "Federated Learning" }
  - { id: "nlp",  name: "Natural Language Processing" }
  - { id: "cv",   name: "Computer Vision" }
  - { id: "aai",  name: "Agentic AI" }
  - { id: "mlds", name: "Machine Learning & Data Science" }
  - { id: "dsda", name: "Data Science and Tableau Data Analysis" }
  - { id: "hci",  name: "Human Computer Interaction" }
  - { id: "web",  name: "Web Development" }
  - { id: "ws",   name: "Web Scraping" }
  - { id: "hmai", name: "Healthcare/Medical AI" }
  - { id: "ost",  name: "Open-Source Tools" }
  - { id: "bnlp", name: "Bangla NLP" }
  - { id: "spch", name: "Speech NLP" }
sort: "year descending"
card_link_labels: [ "Live Demo", "View Code", "View Paper", "View Report",
  "View Presentation", "Model Weights", "Datathon", "Dataset",
  "HuggingFace Space", "Tableau Dashboard", "View Demo" ]
```

### 12.2 Project entries

#### Demographics of Best CS Scientists Worldwide

```yaml
id: 1
year: "2023"
category: ["ws", "dsda"]
image: "https://i.ibb.co.com/7tRsyj9Y/Capture.png"
technologies: ["Python", "Selenium", "Web Scraping", "Dataset Curation", "Tableau"]
links:
  github: "https://github.com/RezuwanHassan262/Tableau-Practice-work-Demographics-of-Best-CS-Scientists-Worldwide/tree/main?tab=readme-ov-file"
  dataset: "https://github.com/RezuwanHassan262/Tableau-Practice-work-Demographics-of-Best-CS-Scientists-Worldwide/blob/main/best_cs_scientist_details.csv"
  tableauDashboard: "https://public.tableau.com/app/profile/md.reuzwan.hassan/viz/PracticeworkDemographicsofBestCSScientistsWorldwide/DemographicsofBestCSScientistsWorldwide"
```

**description:** This project involved web scraping from a dynamic site and using Tableau to analyze top computer scientists, highlighting key research regions and institutions.

#### Last 100+ years of Earthquake Data Scraping Analysis and Visualization

```yaml
id: 2
year: "2023"
category: ["ws", "dsda"]
image: "https://raw.githubusercontent.com/RezuwanHassan262/Last-100-plus-years-Earthquake-Data-Analysis-And-Visualization/main/dashboard_images/8.%20Total%20Earthquake%20in%20Bangladesh%2C%20India%2C%20Bhutan%20%26%20Myanmar%20(BIBM)%20sub-region%20(Map).png"
technologies: ["Python", "Selenium", "Web Scraping", "Dataset Curation", "Tableau"]
links:
  github: "https://github.com/RezuwanHassan262/Last-100-plus-years-Earthquake-Data-Analysis-And-Visualization"
  dataset: "https://github.com/RezuwanHassan262/Last-100-plus-years-Earthquake-Data-Analysis-And-Visualization/blob/main/csv_files/EarthquakeData.csv"
  tableauDashboard: "https://public.tableau.com/app/profile/md.reuzwan.hassan/viz/Last100yearsEarthquakeData-Analysis/LocationwiseEarthquakecountBINM"
```

**description:** Scraped earthquake data from a website covering Bangladesh and neighboring countries, cleaned, curated, and visualized insights using Tableau.

#### Aviation Accident Risk Analysis and Making Business Recommendations

```yaml
id: 3
year: "2025"
category: ["mlds", "dsda"]
image: "https://raw.githubusercontent.com/RezuwanHassan262/Aviation-Accident-Data-Analysis-and-Business-Recommendations/main/images/D1.PNG"
technologies: ["Python", "Scikit Learn", "Dataset Analysis", "Tableau"]
links:
  github: "https://github.com/RezuwanHassan262/Aviation-Accident-Data-Analysis-and-Business-Recommendations"
  dataset: "https://github.com/RezuwanHassan262/Aviation-Accident-Data-Analysis-and-Business-Recommendations/blob/main/data/Aviation_Accident_Fixed_Database.csv"
  tableauDashboard: "https://public.tableau.com/app/profile/md.reuzwan.hassan/viz/AviationAccidentDatabaseTableauDashboards/Dashboard1"
```

**description:** Used the "Aviation Accident Database" and Tableau to identify low‐risk aircraft and recommend safer models and practices for the aviation industry.

#### Titanic EDA and Survival Prediction

```yaml
id: 4
year: "2024"
category: ["mlds", "dsda"]
image: "https://raw.githubusercontent.com/RezuwanHassan262/Titanic-EDA-and-Survival-Prediction/main/figures/11.png"
technologies: ["Python", "Scikit Learn", "Dataset Analysis", "Machine Learning Algorithms"]
links:
  github: "https://github.com/RezuwanHassan262/Titanic-EDA-and-Survival-Prediction"
```

**description:** This project analyzes factors like age, class, and gender affecting Titanic survival and predicts passenger survival chances based on given features using different machine learning algorithms.

#### Prototype system design of Bengali humor in Unmad style

```yaml
id: 5
year: "2025"
category: ["bnlp", "nlp", "hci"]
image: "/assets/img/others/ss2.PNG"
technologies: ["OpenAI", "Vector Database", "Retrieval-Augmented Generation", "Hugging Face", "Large Language Model", "Prompt Engineering"]
links:
  github: "https://github.com/RezuwanHassan262/USB_Unmad_Satirical_Bot"
  demo: "https://huggingface.co/spaces/Rezuwan/USB_Unmad_Satirical_Bot?logs=container"
```

**description:** A Bangla satirical chatbot inspired by Unmad magazine's comedic, sarcastic writing style. It takes a user's question, retrieves relevant Bangla text snippets from a knowledge base, and answers with humorous, exaggerated, and witty satire never in a direct, serious tone.

#### Parrot Classifier

```yaml
id: 6
year: "2023"
category: ["cv", "ws"]
image: "/assets/img/research/three.png"
technologies: ["Python", "Image Classifier", "Data Scraping", "Hugging Face"]
links:
  github: "https://github.com/RezuwanHassan262/Parrot-Species-Classifier"
  demo: "https://parrot-classifier-60.netlify.app/"
  dataset: "https://huggingface.co/datasets/Rezuwan/Parrot60_Dataset/tree/main"
  huggingfaceSpace: "https://huggingface.co/spaces/Rezuwan/parrot_classifier"
```

**description:** Scraped parrot species images, fine‐tuned a fast.ai classifier (93% accuracy on 60 species), deployed on Hugging Face Spaces, and integrated the API into another custom website.

#### Custom Training YOLOv8 to detect Vehicle, Pedestrians, and Signboards

```yaml
id: 7
year: "2024"
category: ["cv", "ws"]
image: "https://raw.githubusercontent.com/RezuwanHassan262/YOLOv8-Custom-Training-Object-Detection/main/images/streamlit_2.PNG"
technologies: ["Python", "Image Classifier", "Dataset Creation", "Hugging Face"]
links:
  github: "https://github.com/RezuwanHassan262/Custom-Training-YOLOv8-to-detect-Vehicle-Pedestrians-and-Signboards"
  demo: "https://yolov8-custom-training-object-detection-j3besa9ppegzcdzslzsk8t.streamlit.app/"
  dataset: "https://app.roboflow.com/bondstein-technologies-limited/bondstein_project/browse?queryText=&pageSize=50&startingIndex=0&browseQuery=true"
  huggingfaceSpace: "https://huggingface.co/spaces/Rezuwan/Road_and_Pedestrian_Detection"
```

**description:** Fine‐tuned YOLOv8n on a custom dataset from video frames, auto‐labeled with Roboflow, and deployed on Hugging Face Spaces Streamlit, and locally without API support.

#### AgriBuddy

```yaml
id: 8
year: "2025"
category: ["bnlp", "nlp", "aai", "ws"]
image: "/assets/img/research/agb.png"
technologies: ["Python", "Langchain", "OpenAI", "Faiss", "CNN"]
links:
  github: "https://github.com/AgriBRACUtion"
  report: "https://www.researchgate.net/publication/392194862_AgriBuddy_An_Agentic_AI_System_for_Bangladeshi_Agriculture_Using_RAG_and_Vision_Models"
  presentation: "https://youtu.be/vTWUjcQ4wnM"
```

**description:** AI-powered agent-based agricultural assistant system for Bangladeshi farmers using RAG and Vision Models

#### Bengali Speech Recognition with Regional Dialects

```yaml
id: 9
year: "2024"
category: ["bnlp", "nlp", "spch"]
image: "/assets/img/others/bai3.jpg"
technologies: ["Python", "PyTorch", "HuggingFace", "Wav2Vec2", "Whisper", "ASR"]
links:
  github: "https://github.com/RezuwanHassan262/Bengali-Speech-Recognition-with-Regional-Dialects"
  demo: "https://huggingface.co/spaces/Rezuwan/Regional_Speech_ASR"
  report: "https://www.researchgate.net/publication/387686959_A_character_gram_modeling_approach_towards_Bengali_Speech_to_Text_with_Regional_Dialects"
  model: "https://huggingface.co/Rezuwan/regional_asr_weights"
  datathon: ""    # empty string in source
```

**description:** My master's thesis involved building a regional speech corpus and fine‐tuning Wav2Vec2 for Bengali dialect transcription. The project led to a datathon using a dataset checkpoint, after which I fine‐tuned a Whisper model and deployed it on HuggingFace Space.

#### Automatic Bengali Transcription System

```yaml
id: 10
year: "2024"
category: ["bnlp", "nlp", "spch"]
image: "https://tds-images.thedailystar.net/sites/default/files/styles/social_share/public/images/2022/11/18/zoom_virtual_background.jpg"
technologies: ["Python", "Automatic Speech Recognition", "Whisper", "Hugging Face"]
links:
  github: "https://github.com/RezuwanHassan262/Automatic-Bangla-Transcription"
```

**description:** A robust Bangla speech recognition system has been prototyped, achieving exceptional transcription accuracy. We are now in the deployment phase, aiming to provide a user‐friendly web interface for generating CSV/Excel outputs from audio inputs

#### Multi-label Film Genre Classifier

```yaml
id: 11
year: "2024"
category: ["nlp", "ws"]
image: "https://raw.githubusercontent.com/RezuwanHassan262/Multi-label-Film-Classifier/main/images/fgcw.PNG"
technologies: ["Python", "Text Classification", "Roberta", "Hugging Face"]
links:
  github: "https://github.com/RezuwanHassan262/Multi-label-Film-Classifier/tree/main"
  dataset: "https://github.com/RezuwanHassan262/Multi-label-Film-Classifier/blob/main/data/film_details.csv"
  demo: "https://multi-label-film-classifier.onrender.com/"
  huggingfaceSpace: "https://huggingface.co/spaces/Rezuwan/film_genre_classifier"
```

**description:** Scraped movie and TV data to build a multi-label genre classifier, fine-tuned a transformer model, converted it to ONNX for faster inference, and deployed it via Flask on HuggingFace Space and OnRender.

#### A prototype system design of Heart Disease Detection using Horizontal Federated Learning with Random Forest

```yaml
id: 12
year: "2022"
category: ["fl", "hmai"]
image: "/assets/img/research/federated-gif.gif"
technologies: ["Python", "Scikit-learn", "Federated Learning", "Healthcare AI"]
links:
  paper: "https://ieeexplore.ieee.org/document/9929490"
  github: "https://github.com/federated-heart-disease"
```

**description:** Horizontal Federated Random Forest for Heart Disease Detection from Decentralized Data

#### ChemQuery: Learn Molecules Easily

```yaml
id: 14   # note: id 13 does not exist in source
year: "2025"
category: ["ost"]
image: "https://i.ibb.co.com/YTWWqFTV/5lhg17bzk0761.jpg"
technologies: ["Python", "Gradio", "Hugging Face"]
links:
  github: "https://github.com/RezuwanHassan262/ChemQuery"
  demo: "https://huggingface.co/spaces/Rezuwan/ChemQuery"
```

**description:** ChemQuery is a free and open-source chemistry learning tool built as part of an educational initiative to support students worldwide. ChemQuery is Powered by PubChem & PubChemPy — designed to make chemistry learning simple and fun for students, teachers, and curious minds alike.

#### Background Remover

```yaml
id: 15
year: "2025"
category: ["ost"]
image: "https://i.ibb.co.com/4g4tNWyj/Capture.png"
technologies: ["Python", "Gradio", "Hugging Face"]
links:
  github: "https://github.com/RezuwanHassan262/Background_Remover"
  demo: "https://huggingface.co/spaces/Rezuwan/Image_Background_Remove"
```

**description:** Open-Source background remover tool implementation through python, gradio and huggingface. Upload an image or use an example to remove its background. Not the best image background remover out there but good enough for a free tool.

#### Portfolio Website

```yaml
id: 16
year: "2025"
category: ["web"]
image: "assets/img/others/ppc.PNG"
technologies: ["React", "TypeScript", "CSS"]
links:
  github: "https://github.com/RezuwanHassan262/personal_portfolio_website"
  demo: "https://www.rezuwan.me"
```

**description:** My personal portfolio website showcasing my projects and skills.

---

## 13. Hobbies (`src/components/sections/Hobbies.tsx`)

Section copy:

```yaml
h2: "Hobbies"
subheading: "Hobbies & Interests"
subtitle: "Apart from work and studies, I also have a lot of hobbies. The hobbies I enjoy and the interests I pursue in my free time."
```

| Title | Description | color | image |
| --- | --- | --- | --- |
| Music | Enjoying and exploring various music genres and artists. Both playing and listening. | `#ff6b6b` | `https://cdn-icons-png.flaticon.com/512/3659/3659784.png` |
| Songwriting | Composing lyrics and melodies as a creative outlet. Both writing and analyzing | `#4ecdc4` | `https://cdn-icons-png.flaticon.com/512/2907/2907253.png` |
| Workout | Maintaining fitness and strength through regular workouts | `#6a0572` | `https://cdn-icons-png.flaticon.com/512/2936/2936886.png` |
| Sketching | Drawing portraits, landscapes and conceptual art | `#45b7d1` | `https://cdn-icons-png.flaticon.com/512/1547/1547093.png` |
| Photography | Capturing moments and exploring visual storytelling | `#f8a055` | `https://cdn-icons-png.flaticon.com/512/1042/1042390.png` |
| Writing | Expressing ideas through creative and technical writing | `#f67280` | `https://cdn-icons-png.flaticon.com/512/2593/2593482.png` |
| Movies | Watching and analyzing films across different genres | `#8675a9` | `https://cdn-icons-png.flaticon.com/512/3418/3418886.png` |
| Reading | Exploring literature, fiction and non-fiction books | `#88d498` | `https://cdn-icons-png.flaticon.com/512/2436/2436882.png` |
| Cycling | Exploring scenic routes and staying active on two wheels | `#c06c84` | `https://cdn-icons-png.flaticon.com/512/6669/6669767.png` |
| Basketball | The only sports I find a spiritual connection with | `#ff7f50` | `https://cdn-icons-png.flaticon.com/512/2633/2633966.png` |
| Swimming | Swimming for cardiovascular fitness and relaxation | `#20b2aa` | `https://cdn-icons-png.flaticon.com/512/9896/9896650.png` |
| Martial Arts | Practicing basic MMA moves for self-defense and mental focus | `#dc143c` | `https://cdn-icons-png.flaticon.com/512/921/921675.png` |

### 13.1 "Find me on other platforms" (creative/personal profiles)

```yaml
portfolio_title: "Find me on other platforms"
portfolio_links:
  - { name: "Spotify",     url: "https://open.spotify.com/user/0efb57bct29kilrcjvkw9jnjk?si=62e69017ee0b4741&nd=1&dlsi=b9e75a106e034278", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1200px-Spotify_icon.svg.png" }
  - { name: "Flickr",      url: "https://www.flickr.com/photos/139437500@N06/page1",                                                     icon: "https://www.flickrhelp.com/hc/article_attachments/4419907666708/unnamed.png" }
  - { name: "IMDb",        url: "https://www.imdb.com/user/ur62837581/?ref_=nv_usr_prof_2",                                              icon: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/171_Imdb_logo_logos-512.png" }
  - { name: "SoundCloud",  url: "https://soundcloud.com/listener-rezwan-9",                                                              icon: "https://cdn-icons-png.flaticon.com/512/145/145809.png" }
  - { name: "DeviantArt",  url: "https://www.deviantart.com/noobdoodlerrazor",                                                           icon: "https://cdn-icons-png.freepik.com/512/145/145800.png" }
  - { name: "Medium",      url: "https://medium.com/@rezwanhasan626",                                                                    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968906.png" }
```

> There is **no blog post listing** in the codebase — Medium is linked as an external profile only.

---

## 14. Contact & Socials

### 14.1 Canonical personal info (`src/utils/constants.ts` → `PERSONAL_INFO`)

```yaml
name: "Md. Rezuwan Hassan"
title: "AI Engineer"
email: "rezwanhasan262@gmail.com"
phone: "+8801735066946"
location: "Dhaka, Bangladesh"
website: "rezuwan262.vercel.app"   # NOTE: diverges from https://www.rezuwan.me used elsewhere
```

### 14.2 Contact page items (`src/pages/Contact.tsx` → `contactInfo`)

```yaml
- { icon: "bi bi-geo-alt",   title: "Address",       content: "Khilgaon, Dhaka-1219, Bangladesh", link: null }
- { icon: "bi bi-telephone", title: "Call/WhatsApp", content: "+8801735066946",                   link: "tel:+8801735066946" }
- { icon: "bi bi-envelope",  title: "Email",         content: "rezwanhasan262@gmail.com",         link: "mailto:rezwanhasan262@gmail.com" }
- { icon: "bi bi-linkedin",  title: "LinkedIn",      content: "md-rezuwan-hassan/",               link: "https://www.linkedin.com/in/md-rezuwan-hassan/" }
```

### 14.3 Contact page copy

```yaml
contact_title: "Get In Touch"
contact_description: "I'm always open to discussing new opportunities, interesting projects, creative ideas, or opportunities to be part of your visions."
form_title: "Send me a Message"
form_description: "Fill out the form below and I'll get back to you as soon as possible."
form_fields:
  - { label: "Name *",    name: "name",    placeholder: "Your Name",                    required: true }
  - { label: "Email *",   name: "email",   placeholder: "your.email@example.com",       required: true }
  - { label: "Subject",   name: "subject", placeholder: "Message Subject (Optional)",   required: false }
  - { label: "Message *", name: "message", placeholder: "Write your message here...",   required: true, rows: 6 }
submit_button: "Send Message"
validation_alert: "Please fill in all required fields (Name, Email, and Message)."
```

Form mechanics: no backend. It opens a Gmail compose window addressed to `rezwanhasan262@gmail.com`.

```yaml
default_subject_template: "Message from {name} - Portfolio Contact"
body_template: |
  Hello Md. Rezuwan Hassan,

  {message}

  Best regards,
  {name}
  Email: {email}
```

### 14.4 Social links — `src/utils/constants.ts` (`SOCIAL_LINKS`)

```yaml
- { name: "LinkedIn",       url: "https://www.linkedin.com/in/md-rezuwan-hassan/",                 icon: "bi bi-linkedin" }
- { name: "GitHub",         url: "https://github.com/RezuwanHassan262",                            icon: "bi bi-github" }
- { name: "Google Scholar", url: "https://scholar.google.com/citations?user=ZUrWZhQAAAAJ&hl=en",   icon: "fab fa-google-scholar" }
- { name: "Hugging Face",   url: "https://huggingface.co/Rezuwan",                                 icon: "fa-solid fa-robot" }
- { name: "Kaggle",         url: "https://www.kaggle.com/mdrezuwanhassan",                         icon: "fab fa-kaggle" }
```

### 14.5 Social links — `src/components/layout/Footer.tsx` (`socialLinks`, second copy)

```yaml
- { name: "LinkedIn",       url: "https://www.linkedin.com/in/md-rezuwan-hassan/",               alt: "LinkedIn Link",       height: "30", width: "40", icon: "https://raw.githubusercontent.com/RezuwanHassan262/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" }
- { name: "Google Scholar", url: "https://scholar.google.com/citations?user=ZUrWZhQAAAAJ&hl=en", alt: "Google Scholar Link", height: "40", width: "40", icon: "https://user-images.githubusercontent.com/556268/96353342-3f386c80-10cb-11eb-9865-0c40dfe6ab8b.png" }
- { name: "GitHub",         url: "https://github.com/RezuwanHassan262",                          alt: "GitHub Link",         height: "30", width: "40", icon: "https://raw.githubusercontent.com/RezuwanHassan262/github-profile-readme-generator/master/src/images/icons/Social/github.svg" }
- { name: "Kaggle",         url: "https://www.kaggle.com/mdrezuwanhassan",                       alt: "Kaggle Link",         height: "30", width: "40", icon: "https://raw.githubusercontent.com/RezuwanHassan262/github-profile-readme-generator/master/src/images/icons/Social/kaggle.svg" }
- { name: "Hugging Face",   url: "https://huggingface.co/Rezuwan",                               alt: "Hugging Face",        height: "30", width: "30", icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" }
```

### 14.6 Complete link inventory (deduplicated)

```yaml
professional:
  linkedin:        "https://www.linkedin.com/in/md-rezuwan-hassan/"
  github:          "https://github.com/RezuwanHassan262"
  google_scholar:  "https://scholar.google.com/citations?user=ZUrWZhQAAAAJ&hl=en"
  researchgate:    "https://www.researchgate.net/profile/Md-Hassan-82"
  huggingface:     "https://huggingface.co/Rezuwan"
  kaggle:          "https://www.kaggle.com/mdrezuwanhassan"
  tableau_public:  "https://public.tableau.com/app/profile/md.reuzwan.hassan"
creative:
  spotify:     "https://open.spotify.com/user/0efb57bct29kilrcjvkw9jnjk"
  flickr:      "https://www.flickr.com/photos/139437500@N06/page1"
  imdb:        "https://www.imdb.com/user/ur62837581/"
  soundcloud:  "https://soundcloud.com/listener-rezwan-9"
  deviantart:  "https://www.deviantart.com/noobdoodlerrazor"
  medium:      "https://medium.com/@rezwanhasan626"
sites:
  primary: "https://www.rezuwan.me"
  vercel:  "rezuwan262.vercel.app"
```

---

## 15. Footer

```yaml
heading: "Md. Rezuwan Hassan"
tagline: "A researcher by day, an engineer by night, and an artist all the way."
copyright: "© {currentYear} Md. Rezuwan Hassan All Rights Reserved"   # year computed at runtime
socials: see §14.5
```

---

## 16. Miscellaneous / Custom Sections Present

| Section | Status |
| --- | --- |
| Google Scholar live stats card | **Present** (§10.3), auto-updated by `scripts/scholarScraper.js` via GitHub Actions |
| Speaking engagements | **Present**, filed under *Awards and Honors* (§9.6–9.8) and *Volunteering* (§8.2–8.4) |
| Awards / Adjudications | **Present** (§9) |
| Certifications | **Present**, filed under *Achievement* (IELTS, §7.1) |
| Testimonials | **Absent** |
| Blog post listings | **Absent** (Medium linked as external profile only) |
| Resume/CV download | **Absent** — no PDF asset and no download link exist |
| `ProjectShowcase.tsx` | **Unused component** — a richer project-modal renderer (labels: "Technologies Used", "Project Screenshots", "Project Links", "Live Demo", "View Code", "Demo Video") that no page currently imports |

---

## 17. Migration Notes

1. **Consolidate to one source of truth.** Recommended shape for a new `content.json` / `config.js`, keyed by the existing field names so mapping is 1:1:

```
content.json
├─ personal        (from PERSONAL_INFO + About quick facts)
├─ hero            (name, typedStrings, image)
├─ about           (identity, tagline, quickFacts[], bio)
├─ skills[]        (SkillCategory[])
├─ experience[]    (experienceData[])
├─ education[]     (educationData[])
├─ achievements[]  (achievementData[])
├─ volunteering[]  (volunteeringData[])
├─ awards[]        (awardsData[])
├─ research[]      (researchData[])  + researchFilters[]
├─ projects[]      (projects[])      + projectFilters[]
├─ interests[]     (researchInterests[])
├─ hobbies[]       (hobbiesItems[])  + otherPlatforms[]
├─ contact         (contactInfo[] + form copy)
├─ socials[]       (single merged list — see §14.6)
└─ pageTitles      (per-route title/description/breadcrumbs)
```

2. **Resolve the duplicate `id` values** listed in §0.5 before keying React lists by `id`.
3. **Unify the two socials arrays** (§14.4 vs §14.5) and pick one website value (`https://www.rezuwan.me` appears to be canonical).
4. **`description` fields contain raw HTML** in `achievementData`, `volunteeringData`, `awardsData`, and two `experienceData` entries. Either keep an HTML-capable renderer or convert those strings to Markdown during migration.
5. **Keep `scholarData.json` separate and machine-written** — `scripts/scholarScraper.js` (npm script `update-scholar`) rewrites it on a schedule; folding it into a hand-edited content file would break the automation.
6. **Many images are hot-linked to third-party hosts** (shields.io, flaticon, vecteezy, wikimedia, ibb.co, g2crowd, freepnglogos, archive.org). These are fragile; consider vendoring them into `/assets` during migration.
