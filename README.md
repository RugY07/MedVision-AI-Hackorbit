🧠 MedVision – AI Diagnostic Web Platform for Medical Scans

MedVision is an AI-powered medical diagnostic web application that allows users to upload real medical scans—such as **chest X-rays**, **brain MRIs**, **bone X-rays**, and **cardiac MRIs**—to receive automated, accurate diagnoses powered by pretrained deep learning models.

## 🔬 Supported Scans & Models

| Scan Type     | Model Used                                        | Diagnosis/Output                                               |
|---------------|---------------------------------------------------|----------------------------------------------------------------|
| Chest X-ray   | CheXNet (DenseNet-121)                            | Multi-label detection (e.g. pneumonia, cardiomegaly, effusion) |
| Brain MRI     | masoudnickparvar/brain-tumor-mri-dataset          | Tumor classification: Glioma, Meningioma, Pituitary, or None   |
| Bone X-ray    | bmadushanirodrigo/fracture-multi-region-x-ray-data| Fracture and musculoskeletal abnormality detection             |
| Cardiac MRI   | andrewmvd/cardiac-mri-segmentation                | Left/right ventricle + myocardium segmentation (mask output)   |


🌐 Features

- 📷 Upload scan images in real-time
- 🤖 AI diagnosis using pretrained models (no random or mock data)
- 💡 Grad-CAM visualization for interpretability (Chest X-rays)
- 🧠 Tumor classification from MRI
- 🧩 Organ segmentation from cardiac MRI
- 📱 Modern frontend with React, Tailwind CSS, and dark neon theme
- 🔐 Fully self-hosted backend using Flask (no external APIs required)

---
