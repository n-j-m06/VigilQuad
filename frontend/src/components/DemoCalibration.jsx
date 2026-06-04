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

  username,
  token,

  setDemoCompleted,

  quadrantCalibration,
  setQuadrantCalibration,

  setCalibrationAverages

} = useExam();
  const videoRef = useRef(null);
  const mediaRecorderRef =
  useRef(null);

const recordedChunksRef =
  useRef([]);

  const [currentStep, setCurrentStep] = useState(0);
  const currentQuadrantRef = useRef('topRight');
  const [timer, setTimer] = useState(15);

  const currentQuadrant =
    calibrationSequence[currentStep];
  useEffect(() => {

  currentQuadrantRef.current =
    currentQuadrant.key;

}, [currentQuadrant]);
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
          const recorder =
  new MediaRecorder(stream);

mediaRecorderRef.current =
  recorder;

recordedChunksRef.current =
  [];

recorder.ondataavailable =
  (event) => {

    if (
      event.data &&
      event.data.size > 0
    ) {

      recordedChunksRef.current.push(
        event.data
      );

    }

  };

recorder.start();
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
  const uploadQuadrantRecording =
  async (quadrantKey) => {

    const blob =
      new Blob(
        recordedChunksRef.current,
        {
          type: 'video/webm'
        }
      );

    const formData =
      new FormData();

    formData.append(
      'video',
      blob,
      `${quadrantKey}.webm`
    );

    formData.append(
      'quadrant',
      quadrantKey
    );

    try {

      await fetch(
        'http://localhost:5000/api/calibration/upload',
        {
          method: 'POST',

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: formData
        }
      );

    } catch (err) {

      console.error(err);

    }

};

  const moveNextStep = async () => {

  if (mediaRecorderRef.current) {

    mediaRecorderRef.current.stop();

    await new Promise(resolve => {

      mediaRecorderRef.current.onstop =
        async () => {

          await uploadQuadrantRecording(
            currentQuadrant.key
          );

          resolve();

        };

    });

  }

  if (
    currentStep <
    calibrationSequence.length - 1
  ) {

    recordedChunksRef.current = [];

    const recorder =
      new MediaRecorder(
        videoRef.current.srcObject
      );

    mediaRecorderRef.current =
      recorder;

    recorder.ondataavailable =
      (event) => {

        if (
          event.data &&
          event.data.size > 0
        ) {

          recordedChunksRef.current.push(
            event.data
          );

        }

      };

    recorder.start();

    setCurrentStep(
      prev => prev + 1
    );

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

 quadrant: currentQuadrantRef.current,

  timestamp: Date.now()
};

          // =========================
          // STORE CALIBRATION
          // =========================

          setQuadrantCalibration(prev => ({

            ...prev,

            [currentQuadrantRef.current]: [

  ...prev[currentQuadrantRef.current],

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

   
setCalibrationAverages(
  averages
);

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
<div style={{ position: 'relative', width: '100%', height: '100%' }}>

  <QuadrantPanel
    demoMode={true}
    activeDemoQuadrant={currentQuadrant.key}
    calibrationVideoRef={videoRef}
  />

  {/* QUADRANT TIMER */}
  {/* ACTIVE QUADRANT CALIBRATION OVERLAY */}

<div
  style={{
    position: 'absolute',

    top:
      currentQuadrant.key === 'topRight'
        ? '25%'
        : currentQuadrant.key === 'bottomRight'
        ? '75%'
        : '75%',

    left:
      currentQuadrant.key === 'topRight'
        ? '75%'
        : currentQuadrant.key === 'bottomRight'
        ? '75%'
        : '25%',

    transform: 'translate(-50%, -50%)',

    zIndex: 99999,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',

    pointerEvents: 'none'
  }}
>

  <div
    style={{
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '1rem',
      letterSpacing: '1px',
      textAlign: 'center',
      textShadow: '0 0 12px rgba(255,255,255,0.4)'
    }}
  >
    LOOK TOWARDS
  </div>

  <div
    style={{
      color: '#f59e0b',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      textAlign: 'center',
      maxWidth: '220px',
      lineHeight: '1.3'
    }}
  >
    {currentQuadrant.label}
  </div>

  <div
    style={{
      position: 'relative',
      width: '110px',
      height: '110px'
    }}
  >

    <svg
      width="110"
      height="110"
      style={{
        transform: 'rotate(-90deg)'
      }}
    >

      <circle
        cx="55"
        cy="55"
        r="48"
        stroke="rgba(16,185,129,0.15)"
        strokeWidth="8"
        fill="none"
      />

      <circle
        cx="55"
        cy="55"
        r="48"
        stroke="#10b981"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={301.6}
        strokeDashoffset={
          301.6 *
          (1 - timer / 15)
        }
      />

    </svg>

    <div
      style={{
        position: 'absolute',
        inset: 0,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        color: '#10b981',

        fontSize: '2rem',
        fontWeight: 'bold'
      }}
    >
      {timer}
    </div>

  </div>

</div>

    {/* ========================= */}
   {/* CAMERA OVERLAY */}

</div>

</div>

</div>

);
}