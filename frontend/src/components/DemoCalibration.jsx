import React, { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { MatrixBackground } from './MatrixBackground';
import { useExam } from '../context/ExamContext';
import { QuadrantPanel } from './QuadrantPanel';
import '../index.css';

const calibrationSequence = [
  {
    key: 'topRight',
    label: 'TOP RIGHT QUADRANT'
  },
  {
    key: 'bottomRight',
    label: 'BOTTOM RIGHT QUADRANT'
  },
  {
    key: 'bottomLeft',
    label: 'BOTTOM LEFT QUADRANT'
  }
];

export default function DemoCalibration({ triggerNotify }) {

  const {
    setDemoCompleted,

    quadrantCalibration,
    setQuadrantCalibration,

    setCalibrationAverages

  } = useExam();

  const videoRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(15);

  const currentQuadrant =
    calibrationSequence[currentStep];

  // =========================
  // CAMERA INIT
  // =========================

  useEffect(() => {

    let stream;

    async function initCamera() {

      try {

        stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              width: 640,
              height: 480
            }
          });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        initializeTracking();

      } catch (err) {

        if (triggerNotify) {
          triggerNotify(
            'Camera access denied',
            'warning'
          );
        }
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };

  }, []);

  // =========================
  // SPEECH GUIDANCE
  // =========================

  useEffect(() => {

    const text =
      `Please look towards the ${currentQuadrant.label}`;

    const utterance =
      new SpeechSynthesisUtterance(text);

    speechSynthesis.speak(utterance);

  }, [currentStep]);

  // =========================
  // TIMER
  // =========================

  useEffect(() => {

    const interval = setInterval(() => {

      setTimer(prev => prev - 1);

    }, 1000);

    return () => clearInterval(interval);

  }, [currentStep]);

  useEffect(() => {

    if (timer <= 0) {

      moveNextStep();

    }

  }, [timer]);

  const moveNextStep = () => {

    if (
      currentStep <
      calibrationSequence.length - 1
    ) {

      setCurrentStep(prev => prev + 1);

      setTimer(15);

    } else {

      finalizeCalibration();
    }
  };

  // =========================
  // FACELANDMARKER
  // =========================

  const initializeTracking = async () => {

    const vision =
      await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

    const faceLandmarker =
      await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
          },
          runningMode: "VIDEO",
          numFaces: 1
        }
      );

    const detect = async () => {

      if (!videoRef.current) return;

      if (videoRef.current.readyState >= 2) {

        const results =
          faceLandmarker.detectForVideo(
            videoRef.current,
            performance.now()
          );

        if (
          results.faceLandmarks &&
          results.faceLandmarks.length > 0
        ) {

          const landmarks =
            results.faceLandmarks[0];

          const nose = landmarks[1];

          // =========================
          // HEAD ORIENTATION
          // =========================

          const yaw =
            (nose.x - 0.5) * 100;

          const pitch =
            (nose.y - 0.5) * 100;

         const canvas =
  document.createElement('canvas');

canvas.width = videoRef.current.videoWidth;
canvas.height = videoRef.current.videoHeight;

const ctx = canvas.getContext('2d');

ctx.drawImage(
  videoRef.current,
  0,
  0
);

const snapshot =
  canvas.toDataURL('image/jpeg', 0.6);

const sample = {

  yaw,
  pitch,

  snapshot,

  quadrant: currentQuadrant.key,

  timestamp: Date.now()
};

          // =========================
          // STORE CALIBRATION
          // =========================

          setQuadrantCalibration(prev => ({

            ...prev,

            [currentQuadrant.key]: [

              ...prev[currentQuadrant.key],

              sample

            ]

          }));
        }
      }

      requestAnimationFrame(detect);
    };

    detect();
  };

  // =========================
  // CALCULATE AVERAGES
  // =========================

  const calculateAverage = (samples) => {

    if (!samples.length) return null;

    const avgYaw =
      samples.reduce(
        (sum, item) => sum + item.yaw,
        0
      ) / samples.length;

    const avgPitch =
      samples.reduce(
        (sum, item) => sum + item.pitch,
        0
      ) / samples.length;

    return {
      yaw: avgYaw,
      pitch: avgPitch
    };
  };

  // =========================
  // FINALIZE
  // =========================

  const finalizeCalibration = () => {

    const averages = {

      topRight:
        calculateAverage(
          quadrantCalibration.topRight
        ),

      bottomRight:
        calculateAverage(
          quadrantCalibration.bottomRight
        ),

      bottomLeft:
        calculateAverage(
          quadrantCalibration.bottomLeft
        )
    };

    setCalibrationAverages(averages);

    setDemoCompleted(true);
  };

return (

 <div
  style={{
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    background: '#020617'
  }}
>

    

    {/* ========================= */}
    {/* TOP CALIBRATION HUD */}
    {/* ========================= */}

    <div
      style={{

        position: 'fixed',

        top: '20px',
        left: '50%',

        transform: 'translateX(-50%)',

        zIndex: 9999,

        background: 'rgba(15, 23, 42, 0.92)',

        border: '1px solid #10b981',

        padding: '14px 28px',

        borderRadius: '16px',

        backdropFilter: 'blur(10px)',

        textAlign: 'center',

        boxShadow: '0 0 25px rgba(16,185,129,0.35)'
      }}
    >

      <h2
        style={{
          color: '#10b981',
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}
      >
        CALIBRATION SESSION
      </h2>

      <p
        style={{
          color: '#cbd5e1',
          marginTop: '6px',
          marginBottom: '6px',
          fontSize: '0.9rem'
        }}
      >
        Look towards:
        {' '}
        <span
          style={{
            color: '#f59e0b',
            fontWeight: 'bold'
          }}
        >
          {currentQuadrant.label}
        </span>
      </p>

      <div
        style={{
          color: '#10b981',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}
      >
        {timer}s
      </div>

    </div>

    {/* ========================= */}
    {/* REAL QUADRANT PANEL */}
    {/* ========================= */}

   <div
  style={{
    position: 'fixed',
    inset: 0,
    zIndex: 1
  }}
>
 <QuadrantPanel
  demoMode={true}
  activeDemoQuadrant={currentQuadrant.key}
  calibrationVideoRef={videoRef}
/>
</div>

    {/* ========================= */}
    {/* CAMERA OVERLAY */}
    {/* ========================= */}

   

  </div>
);
}