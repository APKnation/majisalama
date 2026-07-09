// frontend/src/components/FloatingChatButton.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FloatingChatButton() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      id="floating-chat-btn"
      onClick={() => navigate('/predict')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: hovered
          ? 'linear-gradient(135deg, #0052d4, #4364f7, #6fb1fc)'
          : 'linear-gradient(135deg, #1a1aff, #0066cc)',
        color: '#fff',
        border: 'none',
        borderRadius: '50px',
        padding: hovered ? '14px 24px' : '14px 18px',
        boxShadow: hovered
          ? '0 8px 32px rgba(0, 102, 204, 0.6), 0 0 0 4px rgba(100,180,255,0.15)'
          : '0 4px 20px rgba(0, 102, 204, 0.4)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
        overflow: 'hidden',
      }}
      aria-label="Uliza Nikusaidia - AI Water Demand Predictor"
    >
      {/* Pulse ring */}
      <span style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50px',
        animation: 'pulse-ring 2s ease-out infinite',
        border: '2px solid rgba(100,180,255,0.5)',
        pointerEvents: 'none',
      }} />

      {/* Water drop icon */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="white"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}
      >
        <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
      </svg>

      {/* Label */}
      <span style={{
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}>
        Uliza Nikusaidia
      </span>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          70%  { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
