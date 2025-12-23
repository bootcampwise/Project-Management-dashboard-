import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: 'var(--color-bg-off-white)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-12 text-center"
        style={{
          maxWidth: '500px',
          width: '100%',
          borderRadius: '12px',
        }}
      >
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{
            backgroundColor: 'var(--color-brand-orange)',
          }}
        >
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1
          className="text-3xl font-bold mb-4"
          style={{
            color: 'var(--color-gray-900)',
          }}
        >
          Welcome to Defcon!
        </h1>

        <p
          className="text-lg mb-2"
          style={{
            color: 'var(--color-gray-700)',
          }}
        >
          Your account has been created successfully.
        </p>

        {user?.email && (
          <p
            className="text-md mb-8"
            style={{
              color: 'var(--color-gray-text)',
            }}
          >
            {user.email}
          </p>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 rounded-md text-white font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: 'var(--color-brand-blue)',
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Welcome;
