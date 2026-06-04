# 🛡️ VigilQuad

### AI-Powered NEET Examination Proctoring & Monitoring System

<p align="center">
  <strong>Ensuring examination integrity through intelligent surveillance, real-time monitoring, behavioral analysis, and quadrant-based candidate verification.</strong>
</p>

---

## 🚀 Project Overview

VigilQuad is an advanced AI-powered examination proctoring and monitoring platform designed specifically for **NEET and other high-stakes online assessments**.

The system combines computer vision, facial landmark analysis, real-time candidate monitoring, intelligent warning generation, and secure examination workflows to maintain assessment integrity while minimizing false positives.

At its core, VigilQuad introduces an innovative **Quadrant-Based Calibration and Monitoring Framework**, enabling precise behavioral baseline generation before examination commencement. By combining candidate verification, calibration-based gaze orientation tracking, and continuous monitoring, VigilQuad provides a robust ecosystem for secure remote examinations.

---

## ✨ Key Features

* 👁️ Real-time candidate monitoring
* 🤖 AI-powered facial landmark analysis
* 📍 Quadrant-Based Calibration & Monitoring
* 🎭 Face Verification before examination access
* 🎯 Three-stage candidate calibration workflow
* 🎥 Automated calibration session recording
* ⚠️ Intelligent warning generation
* 🚨 Unauthorized face detection
* 👤 Face absence detection
* 🔊 Environmental audio violation detection
* 📊 Administrative analytics and reporting
* 🔐 JWT-based authentication and authorization
* 👨‍🎓 One-attempt examination enforcement
* 🗄️ Persistent SQLite-based telemetry storage
* 📈 Examination performance analytics
* 📂 Calibration evidence archival system
* 🔒 Secure backend infrastructure
* 📋 Administrative result retrieval APIs
* 📈 Scalable architecture for large-scale examinations
* 🎯 Designed specifically for NEET-style assessments

---

## 🔲 The VigilQuad Quadrant System

The name **VigilQuad** originates from its innovative **Quadrant Surveillance Framework**.

During candidate calibration and monitoring, the examination environment is divided into intelligent monitoring zones.

| Quadrant | Monitoring Focus   |
| -------- | ------------------ |
| Q1       | Upper Left Region  |
| Q2       | Upper Right Region |
| Q3       | Lower Left Region  |
| Q4       | Lower Right Region |

This quadrant-based architecture allows the platform to:

* Track candidate movement patterns
* Detect prolonged off-screen behavior
* Identify abnormal gaze deviations
* Improve anomaly detection accuracy
* Reduce false positive alerts
* Generate contextual monitoring evidence
* Establish personalized behavioral baselines

By analyzing movement across multiple monitoring zones, VigilQuad delivers significantly stronger behavioral awareness compared to traditional webcam-based invigilation systems.

---

## 🎯 Candidate Verification & Calibration Pipeline

Before entering the examination environment, every candidate must successfully complete a structured verification process.

### Phase 1 — User Authentication

Candidates authenticate using:

* Secure Registration
* Secure Login
* JWT Token Generation
* Protected Session Management

### Phase 2 — Face Verification

The candidate's face is validated before examination access is granted.

The verification layer:

* Ensures candidate presence
* Prevents unauthorized access
* Establishes candidate identity
* Serves as the first security checkpoint

### Phase 3 — Quadrant Calibration

Candidates are guided through a three-stage calibration workflow.

Calibration Sequence:

1. Top Right Quadrant
2. Bottom Right Quadrant
3. Bottom Left Quadrant

Each quadrant is calibrated for approximately 15 seconds.

During calibration, VigilQuad captures:

* Facial landmarks
* Head orientation
* Yaw measurements
* Pitch measurements
* Timestamped samples
* Calibration snapshots
* Calibration recordings

### Phase 4 — Examination Activation

Only after successful calibration is the examination environment unlocked.

This workflow establishes a behavioral reference model used throughout the assessment.

---

## 🎥 Calibration Evidence Recording

To strengthen transparency and auditability, VigilQuad automatically records calibration sessions.

For every candidate, separate recordings are generated for:

* Top Right Calibration
* Bottom Right Calibration
* Bottom Left Calibration

Each recording is:

* Timestamped
* User-linked
* Stored locally on the backend
* Preserved for administrative review

Example:

```text
calibration-recordings/

rahul_topRight_1749070109123.webm
rahul_bottomRight_1749070122123.webm
rahul_bottomLeft_1749070135123.webm
```

This evidence-driven approach significantly improves examination accountability.

---

## 🏗️ High-Level Architecture

### Frontend

A modern React + Vite interface responsible for:

* User Authentication
* Face Verification
* Candidate Calibration
* Examination Interface
* Warning Visualization
* Session Management
* Examination Navigation

### Backend

A Node.js + Express server responsible for:

* Authentication
* JWT Validation
* Candidate Session Management
* Examination Telemetry Storage
* Analytics Processing
* Calibration Video Storage
* Administrative Result Retrieval
* Persistent Database Operations

### Database

SQLite is used for persistent storage of:

* User Accounts
* Exam Attempts
* Candidate Scores
* Warning Statistics
* Calibration Metrics
* Examination Telemetry

---

## 🔐 Security & Integrity Layers

VigilQuad employs multiple security layers.

### Authentication Layer

* Candidate Registration
* Candidate Login
* JWT Authentication
* Protected Backend Routes

### Verification Layer

* Face Verification
* Candidate Validation
* Calibration Compliance Tracking

### Monitoring Layer

* Face Detection
* Face Absence Detection
* Unauthorized Face Detection
* Environmental Audio Monitoring

### Examination Layer

* Warning Aggregation
* Score Calculation
* Candidate Activity Tracking

### Attempt Protection Layer

* Single Examination Attempt Enforcement
* Persistent Attempt Locking
* Re-login Restriction after Submission

---

## 📊 Examination Analytics Engine

All examination telemetry is processed and stored within the analytics engine.

Captured metrics include:

* Candidate Username
* Final Examination Score
* Right Answer Count
* Wrong Answer Count
* Answer Accuracy Percentage
* Warning Count
* Calibration Sample Counts
* Submission Timestamp

Administrative analytics are available through backend APIs without exposing sensitive information to candidates.

Example Output:

```json
{
  "username": "rahul",
  "finalScore": 266.4,
  "answerAccuracy": "80.00",
  "topRightSamples": 593,
  "bottomRightSamples": 592,
  "bottomLeftSamples": 568,
  "warnings": 4
}
```

---

## 🧠 Core Technologies & Algorithms

### Computer Vision

* MediaPipe Face Landmarker
* Facial Landmark Tracking
* Head Orientation Estimation

### Behavioral Analysis

* Quadrant-Based Calibration
* Yaw Estimation
* Pitch Estimation
* Behavioral Baseline Generation

### Security Mechanisms

* JWT Authentication
* Session Validation
* One-Attempt Enforcement

### Data Processing

* Real-Time Event Aggregation
* Telemetry Storage
* Examination Analytics

---

## 📁 Repository Structure

```text
VigilQuad/

├── backend/
│   ├── calibration-recordings/
│   ├── server.js
│   ├── package.json
│   └── vigilquad.sqlite
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── components/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🛠️ Prerequisites

Before getting started, ensure you have:

* Node.js (Latest LTS Recommended)
* npm
* Modern Browser with Webcam Access
* Microphone Permissions Enabled

---

## 📦 Quick Start

### 1️⃣ Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs on:

```text
http://localhost:5000
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 📡 Administrative APIs

### Retrieve Candidate Analytics

```http
GET /api/admin/results
```

Returns:

* Username
* Final Score
* Accuracy
* Warning Statistics
* Calibration Metrics

---

### Submit Examination Telemetry

```http
POST /api/exam/submit
```

Stores:

* Scores
* Answers
* Warnings
* Analytics Data

---

### Upload Calibration Evidence

```http
POST /api/calibration/upload
```

Stores calibration recordings for future review.

---

## 🎯 Vision

VigilQuad aims to redefine digital examination invigilation by combining artificial intelligence, computer vision, calibration-driven monitoring, and secure examination workflows into a scalable and trustworthy assessment ecosystem.

The long-term vision is to build an intelligent proctoring platform capable of delivering transparent, evidence-driven, and highly secure online examinations at scale.

---

## 🤝 Contributing

Contributions, feature requests, and improvements are welcome.

Feel free to:

* Open Issues
* Submit Pull Requests
* Report Bugs
* Suggest Enhancements

Together we can continue improving the future of secure online assessments.

---

<p align="center">
  Built with ❤️ using React, Vite, Node.js, Express, SQLite, MediaPipe, JWT Authentication, and AI-Powered Computer Vision.
</p>
