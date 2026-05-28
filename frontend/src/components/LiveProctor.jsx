import React, { useEffect, useRef } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useExam } from '../context/ExamContext';

const LiveProctor = ({ triggerNotify }) => {

  const {
    examStarted,
    calibrationAverages,
    expectedQuadrant
  } = useExam();

  const baselineSignatures = useRef([]);
  const yawHistory = useRef([]);
const pitchHistory = useRef([]);
  const isBaselineSet = useRef(false);
const quadrantSwitchTime = useRef(Date.now());
  const violationCount = useRef(0);
  const headViolationCount = useRef(0);
  const quadrantViolationFrames = useRef(0);

const lastQuadrantWarningTime = useRef(0);
const lastAudioWarningTime = useRef(0);

const lastFaceWarningTime = useRef(0);

  // =========================
  // FACE SIGNATURE
  // =========================

  const getFaceSignature = (landmarks) => {

    const eyeDist =
      Math.abs(
        landmarks[33].x -
        landmarks[263].x
      );

    const noseToChin =
      Math.abs(
        landmarks[1].y -
        landmarks[152].y
      );

    const faceHeight =
      Math.abs(
        landmarks[10].y -
        landmarks[152].y
      );

    return [
      eyeDist,
      noseToChin,
      faceHeight
    ];
  };

  // =========================
  // QUADRANT DETECTION
  // =========================

  
  // =========================
  // MAIN EFFECT
  // =========================
  useEffect(() => {

  yawHistory.current = [];
  pitchHistory.current = [];

  quadrantViolationFrames.current = 0;

  quadrantSwitchTime.current =
    Date.now();

}, [expectedQuadrant]);
  useEffect(() => {

    if (!examStarted) return;

    let faceLandmarker;
    let audioContext;
    let analyser;
    let stream;

    let isRunning = true;

    const SOUND_THRESHOLD = 0.38;

    async function init() {

      // =========================
      // MEDIAPIPE
      // =========================

      const vision =
        await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

      faceLandmarker =
        await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
            },

            runningMode: "VIDEO",

            numFaces: 2
          }
        );

      // =========================
      // CAMERA + AUDIO
      // =========================

      stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

      const video = document.createElement('video');

video.srcObject = stream;

video.muted = true;

video.autoplay = true;

video.playsInline = true;

video.style.width = '100%';

video.style.height = '100%';

video.style.objectFit = 'cover';

video.style.borderRadius = '12px';

video.style.transform = 'scaleX(-1)';

const anchor = document.getElementById('live-feed-anchor');

if (anchor) {
  anchor.innerHTML = '';
  anchor.appendChild(video);
}

await video.play();
      // =========================
      // AUDIO ANALYSIS
      // =========================

      audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

      const source =
        audioContext.createMediaStreamSource(stream);

      analyser =
        audioContext.createAnalyser();

      analyser.fftSize = 256;

      source.connect(analyser);

      const dataArray =
        new Uint8Array(
          analyser.frequencyBinCount
        );

      // =========================
      // DETECTION LOOP
      // =========================

      const detect = () => {

        if (!isRunning) return;

        if (video.readyState >= 2) {

          // =========================
          // FACE DETECTION
          // =========================

          const faceResults =
            faceLandmarker.detectForVideo(
              video,
              performance.now()
            );

          // =========================
          // AUDIO VOLUME
          // =========================

          analyser.getByteFrequencyData(dataArray);

          let total = 0;

          for (let i = 0; i < dataArray.length; i++) {
            total += dataArray[i];
          }

          const volume =
            total / dataArray.length / 255;

          // =========================
          // WARNING THROTTLE
          // =========================

        

          // =========================
          // NO FACE
          // =========================

          if (
            faceResults.faceLandmarks.length === 0
          ) {

            if (
  Date.now() - lastFaceWarningTime.current >
  3000
) {

  triggerNotify(
    'ATTENTION: No face detected!',
    'unauthorizedFace'
  );

  lastFaceWarningTime.current =
    Date.now();
}
          }

          // =========================
          // MULTIPLE FACES
          // =========================

          else if (
            faceResults.faceLandmarks.length > 1
          ) {

            if (
  Date.now() - lastFaceWarningTime.current >
  3000
) {

  triggerNotify(
    'SECURITY ALERT: Multiple faces!',
    'unauthorizedFace'
  );

  lastFaceWarningTime.current =
    Date.now();
}
          }

          // =========================
          // SINGLE FACE
          // =========================

          else {

            const landmarks =
              faceResults.faceLandmarks[0];

            const liveSig =
              getFaceSignature(landmarks);

            // =========================
            // HEAD DIRECTION
            // =========================

            const nose = landmarks[1];

            
           // =========================
// HEAD ORIENTATION TRACKING
// =========================

const leftEye = landmarks[33];
const rightEye = landmarks[263];

const eyeCenterX =
  (leftEye.x + rightEye.x) / 2;

const eyeCenterY =
  (leftEye.y + rightEye.y) / 2;

// TRUE relative head direction
const yaw =
  (nose.x - eyeCenterX) * 300;

const pitch =
  (nose.y - eyeCenterY) * 300;

yawHistory.current.push(yaw);
pitchHistory.current.push(pitch);

// keep only latest 12 frames
if (yawHistory.current.length > 18) {
  yawHistory.current.shift();
}

if (pitchHistory.current.length > 18) {
  pitchHistory.current.shift();
}

// smoothed averages
const smoothYaw =
  yawHistory.current.reduce(
    (a, b) => a + b,
    0
  ) / yawHistory.current.length;

const smoothPitch =
  pitchHistory.current.reduce(
    (a, b) => a + b,
    0
  ) / pitchHistory.current.length;

let suspicious = false;

// =========================
// DEADZONE FILTER
// =========================

const stableYaw =
  Math.abs(smoothYaw) < 8 ? 0 : smoothYaw;

const stablePitch =
  Math.abs(smoothPitch) < 8 ? 0 : smoothPitch;

// =========================
// TOP RIGHT
// =========================

if (expectedQuadrant === 'topRight') {

  if (
    stableYaw > 0 ||
    stablePitch > 18
  ) {
    suspicious = true;
  }
}

// =========================
// BOTTOM RIGHT
// =========================

else if (
  expectedQuadrant === 'bottomRight'
) {

  if (
  stableYaw > 0 ||
  stablePitch < -14
){
    suspicious = true;
  }
}

// =========================
// BOTTOM LEFT
// =========================

else if (
  expectedQuadrant === 'bottomLeft'
) {

  if (
  stableYaw < 0 ||
  stablePitch < -14
) {
    suspicious = true;
  }
}

// =========================
// FRAME ACCUMULATION
// =========================

// ignore movement immediately after switch
const withinGracePeriod =
  Date.now() -
    quadrantSwitchTime.current <
  2500;

if (!withinGracePeriod) {

  if (suspicious) {

    quadrantViolationFrames.current += 1;

  } else {

    quadrantViolationFrames.current =
      Math.max(
        0,
        quadrantViolationFrames.current - 3
      );
  }
}
            // =========================
            // BASELINE BUILD
            // =========================

            if (!isBaselineSet.current) {

              baselineSignatures.current.push(
                liveSig
              );

              if (
                baselineSignatures.current.length >= 30
              ) {

                isBaselineSet.current = true;
              }
            }

            // =========================
            // LIVE VALIDATION
            // =========================

            else {

              const avgBaseline =
                baselineSignatures.current.reduce(

                  (acc, curr) => [

                    acc[0] + curr[0] / 30,
                    acc[1] + curr[1] / 30,
                    acc[2] + curr[2] / 30

                  ],

                  [0, 0, 0]
                );

              const diff = Math.sqrt(

                Math.pow(
                  liveSig[0] - avgBaseline[0],
                  2
                ) +

                Math.pow(
                  liveSig[1] - avgBaseline[1],
                  2
                ) +

                Math.pow(
                  liveSig[2] - avgBaseline[2],
                  2
                )
              );

              // =========================
              // IDENTITY VALIDATION
              // =========================

              if (diff > 0.15) {

                violationCount.current += 1;

              } else {

                violationCount.current =
                  Math.max(
                    0,
                    violationCount.current - 1
                  );
              }

              // =========================
              // QUADRANT VALIDATION
              // =========================

             
              // =========================
              // IDENTITY WARNING
              // =========================

              if (
  violationCount.current >= 12 &&
  Date.now() - lastFaceWarningTime.current >
    4000
) {

  triggerNotify(
    'SECURITY ALERT: Unauthorized person detected!',
    'unauthorizedFace'
  );

  lastFaceWarningTime.current =
    Date.now();

  violationCount.current = 0;
}

              // =========================
              // HEAD WARNING
              // =========================

             if (
  quadrantViolationFrames.current >= 32 &&
  Date.now() -
    lastQuadrantWarningTime.current >
    3500
) {

  triggerNotify(
    'HEAD ORIENTATION WARNING: Suspicious quadrant deviation!',
    'unauthorizedFace'
  );

  lastQuadrantWarningTime.current =
    Date.now();

  quadrantViolationFrames.current = 0;
}

              // =========================
              // AUDIO WARNING
              // =========================

             if (
  volume > SOUND_THRESHOLD &&
  volume < 0.95 &&
  Date.now() -
    lastAudioWarningTime.current >
    4000
) {

  triggerNotify(
    'AUDIO WARNING: Excessive noise!',
    'unwantedSound'
  );

  lastAudioWarningTime.current =
    Date.now();
}
            }
          }
        }

        requestAnimationFrame(detect);
      };

     setTimeout(() => {
  detect();
}, 500);
    }

    init();

    // =========================
    // CLEANUP
    // =========================

    return () => {

      isRunning = false;

      if (stream) {
        stream
          .getTracks()
          .forEach(track => track.stop());
      }

      if (faceLandmarker) {
        faceLandmarker.close();
      }

      if (audioContext) {
        audioContext.close();
      }

      const video =
        document.querySelector('video');

      if (video) {
        video.remove();
      }
    };

  }, [
    examStarted,
    expectedQuadrant
  ]);

  return null;
};

export default LiveProctor;
