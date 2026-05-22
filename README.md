# 🚀 AI-Powered Skill Exchange & Job Application Platform

## 📌 Overview
This is a full-stack web application that enables users to exchange skills and apply for jobs in a single platform. The system is designed with a scalable backend and integrates AI-based resume screening to streamline the hiring process.

The platform supports multiple user roles including job seekers, recruiters, and admins, with secure and role-based access control.

---

## 🛠 Tech Stack

### Backend:
- Django
- Django REST Framework (DRF)
- FastAPI (for specific services)
- Celery & Celery Beat (background tasks)
- RabbitMQ (message broker)

### Frontend:
- React.js
- Redux Toolkit

### Database:
- PostgreSQL
- Redis (caching & pub/sub)

### AI Integration:
- Retrieval-Augmented Generation (RAG)
- LangChain
- FAISS / ChromaDB

### DevOps & Deployment:
- Docker
- AWS (EC2, RDS, S3)
- Nginx
- Gunicorn
- GitHub Actions (CI/CD)

---

## ✨ Features

- 🔐 JWT Authentication & Authorization
- 👥 Role-Based Access Control (RBAC)
- 📄 Job Posting & Application Management
- 🤖 AI-Powered Resume Screening (RAG-based)
- 📊 Candidate Ranking System
- ⚡ Real-time Communication (WebSockets)
- 🔄 Background Task Processing (Celery)
- 📦 Scalable REST API Architecture

---

## 🧠 Key Highlights

- Designed a modular and scalable backend architecture using Django REST Framework
- Implemented AI-based resume filtering to reduce manual screening effort
- Used Redis caching to improve performance and reduce DB load
- Built asynchronous workflows using Celery for notifications and background jobs
- Deployed using Docker and AWS with production-ready configurations

---

## 🏗 Architecture (High-Level)

Client (React) → API Layer (Django/DRF) → Services (FastAPI, Celery Workers)  
→ Database (PostgreSQL) + Cache (Redis) → AI Layer (LangChain + FAISS)

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git](https://github.com/ansil161/skill-swap-platform/new/main
