import React, { createContext, useContext, useState, useEffect } from 'react';

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [examStarted, setExamStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const [isFaceVerified, setIsFaceVerified] = useState(false);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(120 * 60);
  
  const [referenceFace, setReferenceFace] = useState(null);

  const [answers, setAnswers] = useState({});
  // Specific trackers for your 0.25 penalty logic
  const [warnings, setWarnings] = useState({
    unauthorizedFace: 0,
    faceUndetected: 0,
    unwantedSound: 0,
    totalCount: 0,
  });

    // =========================
  // DEMO CALIBRATION STATES
  // =========================

  const [demoCompleted, setDemoCompleted] = useState(false);

  const [quadrantCalibration, setQuadrantCalibration] = useState({
    topRight: [],
    bottomRight: [],
    bottomLeft: []
  });

  const [calibrationAverages, setCalibrationAverages] = useState({
    topRight: null,
    bottomRight: null,
    bottomLeft: null
  });

  const [expectedQuadrant, setExpectedQuadrant] = useState(null);

  useEffect(() => {
    let timer;
    if (examStarted && !examEnded && globalTimeLeft > 0) {
      timer = setInterval(() => {
        setGlobalTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinalSubmission();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examEnded, globalTimeLeft]);

  // Updated triggerWarning: Now uses the 0.25 penalty requirement
  const triggerWarning = (type) => {
    setWarnings((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
      totalCount: prev.totalCount + 1,
    }));
  };

  const calculateLiveScore = () => {
    let right = 0;
    let wrong = 0;
    
    Object.values(answers).forEach((ans) => {
      if (ans.isCorrect) right += 1;
      else wrong += 1;
    });

    const marksFromAnswers = (right * 4) - (wrong * 1);
    const penaltyFromWarnings = warnings.totalCount * 0.10;
    
    // REMOVED Math.max(0, ...) to allow negative scoring
    const totalScore = marksFromAnswers - penaltyFromWarnings;
    
    return {
      finalScore: totalScore, 
      right,
      wrong,
      penalties: penaltyFromWarnings
    };
  };

  const handleFinalSubmission = async () => {
    setExamEnded(true);
    const metrics = calculateLiveScore();

    try {
      await fetch('http://localhost:5000/api/exam/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rightAnswers: metrics.right,
          wrongAnswers: metrics.wrong,
          warningsCount: warnings, // Sent full object
          finalScore: metrics.finalScore
        })
      });
    } catch (err) {
      console.error('Error submitting payload telemetry:', err);
    }
  };

  const loginUser = (user, jwtToken) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('username', user);
    setToken(jwtToken);
    setUsername(user);
  };

  const logoutUser = () => {
    localStorage.clear();
    setToken('');
    setUsername('');
    setExamStarted(false);
    setExamEnded(false);
    setReferenceFace(null);
    setIsFaceVerified(false);
    setAnswers({});
    setWarnings({ unauthorizedFace: 0, faceUndetected: 0, unwantedSound: 0, totalCount: 0 });
        setDemoCompleted(false);

    setQuadrantCalibration({
      topRight: [],
      bottomRight: [],
      bottomLeft: []
    });

    setCalibrationAverages({
      topRight: null,
      bottomRight: null,
      bottomLeft: null
    });

    setExpectedQuadrant(null);
  };

  return (
    <ExamContext.Provider
      value={{
        username, token, loginUser, logoutUser,
        examStarted, setExamStarted,
        examEnded, handleFinalSubmission,
        globalTimeLeft, warnings, triggerWarning,
        answers, setAnswers,
        referenceFace, setReferenceFace,
        isFaceVerified, setIsFaceVerified,
        scoreMetrics: calculateLiveScore(),
                demoCompleted,
        setDemoCompleted,

        quadrantCalibration,
        setQuadrantCalibration,

        calibrationAverages,
        setCalibrationAverages,

        expectedQuadrant,
        setExpectedQuadrant,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);