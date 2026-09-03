---
permalink: /
title: "About Me"
author_profile: true
redirect_from:
  - /about/
  - /about.html
toc: true
toc_label: "On this page"
---

**Engineer | Researcher | Artist | Geek | ENFJ-T | Learner | Human | Believer | Bengali 🇧🇩**

> *An artistic soul with a passion for AI.*

Hey, I'm **Md. Rezuwan Hassan**. I am a curious mind and a heuristic learner who loves to explore
and experiment with new technologies. I love to put my merit and skills to use in making the lives
of general people easier by developing open-source technologies and contributing to advancing
**Bangla NLP** research.

I completed both my B.Sc. in Electrical and Electronic Engineering and my M.Sc. in Computer Science
and Engineering — specialising in Artificial Intelligence — at BRAC University. AI has been my
passion for years, and I'm driven to contribute meaningfully across its many domains.

My fascination with languages, especially my mother tongue Bengali, started early. I've always found
it grammatically intricate yet exquisitely beautiful, a quality that shines in classical literature
and song lyrics. The elegance and melody of the language drew me naturally toward Natural Language
Processing as my core research area.

## Quick Facts

| | |
|---|---|
| **Professional title** | Sr. Technical Project Manager, SysModeler, Inc. |
| **Location** | Khilgaon, Dhaka-1219, Bangladesh |
| **Education** | M.Sc. in Computer Science & Engineering |
| **Email** | [rezwanhasan262@gmail.com](mailto:rezwanhasan262@gmail.com) |
| **Phone / WhatsApp** | [+8801735066946](tel:+8801735066946) |
| **Website** | [https://www.rezuwan.me](https://www.rezuwan.me) |
| **Birthday** | 20th August |

**Professional & academic profiles:**
[Google Scholar](https://scholar.google.com/citations?user=ZUrWZhQAAAAJ&hl=en) ·
[ResearchGate](https://www.researchgate.net/profile/Md-Hassan-82) ·
[GitHub](https://github.com/RezuwanHassan262) ·
[Hugging Face](https://huggingface.co/Rezuwan) ·
[Kaggle](https://www.kaggle.com/mdrezuwanhassan) ·
[LinkedIn](https://www.linkedin.com/in/md-rezuwan-hassan/) ·
[Tableau Public](https://public.tableau.com/app/profile/md.reuzwan.hassan)

## Selected Publications

{% assign recent_pubs = site.publications | sort: 'date' | reverse %}
{% for post in recent_pubs limit: 5 %}
  <div class="about_card">
    <div class="about_card__content">
      <div class="about_card__content__title">{{ post.title }}</div>
      <div class="about_card__content__date">
        {{ post.venue }}{% if post.date %} &middot; {{ post.date | date: "%Y" }}{% endif %}
        {% if post.paperurl %} &middot; <a href="{{ post.paperurl }}">Paper</a>{% endif %}
        {% if post.slidesurl %} &middot; <a href="{{ post.slidesurl }}">Slides</a>{% endif %}
        {% if post.posterurl %} &middot; <a href="{{ post.posterurl }}">Poster</a>{% endif %}
        {% if post.videourl %} &middot; <a href="{{ post.videourl }}">Video</a>{% endif %}
      </div>
      <div class="about_card__content__details">{{ post.authors | markdownify }}</div>
    </div>
  </div>
{% endfor %}

[See all publications &rarr;]({{ base_path }}/publications/)

## Work Experience

<div class="about_card">
    <img class="about_card__logo" src="/images/sysmodeler_logo.jpg" alt="SysModeler Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Sr. Technical Project Manager</div>
    <div class="about_card__content__subtitle">SysModeler, Inc.</div>
    <div class="about_card__content__date">July 2026 – Present &middot; Full-Time &middot; Remote (United States)</div>
    <p class="about_card__content__details">
      Over the past few years I've contributed as an AI Engineer, working alongside talented researchers
      and engineers on AI, software development and systems engineering projects. As our team continues
      to grow, my role is evolving toward technical leadership and project execution.
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/images/sysmodeler_logo.jpg" alt="SysModeler Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Artificial Intelligence (AI) Engineer</div>
    <div class="about_card__content__subtitle"><a href="http://sysmodeler.ai/">SysModeler, Inc.</a></div>
    <div class="about_card__content__date">October 2025 – June 2026 &middot; Full-Time &middot; Remote (United States)</div>
    <p class="about_card__content__details">
      SysModeler.ai is a cloud-native platform that uses AI to automate and accelerate Model-Based Systems
      Engineering (MBSE). It generates all 9 types of standard SysML diagrams by interpreting natural-language
      descriptions, code snippets from over 20 programming languages, and real-time voice commands — then lets
      engineers refine them in a drag-and-drop editor. The approach speeds up design, improves collaboration and
      simplifies documentation, particularly for safety-critical industries.
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/images/RoboFicationLogo.png" alt="RoboFication Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Artificial Intelligence (AI) Engineer</div>
    <div class="about_card__content__subtitle"><a href="http://robofication.net/">RoboFication LLC</a></div>
    <div class="about_card__content__date">July 2025 – Present &middot; Full-Time &middot; Remote (Detroit, Michigan, US)</div>
    <p class="about_card__content__details">
      RoboFication LLC specialises in automating systems engineering and certification processes for
      safety-critical industries — automotive, aerospace, defence and robotics — using AI and formal methods.
      Their AI-powered tools automate safety analyses, generate precise requirements, and help ensure
      regulatory compliance.
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/images/RoboFicationLogo.png" alt="RoboFication Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Junior AI Engineer</div>
    <div class="about_card__content__subtitle"><a href="http://robofication.net/">RoboFication LLC</a></div>
    <div class="about_card__content__date">March 2025 – July 2025 &middot; Full-Time &middot; Remote</div>
    <p class="about_card__content__details">
      <strong>Responsibilities:</strong>
      <ul>
        <li>Develop AI-driven automation tools for safety-critical industries</li>
        <li>Learn and implement advanced AI techniques to enhance existing systems</li>
        <li>Assist in developing natural language processing capabilities</li>
        <li>Support integration of AI functionalities into current applications</li>
        <li>Help design and automate workflows to minimise repetitive tasks</li>
      </ul>
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/images/BRACUniversityLogo.png" alt="BRAC University Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Graduate Research Assistant</div>
    <div class="about_card__content__subtitle"><a href="https://www.bracu.ac.bd/">BRAC University</a></div>
    <div class="about_card__content__date">February 2024 – September 2025 &middot; Full-Time &middot; Hybrid (Dhaka, Bangladesh)</div>
    <p class="about_card__content__details">
      <strong>Responsibilities:</strong>
      <ul>
        <li>Develop research protocols, pipelines and methodology</li>
        <li>Process and analyse multiple types of raw data</li>
        <li>Automate research projects and fine-tune deep learning models</li>
        <li>Co-supervise and evaluate undergraduate thesis students</li>
        <li>Perform exam invigilation and lab classes when required</li>
      </ul>
      <strong>Project involvements:</strong>
      <ul>
        <li>Bengali speech recognition, diarization and synthesis</li>
        <li>Transliteration and standardisation of Bengali dialects</li>
        <li>Various Bengali text-to-speech projects; speech-to-IPA conversion</li>
        <li>Speech biometric system (voice signature authentication)</li>
        <li>AI-driven agentic agriculture support system</li>
        <li>Bengali humour and cultural roots with agentic AI</li>
        <li>Algorithmic Amnesia: an empirical study of Bengali folklore generation in LLMs</li>
        <li>LLMs for intelligent fault diagnosis and remedial strategy in power transmission systems</li>
        <li>AI-driven insights into microfiber pollution using LLMs for source identification</li>
      </ul>
      <strong>Reporting supervisors:</strong>
      <a href="https://scholar.google.com/citations?user=ULNaeowAAAAJ&hl=en">Dr. Farig Yousuf Sadeque</a>,
      <a href="https://scholar.google.com/citations?user=t4GrJR4AAAAJ&hl=en">Dr. Golam Rabiul Alam</a>,
      <a href="https://scholar.google.com/citations?user=tMCRaaEAAAAJ&hl=en">Dr. S M Taiabul Haque</a>,
      <a href="https://scholar.google.com/citations?user=2DhrWFgAAAAJ&hl=en">Dr. Swakkhar Shatabda</a><br>
      <strong>Remote supervisors:</strong>
      <a href="https://scholar.google.com/citations?user=A42gaP4AAAAJ&hl=en">Dr. Syed Ishtiaque Ahmed</a>,
      <a href="https://scholar.google.com/citations?user=HojHDRUAAAAJ&hl=en">Dr. Nusrat Jahan Mim</a>,
      <a href="https://scholar.google.com/citations?user=UodF0fIAAAAJ&hl=en">Dr. Ashik Ahmed</a>
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/images/LeadAcademyLogo.jpg" alt="Lead Academy Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Instructor</div>
    <div class="about_card__content__subtitle"><a href="https://www.lead.academy/">Lead Academy</a></div>
    <div class="about_card__content__date">October 2023 – December 2023 &middot; Hybrid (Dhaka, Bangladesh)</div>
    <p class="about_card__content__details">
      Lead Academy approached me to design and deliver an NLP course by developing the pre-recorded content
      for it. I worked there as an instructor on a contractual basis, developing
      <a href="https://lead.academy/course/natural-language-processing-nlp-for-beginners-online-course">Natural Language Processing (NLP) for Beginners using Python</a>
      — covering everything from the basics of NLP through deep learning models and existing large language
      models, with practical Python demonstrations throughout.
      <a href="{{ base_path }}/teaching/">See teaching &rarr;</a>
    </p>
  </div>
</div>

<div class="about_card">
  <div class="about_card__content">
    <div class="about_card__content__title">Freelance Data Scientist</div>
    <div class="about_card__content__subtitle">Freelance</div>
    <div class="about_card__content__date">July 2022 – Present &middot; Remote (Dhaka, Bangladesh)</div>
    <p class="about_card__content__details">
      I take on freelance machine learning, deep learning, data science and other AI-domain projects to
      challenge and hone my technical skills. So far I have delivered a substantial number of gigs for
      clients not only in Bangladesh but also abroad — the US, UK and Germany specifically.
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/images/learntimeLogo.jpg" alt="Learn Time Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Coding Instructor</div>
    <div class="about_card__content__subtitle"><a href="https://www.learntime.com.bd/math">Learn Time</a></div>
    <div class="about_card__content__date">November 2021 – December 2022 &middot; Part-Time &middot; Remote (Rajshahi, Bangladesh)</div>
    <p class="about_card__content__details">
      LearnTime is a Rajshahi-based e-learning platform; a remote part-time role of 3–4 hours a week.
      <ul>
        <li>Teach programming (with Python) to people of all ages, especially kids, from non-programming backgrounds</li>
        <li>Make notes and documents, and set problems for tests</li>
        <li>Provide solutions to the problems students are struggling with</li>
        <li>Teach data analytics using Python to interested learners</li>
      </ul>
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/images/neonaloy_logo.jpg" alt="Neon Aloy Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Chief Author &amp; Coordinator (Music Segment)</div>
    <div class="about_card__content__subtitle"><a href="https://www.linkedin.com/company/neonaloy/posts/">নিয়ন আলোয় — Neon Aloy</a></div>
    <div class="about_card__content__date">November 2017 – December 2019 &middot; Part-Time &middot; Remote (Sylhet, Bangladesh)</div>
    <p class="about_card__content__details">
      Neon Aloy was a Sylhet-based online Bangla portal founded by four SUST graduates. I progressed through
      four roles there: <em>Trainee Content Writer</em> (Nov 2017) → <em>Content Writer</em> (Mar 2018) →
      <em>Sr. Content Writer &amp; Coordinator, Music Segment</em> (Sep 2018) →
      <em>Chief Author &amp; Coordinator, Music Segment</em> (Mar 2019).
      <ul>
        <li>Led the music content strategy and team; trained and proofread new authors' work</li>
        <li>Managed the music segment's content calendar and weekly publication schedule</li>
        <li>Wrote music articles and song/album reviews of local and international artists</li>
        <li>Interviewed local artists and wrote follow-up reports</li>
        <li>Organised online events and webinars featuring local artists</li>
      </ul>
    </p>
  </div>
</div>

## Education

<div class="about_card">
  <img class="about_card__logo" src="/images/BRACUniversityLogo.png" alt="BRAC University Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Master of Science (M.Sc) in Computer Science Engineering</div>
    <div class="about_card__content__subtitle">BRAC University, Dhaka, Bangladesh</div>
    <div class="about_card__content__date">2021 – 2023</div>
    <div class="about_card__content__achievement">Concentration: Natural Language Processing &amp; Speech Recognition</div>
    <div class="about_card__content__achievement">Two 100% merit-based scholarship waivers (CGPA 4.00/4.00)</div>
    <p class="about_card__content__details">
      <strong>Thesis:</strong> <a href="https://dspace.bracu.ac.bd/xmlui/handle/10361/25982">A character gram modeling approach towards Bengali Speech to Text with Regional Dialects</a><br>
      <strong>Supervisor:</strong> <a href="https://scholar.google.com/citations?user=t4GrJR4AAAAJ&hl=en">Dr. Golam Rabiul Alam</a><br>
      <strong>Publication:</strong> <a href="https://aclanthology.org/2025.ijcnlp-short.17/">Are ASR foundation models generalized enough to capture features of regional dialects for low-resource languages?</a><br>
      <strong>Courses:</strong> CSE710 Advanced Artificial Intelligence · CSE711 Symbolic Machine Learning ·
      CSE712 Natural Language Processing · CSE713 Synthetic Pattern &amp; Speech Recognition ·
      CSE715 Neural Networks &amp; Fuzzy Systems · CSE799 Data Science
    </p>
  </div>
</div>

<div class="about_card">
  <img class="about_card__logo" src="/images/BRACUniversityLogo.png" alt="BRAC University Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Bachelor of Science (B.Sc) in Electrical and Electronics Engineering</div>
    <div class="about_card__content__subtitle">BRAC University, Dhaka, Bangladesh</div>
    <div class="about_card__content__date">2016 – 2020</div>
    <div class="about_card__content__achievement">Concentration: Networking, Signal Processing &amp; Wireless Technologies</div>
    <div class="about_card__content__achievement">Vice Chancellor's List, Spring 2020 — GPA 4.00/4.00</div>
    <p class="about_card__content__details">
      <strong>Thesis:</strong> <a href="https://dspace.bracu.ac.bd/xmlui/handle/10361/14487">Efficient approach for reliability evaluation of the BUS4 distribution system considering momentary interruption</a><br>
      <strong>Supervisor:</strong> <a href="https://scholar.google.com/citations?user=-QIR2lUAAAAJ&hl=en">Dr. A.S. Nazmul Huda</a><br>
      <strong>Publication:</strong> <a href="https://ieeexplore.ieee.org/document/10044904/">Monte Carlo Simulation for Reliability Worth Assessment of Distribution System Considering Momentary Interruptions</a><br>
      <strong>Coursework spanned:</strong> electrical circuits and devices, energy conversion, electromagnetic
      fields and waves, signals and systems, digital electronics, control systems, communication engineering,
      digital signal processing, data communication, microprocessors and interfacing, VLSI design, digital
      communications and wireless LAN fundamentals.
    </p>
  </div>
</div>

## Research Interests

The topics that make me excited to explore, test ideas, and chase answers.

{% include research-interests.html limit=6 %}

[See all research interests and hobbies &rarr;]({{ base_path }}/interests/)

## Technical Skills

<div class="about_card">
  <ul>
    <li class="about_item">
      <strong>🛠️ Programming Languages</strong><br>
      <span>Python · JavaScript · Dart · HTML5 · CSS3 · C · LaTeX · Markdown</span>
    </li>
    <li class="about_item">
      <strong>🤖 AI/ML Frameworks &amp; Libraries</strong><br>
      <span>TensorFlow · PyTorch · Keras · scikit-learn · Hugging Face · OpenAI · Gemini API · LangChain · Fast.AI · Unsloth AI · ONNX</span>
    </li>
    <li class="about_item">
      <strong>📊 Data &amp; Retrieval</strong><br>
      <span>NumPy · Pandas · SciPy · Plotly · OpenCV · Selenium · LanceDB · Faiss</span>
    </li>
    <li class="about_item">
      <strong>🌐 Web &amp; App</strong><br>
      <span>Flask · Flutter · Bootstrap · Streamlit · Gradio</span>
    </li>
    <li class="about_item">
      <strong>🧰 Developer Tools</strong><br>
      <span>Anaconda · Jupyter · Google Colab · Kaggle · Project IDX · VS Code · GitHub · SQLite · OpenRouter</span>
    </li>
    <li class="about_item">
      <strong>☁️ Deployment</strong><br>
      <span>Netlify · Render · Hugging Face Spaces</span>
    </li>
    <li class="about_item">
      <strong>🎨 Other Tools</strong><br>
      <span>Tableau · Overleaf · Figma · Roboflow · LabelBox · Photoshop · Illustrator · Premiere Pro</span>
    </li>
    <li class="about_item">
      <strong>🤝 Soft Skills</strong><br>
      <span>Interpersonal communication · Punctuality · Teamwork · Critical thinking · Time management · Creativity · Problem solving</span>
    </li>
  </ul>
</div>

## Highlights

Workshops run, talks given, and competitions judged &mdash; at a glance.

{% include highlights.html %}

## Testimonials

What colleagues, supervisors and teachers have written about working with me.

{% include testimonials.html %}

## Elsewhere on This Site

- [Publications]({{ base_path }}/publications/) — papers, preprints and theses, with live Google Scholar metrics
- [Projects]({{ base_path }}/projects/) — machine learning, data science and open-source projects
- [Talks & Workshops]({{ base_path }}/talks/) — invited talks, panels and hands-on workshops
- [Teaching]({{ base_path }}/teaching/) — courses designed and delivered, and students supervised
- [Adjudications]({{ base_path }}/adjudications/) — competitions judged and manuscripts reviewed
- [Awards & Achievements]({{ base_path }}/awards/) — competition results, certifications and honours
- [Volunteering]({{ base_path }}/volunteering/) — community service
- [Interests & Hobbies]({{ base_path }}/interests/) — research interests, hobbies and other platforms

## Personal Philosophy

<strong class="philosophy-label">Core belief:</strong> *"Never memorize what you can look up in books."* Einstein's quote is a cornerstone of my
learning philosophy — I remember the process, not the syntax. Even as a daily Pandas user I look things up
as needed rather than overloading my memory with syntax.

<strong class="philosophy-label">Learning style:</strong> A heuristic learner who believes in hands-on experimentation and practical application.

<strong class="philosophy-label">Mission:</strong> Making people's lives easier by developing open-source technologies and advancing Bangla NLP research.
