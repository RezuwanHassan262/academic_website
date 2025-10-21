---
permalink: /
title: "About Me"
author_profile: true
# header:
#   overlay_color: "#333"
redirect_from:
  - /about/
  - /about.html
toc: true
---

**Full Name:** Md. Rezuwan Hassan  
**Professional Title:** Artificial Intelligence (AI) Engineer & Research Scientist  
**Nationality:** Bangladeshi 🇧🇩  
**Current Location:** Dhaka, Bangladesh  

**Contact Information:**
- **Primary Email:** rezwanhasan262@gmail.com
- **Personal Website:** https://www.rezuwan.me

**Professional & Academic Links:**
- **Google Scholar Profile:** https://scholar.google.com/citations?user=ZUrWZhQAAAAJ&hl=en
- **ResearchGate Profile:** https://www.researchgate.net/profile/Md-Hassan-82
- **GitHub Profile:** https://github.com/RezuwanHassan262
- **HuggingFace Profile:** https://huggingface.co/Rezuwan
- **Kaggle Profile:** https://www.kaggle.com/mdrezuwanhassan
- **LinkedIn Profile:** https://www.linkedin.com/in/md-rezuwan-hassan/

**Core Identity:** Engineer | Researcher | Artist | Geek | Learner | Human | Believer | Bengali 🇧🇩
**Personal Motto:** "An artistic soul with a passion for AI"

## Professional Summary

A curious mind and heuristic learner with an insatiable appetite for exploring and experimenting with cutting-edge technologies. Dedicated to leveraging technical expertise and creative thinking to develop open-source technologies that make general people's lives easier. Particularly passionate about advancing Bengali Natural Language Processing research and preserving the linguistic heritage of Bangladesh through technological innovation.

## Publications

{% for post in site.publications reversed %}

  <div >
    <div >
      <div ><b>{{ post.title }}</b></div>
      <div ><small>{{ post.venue }} | {{ post.date | date: "%B %d, %Y" }} | <a href="{{ post.paperurl }}">Paper</a> {% if post.slidesurl %} | <a href="{{ post.slidesurl }}">Slides</a>{% endif %}</small></div>
      <div ><small>{{ post.authors | markdownify }}</small></div>
    </div>
  </div>
  {% endfor %}

## Work Experience

<div class="about_card">
    <img class="about_card__logo" src="/images/robofication.png" alt="RoboFication Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Artificial Intelligence (AI) Engineer</div>
    <div class="about_card__content__subtitle">RoboFication LLC</div>
    <div class="about_card__content__date">July 2025 – Present</div>
    <p class="about_card__content__details">
      <strong>Company:</strong> RoboFication LLC (Canton, Michigan, United States - Remote)<br>
      <strong>Focus:</strong> Leading development of AI-driven automation solutions for mission-critical industries<br>
      <strong>Responsibilities:</strong>
      <ul>
        <li>Design and implement natural language processing capabilities for engineering documentation</li>
        <li>Architect and develop automated workflow systems to minimize repetitive engineering tasks</li>
        <li>Research and implement advanced AI techniques to enhance existing automation platforms</li>
        <li>Contribute to AI-powered tools that ensure regulatory compliance in high-stakes industries</li>
      </ul>
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/images/brac_university.png" alt="BRAC University Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Research Engineer</div>
    <div class="about_card__content__subtitle">BRAC University</div>
    <div class="about_card__content__date">February 2024 – September 2025</div>
    <p class="about_card__content__details">
      <strong>Department:</strong> Computer Science & Engineering<br>
      <strong>Focus:</strong> Bengali Natural Language Processing & Speech Technologies<br>
      <strong>Key Projects:</strong>
      <ul>
        <li>Bengali Speech Recognition with Regional Dialects (Project Lead)</li>
        <li>AI-Driven Agentic Agriculture Support System for Bangladeshi Farmers</li>
        <li>Bengali Humor and Cultural Roots Analysis with Agentic AI</li>
        <li>Multiple Bengali Text-to-Speech (TTS) Implementation Projects</li>
      </ul>
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/images/lead_academy.png" alt="Lead Academy Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Instructor</div>
    <div class="about_card__content__subtitle">Lead Academy</div>
    <div class="about_card__content__date">October 2023 – December 2023</div>
    <p class="about_card__content__details">
      <strong>Course Created:</strong> "Natural Language Processing (NLP) for Beginners using Python"<br>
      <strong>Link:</strong> <a href="https://lead.academy/course/natural-language-processing-nlp-for-beginners-online-course">Course Link</a><br>
      Designed and developed comprehensive NLP course covering all relevant topics from basics to deep learning models and large language models, with practical Python demonstrations.
    </p>
  </div>
</div>

## Education

<div class="about_card">
  <img class="about_card__logo" src="/images/brac_university.png" alt="BRAC University Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Master of Science (M.Sc) in Computer Science Engineering</div>
    <div class="about_card__content__subtitle">BRAC University</div>
    <div class="about_card__content__date">2021 – 2023</div>
    <div class="about_card__content__achievement">Specialization: Natural Language Processing & Speech Recognition Technologies</div>
    <div class="about_card__content__achievement">Multiple merit-based scholarship recipients (100% tuition fee waivers)</div>
    <p class="about_card__content__details">
      <strong>Master's Thesis:</strong> "A character gram modeling approach towards Bengali Speech to Text with Regional Dialects"<br>
      <strong>Supervisor:</strong> Dr. Golam Rabiul Alam<br>
      <strong>Repository:</strong> <a href="https://dspace.bracu.ac.bd/xmlui/handle/10361/25982">Thesis Link</a>
    </p>
  </div>
</div>

<div class="about_card">
  <img class="about_card__logo" src="/images/brac_university.png" alt="BRAC University Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Bachelor of Science (B.Sc) in Electrical and Electronics Engineering</div>
    <div class="about_card__content__subtitle">BRAC University</div>
    <div class="about_card__content__date">2016 – 2020</div>
    <div class="about_card__content__achievement">Specialization: Networking, Signal Processing & Wireless Technologies</div>
    <div class="about_card__content__achievement">Vice Chancellor's List (Spring 2020) - GPA: 4.00/4.00</div>
    <p class="about_card__content__details">
      <strong>Bachelor's Thesis:</strong> "Efficient approach for reliability evaluation of the BUS4 distribution system considering momentary interruption"<br>
      <strong>Supervisor:</strong> Dr. A.S. Nazmul Huda<br>
      <strong>Repository:</strong> <a href="https://dspace.bracu.ac.bd/xmlui/handle/10361/14487">Thesis Link</a>
    </p>
  </div>
</div>

## Major Achievements & Awards

### 🏆 Runners up - National AI Hackathon (May 2025)
**Issued by:** Bangladesh Innovation Conclave  
**Team:** AgriBRACUion  
**Project:** AgriBuddy - AI-powered agentic support system for Bangladeshi farmers

### 🌟 Contributed to a Google Project (December 2023)
Selected team member for Google collaboration with Bengali.AI for Bengali language research project.

### 🎯 Invitee – Google Foo Bar Challenge (July 2023)
Invited to Google's secret recruitment program while coding and searching for Lambda function syntax.

### 📸 Winner - Photography Contest (July 2023)
**Issued by:** Fotoboss  
**Theme:** "All about Green"

## Volunteering & Community Service

### AI/ML Researcher | Assistant Co-ordinator
**Organization:** Bengali.AI  
**Duration:** Ongoing  
**Role:** Leading speech projects and working with audio data for Bengali language research

### Blood Donor
**Organization:** Quantum Foundation  
**Frequency:** Every 4 months  
**Duration:** February 2021 - Present

## Research Interests

1. **Computational Cognitive Science** - Understanding human cognition through computational models and AI
2. **Human-Computer Interaction** - Designing intuitive interfaces and user experiences
3. **Computational Social Science** - Understanding social behavior through computational models
4. **Natural Language Processing** - Enabling machines to understand and respond to human language
5. **Generative AI** - Creating new content and ideas through AI
6. **Federated Learning** - Distributed machine learning with privacy preservation
7. **Meta-Learning** - Learning to learn and few-shot learning approaches
8. **Reinforcement Learning** - AI agents learning through interaction and feedback
9. **Healthcare/Medical AI** - AI applications in healthcare and medical diagnosis

## Technical Skills

<div class="about_card">
  <ul>
    <li class="about_item">
      <strong>🛠️ Programming Languages</strong><br>
      <span>Python, JavaScript/TypeScript, Dart, HTML5, CSS3, C Programming, LaTeX, Markdown</span>
    </li>
    <li class="about_item">
      <strong>🤖 AI/ML Frameworks</strong><br>
      <span>TensorFlow, PyTorch, Keras, Scikit-learn, Hugging Face Transformers, OpenAI API, Langchain, Fast.AI</span>
    </li>
    <li class="about_item">
      <strong>📊 Data Science</strong><br>
      <span>NumPy, Pandas, SciPy, Plotly, OpenCV, Selenium</span>
    </li>
    <li class="about_item">
      <strong>🌐 Web Technologies</strong><br>
      <span>React, Next.js, Node.js, Flask, Streamlit, Gradio, Bootstrap</span>
    </li>
    <li class="about_item">
      <strong>� Development Tools</strong><br>
      <span>Git, GitHub, Anaconda, Jupyter Notebooks, Google Colab, Project IDX, Visual Studio Code</span>
    </li>
    <li class="about_item">
      <strong>☁️ Cloud & Deployment</strong><br>
      <span>Netlify, Render, Vercel, HuggingFace Spaces, Kaggle</span>
    </li>
    <li class="about_item">
      <strong>🎨 Creative Tools</strong><br>
      <span>Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro, Figma</span>
    </li>
  </ul>
</div>

## Personal Philosophy & Learning Approach

**Core Belief:** "Never memorize what you can look up in books" (Einstein's quote) - Focuses on understanding processes rather than memorizing syntax.

**Learning Style:** Heuristic learner who believes in hands-on experimentation and practical application.

**Mission:** Dedicated to making general people's lives easier by developing open-source technologies and contributing to advancing Bangla NLP research.

**Vision:** Combining passion, dedication, and hard work to achieve impactful results by contributing to meaningful initiatives while building expertise.
