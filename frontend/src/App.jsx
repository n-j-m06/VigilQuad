import React, { useState, useRef, useEffect } from 'react';
import { ExamProvider, useExam } from './context/ExamContext';
import LiveProctor from './components/LiveProctor';
import { QuadrantPanel } from './components/QuadrantPanel';
import { MatrixBackground } from './components/MatrixBackground';
import DemoCalibration from './components/DemoCalibration';
import { Camera, ShieldCheck, UserCheck, Award } from 'lucide-react';

function ControlHub() {
  const { 
    examStarted,
    setExamStarted,
    token,
    loginUser,
    examEnded,
    scoreMetrics,
    setReferenceFace,
    isFaceVerified,
    setIsFaceVerified,
    triggerWarning,
    warnings,
    logoutUser,
    // NEW
    demoCompleted

} = useExam();

  const [isLoginView, setIsLoginView] = useState(true);
  const [userForm, setUserForm] = useState({ username: '', password: '' });
  const [notify, setNotify] = useState({ text: '', type: '' });

  // Centralized Notification Trigger
  const triggerNotify = (text, type) => {
    setNotify({ text, type });
    
    // Map the string message to the warning type for the context tracker
    let warningType = 'unauthorizedFace'; // Default
    if (text.includes('No face')) warningType = 'faceUndetected';
    if (text.includes('noise')) warningType = 'unwantedSound';
    
    triggerWarning(warningType);
    
    setTimeout(() => setNotify({ text: '', type: '' }), 4000);
  };

  const onboardingVideoRef = useRef(null);
  const [onboardingStream, setOnboardingStream] = useState(null);
  const [verifyingProgress, setVerifyingProgress] = useState(false);

  useEffect(() => {
    if (token && !isFaceVerified) {
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          setOnboardingStream(stream);
          if (onboardingVideoRef.current) onboardingVideoRef.current.srcObject = stream;
        })
        .catch((err) => triggerNotify("Camera access denied.", "warning"));
    }
    return () => { if (onboardingStream) onboardingStream.getTracks().forEach(t => t.stop()); };
  }, [token, isFaceVerified]);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? 'login' : 'register';
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (isLoginView) loginUser(data.username, data.token);
      else { triggerNotify('Vault created successfully!', 'success'); setIsLoginView(true); }
    } catch (err) { triggerNotify(err.message, 'warning'); }
  };

  const captureIdentityFace = () => {
    if (!onboardingVideoRef.current) return;
    setVerifyingProgress(true);
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 480;
    canvas.getContext('2d').drawImage(onboardingVideoRef.current, 0, 0, 640, 480);
    setReferenceFace(canvas.toDataURL('image/jpeg'));
    setTimeout(() => { setIsFaceVerified(true); setVerifyingProgress(false); }, 2000);
  };

  return (
    <>
      {notify.text && (
        <div className={`banner ${notify.type}`} style={{ 
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', 
          zIndex: 999999, pointerEvents: 'none', background: '#ef4444', color: 'white', 
          padding: '10px 20px', borderRadius: '8px'
        }}>
          {notify.text}
        </div>
      )}
      
      {!token ? (
        <div className="auth-viewport-wrapper">
          <MatrixBackground />
          <div className="auth-interactive-card" style={{ padding: '3rem', maxWidth: '420px', width: '100%' }}>
            <h1 style={{ color: '#10b981', textAlign: 'center', fontSize: '2rem' }}>VIGILQUAD</h1>
            <form onSubmit={handleAuthAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Username" onChange={e => setUserForm({...userForm, username: e.target.value})} />
              <input type="password" placeholder="Password" onChange={e => setUserForm({...userForm, password: e.target.value})} />
              <button type="submit" style={{ background: '#10b981', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>
                {isLoginView ? 'INITIATE SESSION' : 'REGISTER VAULT'}
              </button>
              <p
  onClick={() => setIsLoginView(!isLoginView)}
  style={{
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: '1rem',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }}
>
  {isLoginView
    ? 'New user? Register here'
    : 'Already have an account? Login here'}
</p>
            </form>
          </div>
        </div>
      ) : !isFaceVerified ? (
        <div className="auth-viewport-wrapper">
          <MatrixBackground />
          <div className="auth-interactive-card" style={{ padding: '2.5rem', maxWidth: '450px', textAlign: 'center' }}>
            <ShieldCheck style={{ width: '3rem', height: '3rem', color: '#10b981', margin: '0 auto 1rem auto' }} />
            <h2 style={{ color: '#fff' }}>VIGILQUAD: CORE IDENTITY VERIFICATION</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Maintain a neutral expression and remain perfectly still during the calibration process.
            </p>
            <video ref={onboardingVideoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: '12px', transform: 'scaleX(-1)' }} />
            <button onClick={captureIdentityFace} disabled={verifyingProgress} style={{ width: '100%', background: '#10b981', padding: '1rem', marginTop: '1rem', borderRadius: '12px' }}>
              {verifyingProgress ? 'PROCESSING...' : 'CAPTURE IDENTITY'}
            </button>
          </div>
        </div>
      ) : !demoCompleted ? (
  <DemoCalibration triggerNotify={triggerNotify} />
) : !examStarted && !examEnded ? (
        <div className="auth-viewport-wrapper">
          <MatrixBackground />
          <div className="auth-interactive-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <UserCheck style={{ color: '#10b981', width: '4rem', height: '4rem', margin: '0 auto 1rem auto' }} />
            <button onClick={async () => {

  try {

    await fetch(
      'http://localhost:5000/api/exam/start',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setExamStarted(true);

  } catch (err) {

    console.error(err);

  }

}} style={{ background: '#10b981', padding: '1rem', borderRadius: '12px', width: '100%' }}>LAUNCH CORE PROCTOR GRID</button>
          </div>
        </div>
        ) : examEnded ? (
  <div className="auth-viewport-wrapper">
    <div style={{ 
      background: 'rgba(15, 23, 42, 0.9)', 
      padding: '3rem', 
      borderRadius: '24px', 
      textAlign: 'center', 
      width: '400px', 
      border: '1px solid #10b981',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' // This centers everything horizontally
    }}>
      <h2 style={{ color: '#10b981', marginBottom: '1.5rem' }}>SESSION CONCLUDED</h2>
      
      {/* GIF Container */}
      <div style={{ width: '150px', height: '150px', marginBottom: '1rem' }}>
        <img 
          src="/Masha.gif" 
          alt="Result" 
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
        />
      </div>

      <p
  style={{
    color: '#cbd5e1',
    fontSize: '1rem',
    marginTop: '1rem',
    marginBottom: '2rem'
  }}
>
  Your examination session has been successfully submitted.
  Thank you for using VigilQuad.
</p>
     

      
     <button
  onClick={logoutUser}
  style={{
    background: '#10b981',
    padding: '0.8rem 2rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  }}
>
  LOG OUT
</button>
    </div>
  </div>
)
      
       : (
        <>
          <QuadrantPanel />
          <LiveProctor triggerNotify={triggerNotify} />
        </>
      )}
    </>
  );
}

export default function App() { return <ExamProvider><ControlHub /></ExamProvider>; }