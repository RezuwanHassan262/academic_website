---
title: "Bangla Document Layout Analysis"
excerpt: "A project to analyze the layout of Bengali documents using optical character recognition (OCR)"
collection: portfolio
category: ml
permalink: portfolio/bangla_doc_layout_analysis
description: "**2nd runner-up** in [DL Sprint 2.0 - BUET CSE Fest 2023](https://www.kaggle.com/competitions/dlsprint2)"
slidesurl: 'https://drive.google.com/file/d/1h8QPdTE4O1mIiW4Ot-g8_MUjvX2aucsz/view'
paperurl: 'https://arxiv.org/abs/2308.14397'
---

This project focuses on developing a Bengali layout detection model to identify and classify elements such as paragraphs, text boxes, images, and tables within Bengali documents. The dataset comprises a diverse range of document types, including historical newspapers, contemporary newspapers, books, magazines, Liberation War documents, and more.

To address this challenge, we utilized the **YOLOv8 model**, renowned for its effectiveness in object detection tasks. Key strategies included:  
- **Data Augmentation and Degradation:** To enhance model robustness against variations in document quality.  
- **Model Ensembling:** We combined predictions from an ensemble of five YOLOv8 models to further improve reliability.

Our approach achieved  **Intersection over Union (IoU) score of 0.89637**, earning us the **2nd runner-up position** in the competition.



