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

I am a recent graduate of CSE from Bangladesh University of Engineering and Technology(BUET). I am looking for <b>PhD positions</b> in the field of <b>Algorithms, Natural Language Processing, Computer Vision</b>.

Currently I am working as a **Senior AI Research Engineer** at RoboFication LLC.

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
    <img class="about_card__logo" src="/assets/images/institute_logo/robofication.png" alt="RoboFication Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Senior AI Research Engineer</div>
    <div class="about_card__content__subtitle">RoboFication LLC</div>
    <div class="about_card__content__date"> March 2025 – Present</div>
    <p class="about_card__content__details">
      Working as <b>technical lead</b> in <a href="https://sysmodeler.ai">sysmodeler.ai</a>. Sysmodeler is an AI-powered tool that generates SysML Diagrams from multimodal specifications. It leverages LLMs to
      understand user requirements and automatically create SysML diagrams, streamlining the design process for engineers. 
    </p>
  </div>
</div>

<div class="about_card">
    <img class="about_card__logo" src="/assets/images/institute_logo/open_refactory.png" alt="BUET Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Junior Software Engineer</div>
    <div class="about_card__content__subtitle">OpenRefactory Inc.</div>
    <div class="about_card__content__date">August 2024 – January 2025</div>
    <p class="about_card__content__details">
    <ul>
      <li> Automate compiling and executing code from any github repo using LLM. The system downloads the dependencies and executes the code in a containerized environment without any manual supervision.</li>
      <li>Automate finding and downloading the latest code of a library from GitHub, Bitbucket, etc. This system can find and download the latest or a specific tag for any open source library.</li>
      <li>Automated documentation generator: This tool can analyze codebases and generate documentation.</li>
    </ul>
    </p>
  </div>
</div>

<div class="about_card">
<img class="about_card__logo" src="/assets/images/institute_logo/ankur.png" alt="BUET Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Vice President</div>
    <div class="about_card__content__subtitle">Ankur International Students Chapter</div>
    <div class="about_card__content__date">April 2024 – March 2025</div>
    <p class="about_card__content__details">
      Contributed to the technical and documentation sections of Ankur International. Played an active role in several community projects, including winter clothes distribution, food relief initiatives, flood relief efforts, and post-rehabilitation support.
    </p>
  </div>
</div>

## Education

<div class="about_card">
  <img class="about_card__logo" src="/assets/images/institute_logo/buet.png" alt="BUET Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">B.Sc. in Computer Science and Engineering</div>
    <div class="about_card__content__subtitle">Bangladesh University of Engineering and Technology</div>
    <div class="about_card__content__date">February 2020 – March 2025</div>
    <div class="about_card__content__achievement">CGPA: 3.97/4.00</div>
    <div class="about_card__content__achievement">Awarded Dean's list scholarship in 2nd and 3rd year</div>
  </div>
</div>

<div class="about_card">
  <img class="about_card__logo" src="/assets/images/institute_logo/ccr.jpeg" alt="Rangpur Cadet College Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Higher Secondary Certificate (HSC)</div>
    <div class="about_card__content__subtitle">Rangpur Cadet College</div>
    <div class="about_card__content__date">2019</div>
    <div class="about_card__content__achievement">GPA: 5.00/5.00</div>
    <div class="about_card__content__achievement">Secured 10th position in Rangpur Board</div>
  </div>
</div>

<div class="about_card">
  <img class="about_card__logo" src="/assets/images/institute_logo/ccr.jpeg" alt="Rangpur Cadet College Logo">
  <div class="about_card__content">
    <div class="about_card__content__title">Secondary School Certificate (SSC)</div>
    <div class="about_card__content__subtitle">Rangpur Cadet College</div>
    <div class="about_card__content__date">2017</div>
    <div class="about_card__content__achievement">GPA: 5.00/5.00</div>
    <div class="about_card__content__achievement">Secured 20th position in Rangpur Board</div>
  </div>
</div>

## Technical Skills

<div class="about_card">
  <ul>
    <li class="about_item">
      <strong>🛠️ Programming Languages</strong><br>
      <span>C/C++, x86 Assembly, Python, Java, JavaScript, Bash, SQL</span>
    </li>
    <li class="about_item">
      <strong>📦 Frameworks and Libraries</strong><br>
      <span>PyTorch, Sklearn, Numpy, Pandas, Matplotlib, Seaborn, NextJS, ReactJS, Bison/Flex</span>
    </li>
    <li class="about_item">
      <strong>📚 Tools</strong><br>
      <span>Git, Docker, NS3, xv6, Wireshark</span>
    </li>
  </ul>
</div>
