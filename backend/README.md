# 🛡️ VigilQuad Backend

<p align="center">
  <strong>The intelligent backend powering VigilQuad's real-time surveillance, examination management, authentication, and analytics ecosystem.</strong>
</p>

---

## 📖 Overview

The VigilQuad Backend serves as the core engine of the VigilQuad platform, handling authentication, examination workflows, calibration recording storage, telemetry processing, analytics generation, and system intelligence.

Built using Node.js and Express, it provides a scalable and efficient foundation for managing candidate sessions, processing examination submissions, storing monitoring data, and supporting secure communication between frontend services and AI-powered monitoring modules.

The backend is designed to ensure reliability, performance, persistent storage, and seamless integration with future proctoring and monitoring enhancements.

---

## ✨ Features

* 🚀 High-performance REST API architecture
* 🔄 Real-time monitoring and event handling
* 🛡️ Surveillance and proctoring support services
* 📊 Efficient data management using SQLite
* ⚡ Lightweight and scalable Express.js framework
* 🔗 Seamless integration with frontend dashboards
* 📂 Organized and maintainable project structure
* 🤖 Ready for AI and computer vision integrations

### Examination & Authentication Features

* 🔐 JWT-Based Authentication System
* 👤 Candidate Registration & Login APIs
* 🎭 Face Verification Support
* 🎯 Quadrant Calibration Data Processing
* 🎥 Calibration Recording Storage
* 📝 Examination Submission APIs
* 📊 Candidate Analytics Generation
* 🚨 Warning Aggregation & Tracking
* 🔒 One-Attempt Examination Enforcement
* 📂 Persistent Examination Telemetry Storage
* 📡 Administrative Results Retrieval APIs

---

## 🛠️ Tech Stack

| Technology | Purpose                        |
| ---------- | ------------------------------ |
| Node.js    | JavaScript Runtime Environment |
| Express.js | Backend Web Framework          |
| SQLite     | Lightweight Database           |
| Sequelize  | Database ORM                   |
| JWT        | Authentication & Authorization |
| bcryptjs   | Password Hashing               |
| Multer     | Calibration Recording Uploads  |
| JavaScript | Server-side Logic              |
| REST APIs  | Communication Layer            |

---

## 📂 Project Structure

```text
backend/
│
├── calibration-recordings/
│   └── Calibration Evidence Files
│
├── server.js
├── vigilquad.sqlite
├── package.json
├── package-lock.json
└── README.md
```

### Key Files

#### 📌 server.js

The primary entry point of the application responsible for:

* Initializing the Express server
* Configuring middleware
* Managing authentication routes
* Managing examination routes
* Handling calibration uploads
* Processing analytics requests
* Coordinating backend operations

#### 📌 vigilquad.sqlite

The local SQLite database used for:

* Storing candidate accounts
* Managing examination attempts
* Persisting candidate scores
* Storing warning statistics
* Tracking examination telemetry
* Supporting long-term data persistence

#### 📌 calibration-recordings/

Stores calibration evidence generated during the candidate onboarding process.

Each recording is:

* Candidate-linked
* Timestamped
* Stored locally
* Available for future administrative review

---

## 🚀 Getting Started

Follow the instructions below to run the backend locally.

### Prerequisites

Ensure the following software is installed:

* Node.js (Latest LTS Recommended)
* npm (Included with Node.js)

Verify installation:

```bash
node -v
npm -v
```

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Backend Directory

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

---

## ▶️ Running the Server

Start the backend server:

```bash
node server.js
```

The server will launch on the configured port.

Typical development configuration:

```text
http://localhost:5000
```

---

## 🔌 API Responsibilities

The backend is responsible for:

* Candidate Authentication
* JWT Validation
* Examination Session Management
* Calibration Recording Storage
* Candidate Submission Processing
* Warning Aggregation
* Analytics Generation
* Persistent Data Storage
* Administrative Reporting
* Communication with Frontend Services

### Core API Groups

#### Authentication APIs

* Candidate Registration
* Candidate Login
* JWT Token Generation
* Session Validation

#### Examination APIs

* Examination Submission
* Telemetry Processing
* Candidate Attempt Tracking

#### Calibration APIs

* Calibration Recording Upload
* Calibration Evidence Management

#### Administrative APIs

* Examination Results Retrieval
* Candidate Analytics Reporting

---

## 🗄️ Database Management

VigilQuad uses SQLite for lightweight and efficient data storage.

Database file:

```text
vigilquad.sqlite
```

The database stores:

* Candidate Accounts
* Password Hashes
* Examination Attempts
* Final Scores
* Right Answer Counts
* Wrong Answer Counts
* Answer Accuracy Metrics
* Warning Statistics
* Calibration Metrics
* Submission Records

Benefits include:

* Zero Configuration Setup
* Fast Local Development
* Lightweight Deployment
* Reliable Data Persistence
* Persistent Candidate Tracking

---

## 🧠 AI & Monitoring Integration

The backend is designed to support intelligent monitoring systems and computer vision workflows.

Current integrations include:

* Face Verification Support
* Candidate Calibration Processing
* Warning Aggregation
* Examination Telemetry Processing

Supported monitoring workflows include:

* Face Detection Events
* Face Absence Tracking
* Unauthorized Face Detection
* Environmental Audio Monitoring
* Behavioral Calibration Analytics
* Candidate Compliance Tracking

Calibration evidence generated by the frontend can be uploaded and archived for future review.

---

## 📈 Future Enhancements

Planned improvements include:

* Role-Based Access Control
* WebSocket Support for Real-Time Updates
* Cloud Database Integration
* Advanced Event Logging
* Notification Services
* AI-Powered Threat Analysis
* Multi-User Administration
* Cloud-Based Evidence Storage
* Advanced Behavioral Analytics
* Administrative Dashboard APIs

---

## 🔒 Security Considerations

The backend architecture is designed with scalability and security in mind.

Current security implementations include:

* JWT Authentication
* Password Hashing using bcrypt
* Protected API Routes
* Candidate Session Validation
* One-Attempt Examination Enforcement
* Persistent Examination Tracking

Recommended production enhancements:

* Environment Variables for Secrets
* HTTPS Deployment
* Rate Limiting
* Advanced Input Validation
* Audit Logging
* Security Monitoring

---

## 🤝 Contributing

Contributions are welcome and appreciated.

### Contribution Workflow

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is part of the VigilQuad ecosystem and is intended for educational, research, and development purposes.

---

<p align="center">
  Built with ❤️ using Node.js, Express, SQLite, Sequelize, JWT Authentication, Multer, and modern backend technologies.
</p>
