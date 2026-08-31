---
title: "Psychosis Classification Using rsfMRI"
excerpt: "Differentiates between schizophrenia (SZ) and
bipolar psychosis (BPP) using resting-state functional magnetic resonance imaging
(rsfMRI)"
collection: portfolio
category: ml
permalink: portfolio/psychosis_classification/
description: "**1st runner-up** in [IEEE Signal Processing Cup 2023](https://signalprocessingsociety.org/community-involvement/ieee-signal-processing-cup-2023)"
slidesurl: 'https://drive.google.com/file/d/1glOLMpwWBiZPvAgVDFciWAIJgBOpX4Ew/view'
---

![Model Pipeline](/assets/images/portfolio/psychosis_classification-model.png)

Resting-state functional MRI (rsf-MRI) detects spontaneous activity patterns in brain regions, offering valuable clinical and cognitive biomarkers for psychosis classification. It can help identify whether a patient has **Schizophrenia (SZ)** or **Bipolar Psychosis Disorder (BP)**. Our task was to classify between SZ and BP using the Functional Network Connectivity (FNC) of brain regions derived from rsf-MRI data.

### Challenges:
- **Low Sample Size:** The dataset contained only 742 samples.
- **High Dimensionality:** Each sample had 5,460 features.
- **Class Imbalance:** The dataset had 284 BP samples and 458 SZ samples, with an SZ:BP ratio of 3:5.

### Approach:
1. **Support Vector Machine (SVM):**  
   - We selected SVM with appropriate hyperparameters for its robustness in handling high-dimensional data.
   - To mitigate overfitting, we employed **5-fold cross-validation**.
   - We used rbf kernel, C=10 and gamma=0.01 as hyperparameters.
2. **Absolute Values (Abs):** 
  - Since the data represents correlations between brain regions, capturing the relationship between two regions is essential. To achieve this, we take the absolute value of each feature, emphasizing the strength of the connection regardless of its direction.

3. **Feature Selection:**  
   - **ANOVA test** was used to identify statistically significant features, reducing the feature set to 20% of the original dimensions.

4. **Addressing Class Imbalance:**  
   - We applied the **TOMEK link method** to undersample the majority class (SZ), ensuring a balanced class distribution.

5. **Random Seed Dependency:**  
   - Model efficiency was found to vary with the initialization seed. To address this, we trained **five different models** with random seeds and averaged their results to improve prediction reliability.

This pipeline allowed us to tackle the challenges of limited data, high dimensionality, and class imbalance. The pipeline achieved score of .65 which achieved 1st runners-up position in IEEE Signal Processing Cup 2023.


