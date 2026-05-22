import React, { useEffect, useRef } from 'react';

export const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas seamlessly to fit full browser viewport
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Matrix configuration bits
    const alphabets = "0101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const rainDrops = Array(columns).fill(1);

    const draw = () => {
      // Clear with trailing alpha layer to create smooth glowing fade lines
      ctx.fillStyle = 'rgba(2, 6, 23, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981'; // Cyber Emerald green
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabets.charAt(Math.floor(Math.random() * alphabets.length));
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset string lines back to top randomly once they hit the lower border threshold
        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 33); // Enforce continuous stable 30FPS loops

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-live-canvas" />;
};