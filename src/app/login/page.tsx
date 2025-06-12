'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('https://macmate-scheduler-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.text();

      if (res.ok) {
        const cleanToken = data.replace('🔐 JWT Token: ', '');
        localStorage.setItem('jwt', cleanToken);
        console.log('🔐 JWT:', cleanToken);

        setResponse('✅ Login successful!');
        router.push('/dashboard');
      } else {
        localStorage.removeItem('jwt');
        console.log('❌ Login failed:', data);
        setResponse('❌ Login failed: ' + data);
      }
    } catch (err) {
      console.error('Login error:', err);
      setResponse('❌ Something went wrong.');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #000000, #1a1a1a)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 0 30px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img src="/mcmaster.jpg" alt="McMaster Logo" style={{ width: '140px', marginBottom: '1rem', borderRadius: '12px' }} />
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(to right, #7A003C, #FF4081)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Login to MacMate
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid #444',
            width: '100%',
            margin: '0.5rem 0',
            backgroundColor: '#1a1a1a',
            color: 'white',
            fontSize: '1rem'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid #444',
            width: '100%',
            margin: '0.5rem 0 1rem',
            backgroundColor: '#1a1a1a',
            color: 'white',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            background: 'linear-gradient(to right, #7A003C, #FF4081)',
            color: 'white',
            padding: '0.75rem 2rem',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1rem',
            width: '100%',
            cursor: 'pointer',
            transition: '0.3s',
            boxShadow: '0 4px 15px rgba(255,64,129,0.3)'
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 25px rgba(255,64,129,0.5)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,64,129,0.3)'}
        >
          Login
        </button>

        <p style={{ marginTop: '1.5rem', color: '#ccc', fontSize: '0.95rem' }}>{response}</p>
      </div>
    </div>
  );
}
