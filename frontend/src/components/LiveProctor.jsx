import React, { useEffect, useRef } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useExam } from '../context/ExamContext';

export const LiveProctor = ({ triggerNotify }) => {
  const { examStarted } = useExam();
  const baselineSignatures = useRef([]);
  const isBaselineSet = useRef(false);
  const violationCount = useRef(0); // Tracks consecutive mismatches

  const getFaceSignature = (landmarks) => {
    const eyeDist = Math.abs(landmarks[33].x - landmarks[263].x);
    const noseToChin = Math.abs(landmarks[1].y - landmarks[152].y);
    const faceHeight = Math.abs(landmarks[10].y - landmarks[152].y);
    return [eyeDist, noseToChin, faceHeight];
  };

  useEffect(() => {
    if (!examStarted) return;
    
    let faceLandmarker, audioContext, analyser, stream;
    const SOUND_THRESHOLD = 0.22;
    let isRunning = true;

    async function init() {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task` },
        runningMode: "VIDEO",
        numFaces: 2
      });

      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      video.style.display = 'none';
      document.body.appendChild(video);
      video.play();
      
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detect = () => {
        if (!isRunning) return;
        if (video.readyState >= 2) {
          const faceResults = faceLandmarker.detectForVideo(video, performance.now());
          analyser.getByteFrequencyData(dataArray);
          let total = 0;
          for (let i = 0; i < dataArray.length; i++) total += dataArray[i];
          const volume = total / dataArray.length / 255;

          const now = Date.now();
          const canWarn = !window.lastWarning || now - window.lastWarning > 3000;

          if (faceResults.faceLandmarks.length === 0) {
            if (canWarn) { triggerNotify('ATTENTION: No face detected!', 'unauthorizedFace'); window.lastWarning = now; }
          } else if (faceResults.faceLandmarks.length > 1) {
            if (canWarn) { triggerNotify('SECURITY ALERT: Multiple faces!', 'unauthorizedFace'); window.lastWarning = now; }
          } else {
            const liveSig = getFaceSignature(faceResults.faceLandmarks[0]);
            
            if (!isBaselineSet.current) {
                baselineSignatures.current.push(liveSig);
                if (baselineSignatures.current.length >= 30) isBaselineSet.current = true;
            } else {
                const avgBaseline = baselineSignatures.current.reduce((acc, curr) => 
                    [acc[0] + curr[0]/30, acc[1] + curr[1]/30, acc[2] + curr[2]/30], [0, 0, 0]);
                
                const diff = Math.sqrt(
                    Math.pow(liveSig[0] - avgBaseline[0], 2) + 
                    Math.pow(liveSig[1] - avgBaseline[1], 2) + 
                    Math.pow(liveSig[2] - avgBaseline[2], 2)
                );

                // If diff > 0.14 (the threshold), increment counter. If <, reset.
                if (diff > 0.15) {
                    violationCount.current += 1;
                } else {
                    violationCount.current = Math.max(0, violationCount.current - 1);
                }

                // Trigger ONLY if violation is sustained for 7 consecutive frames
                if (violationCount.current >= 12) {
                    if (canWarn) { 
                        triggerNotify('SECURITY ALERT: Unauthorized person detected!', 'unauthorizedFace'); 
                        window.lastWarning = now;
                        violationCount.current = 0; // Reset after alert
                    }
                } else if (volume > SOUND_THRESHOLD) {
                    if (canWarn) { triggerNotify('AUDIO WARNING: Excessive noise!', 'unwantedSound'); window.lastWarning = now; }
                }
            }
          }
        }
        requestAnimationFrame(detect);
      };
      detect();
    }
    init();

    return () => {
      isRunning = false;
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (faceLandmarker) faceLandmarker.close();
      if (audioContext) audioContext.close();
      const v = document.querySelector('video');
      if (v) v.remove();
    };
  }, [examStarted]);

  return null;
};