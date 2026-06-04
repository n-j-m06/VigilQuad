# 🛰️ VigilQuad Frontend

<p align="center">
  <strong>A modern React-powered surveillance and examination interface for the VigilQuad ecosystem.</strong>
</p>

---

## 📖 Overview

The VigilQuad Frontend serves as the primary user interface for the VigilQuad platform. Designed with responsiveness, performance, and usability in mind, it provides an intuitive environment for candidate onboarding, facial verification, calibration, examination participation, and real-time monitoring workflows.

Built using React and Vite, the application delivers a fast and seamless user experience while maintaining a scalable architecture suitable for future enhancements. The frontend communicates securely with the backend to facilitate authentication, examination management, calibration workflows, telemetry collection, and administrative monitoring.

---

## ✨ Features

* 🎯 Modern and responsive user interface
* ⚡ Fast development and build process with Vite
* 👁️ Real-time surveillance visualization
* 🤖 Integration with AI-powered detection systems
* 📊 Interactive dashboard components
* 🔄 Efficient state management using React Context API
* 📱 Cross-device compatibility
* 🛡️ Designed for secure examination monitoring

### Examination Features

* 🔐 Candidate Login & Registration Workflow
* 🎭 Face Verification Before Examination Access
* 🎯 Three-Stage Quadrant Calibration System
* ⏱️ Dynamic Quadrant Guidance Interface
* 🎥 Automated Calibration Recording Support
* 📝 Interactive Examination Environment
* 🚨 Real-Time Warning Detection Integration
* 📡 Backend Telemetry Communication
* 🎓 Secure Examination Submission Workflow
* 🔒 One-Attempt Examination Enforcement Support

---

## 🛠️ Tech Stack

| Technology                | Purpose                         |
| ------------------------- | ------------------------------- |
| React                     | Frontend Framework              |
| Vite                      | Build Tool & Development Server |
| JavaScript                | Application Logic               |
| CSS                       | Styling & Layout                |
| React Context API         | State Management                |
| MediaPipe Face Landmarker | Facial Landmark Detection       |
| Web APIs                  | Camera & Media Handling         |

---

## 📂 Project Structure

```text
frontend/
│
├── public/
│   └── models/
│       └── AI and Face Detection Models
│
├── src/
│   ├── assets/
│   │   └── Images, Logos and Static Resources
│   │
│   ├── components/
│   │   └── Authentication, Calibration, Monitoring and Exam Components
│   │
│   ├── context/
│   │   └── Global Examination State Management
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

Follow the steps below to set up and run the frontend locally.

### Prerequisites

Ensure that the following software is installed on your system:

* Node.js (Latest LTS Recommended)
* npm (Comes bundled with Node.js)

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

### 2. Navigate to the Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

---

## ▶️ Running the Application

Start the development server using:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

Open the URL in your preferred browser to access the VigilQuad interface.

---

## ⚙️ Build for Production

Generate an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🎨 User Interface

The VigilQuad frontend is designed to provide:

* Clean and intuitive navigation
* Responsive layouts for different screen sizes
* Efficient data presentation
* Smooth user interactions
* Real-time visual feedback

The interface includes dedicated workflows for:

* User Authentication
* Face Verification
* Calibration Guidance
* Examination Participation
* Monitoring Visualization
* Session Management

The dashboard architecture prioritizes usability while maintaining high performance for examination monitoring workflows.

---

## 🧠 AI Integration Support

The frontend is designed to work alongside AI-powered backend services and detection models.

Supported functionalities include:

* Face Detection
* Facial Landmark Tracking
* Head Orientation Monitoring
* Real-Time Monitoring
* Alert Visualization
* Security Event Tracking
* Calibration Sample Collection
* Candidate Verification Workflows

Model files can be found under:

```text
public/models/
```

### Candidate Verification & Calibration

Before examination access is granted, candidates must successfully complete:

#### Face Verification

The system verifies candidate presence and identity before allowing progression into calibration and examination workflows.

#### Quadrant Calibration

The calibration workflow consists of:

1. Top Right Quadrant
2. Bottom Right Quadrant
3. Bottom Left Quadrant

Each quadrant is calibrated for approximately 15 seconds using MediaPipe facial landmark tracking.

During calibration, the frontend:

* Displays dynamic guidance prompts
* Collects yaw and pitch measurements
* Captures calibration samples
* Records calibration evidence
* Builds behavioral reference datasets

Only after successful calibration is the examination interface unlocked.

---

## 📈 Future Enhancements

Planned improvements include:

* Real-time notifications
* Enhanced analytics dashboard
* Multi-camera support
* Advanced visualization tools
* Administrative monitoring interface
* Cloud-based evidence storage
* Advanced behavioral analytics
* Mobile monitoring support
* Enhanced accessibility features
* Cloud deployment integration

---

## 🤝 Contributing

Contributions are welcome and appreciated.

To contribute:

1. Fork the repository

2. Create a feature branch

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
  Built with ❤️ using React, Vite, MediaPipe, React Context API, and modern web technologies.
</p>
