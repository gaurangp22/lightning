import React, { useState, useRef } from 'react';
import { removeBackground } from '@imgly/background-removal';
import warp from '/warp.jpg';

// A simple hook to detect when the button is hovered
const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
  return [isHovered, hoverProps];
};

const ShiningPfpGenerator = () => {
  const [foregroundFile, setForegroundFile] = useState(null);
  const [generatedPfp, setGeneratedPfp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const [isHovered, hoverProps] = useHover();

  // UPDATED: Using the new background image you provided
  const shiningLightBackground = warp;

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForegroundFile(e.target.files[0]);
      setGeneratedPfp(null);
    }
  };

  const generatePfp = async () => {
    if (!foregroundFile) {
      alert('Please select an image first!');
      return;
    }

    setIsLoading(true);

    try {
      // Remove the background from the user's image using the free library
      const imageBlob = await removeBackground(foregroundFile);
      const removedBgImageUrl = URL.createObjectURL(imageBlob);

      // Draw the final PFP on the canvas
      drawCanvas(removedBgImageUrl);

    } catch (error) {
      console.error('Failed to remove background:', error);
      alert('Could not process the image. Please try another one.');
    } finally {
      setIsLoading(false);
    }
  };

  const drawCanvas = (foregroundSrc) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasSize = 512;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const bg = new Image();
    bg.crossOrigin = 'Anonymous';
    bg.src = shiningLightBackground;

    bg.onload = () => {
      // Draw the shining light background
      ctx.drawImage(bg, 0, 0, canvasSize, canvasSize);
      
      const fg = new Image();
      fg.crossOrigin = 'Anonymous';
      fg.src = foregroundSrc;
      
      fg.onload = () => {
        // Draw the user's image (with background removed) on top
        ctx.drawImage(fg, 0, 0, canvasSize, canvasSize);
        setGeneratedPfp(canvas.toDataURL('image/png'));
      };
    };
  };

  const buttonStyle = {
    ...styles.button,
    ...(isHovered ? styles.buttonHover : {}),
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Warp Speed PFP Generator</h1>
      <p style={styles.instructions}>Create a profile picture with a dynamic light effect.</p>

      <div style={styles.controls}>
        <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />
        <button onClick={generatePfp} disabled={isLoading} style={buttonStyle} {...hoverProps}>
          {isLoading ? 'Processing...' : 'Generate PFP'}
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {generatedPfp && !isLoading && (
        <div style={styles.resultContainer}>
          <h2 style={styles.previewTitle}>Your PFP is Ready</h2>
          <img src={generatedPfp} alt="Generated Profile Picture" style={styles.pfpPreview} />
          <a href={generatedPfp} download="shining-pfp.png" style={styles.downloadLink}>
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

// UPDATED: Styles adjusted to match the new blue background
const styles = {
  container: {
    backgroundColor: '#1A1A1D',
    color: '#FFFFFF',
    padding: '48px',
    borderRadius: '16px',
    maxWidth: '450px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    border: '1px solid #4B4B4B',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '2rem',
    fontWeight: '700',
    color: '#00AFFF', // A strong blue accent color
  },
  instructions: {
    margin: '0 0 32px 0',
    fontSize: '1rem',
    color: '#95A5A6',
  },
  controls: {
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  input: {
    color: '#ECF0F1',
  },
  button: {
    backgroundColor: '#007AFF',
    color: 'white',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.03)',
  },
  resultContainer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  previewTitle: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: '1.25rem',
    marginBottom: '16px',
  },
  pfpPreview: {
    width: '180px',
    height: '180px',
    borderRadius: '12px',
    marginBottom: '24px',
    objectFit: 'cover',
    border: '2px solid #00AFFF',
  },
  downloadLink: {
    backgroundColor: '#FFFFFF',
    color: '#1A1A1D',
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'opacity 0.2s ease',
  },
};

export default ShiningPfpGenerator;