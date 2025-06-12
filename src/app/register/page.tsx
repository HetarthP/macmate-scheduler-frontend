'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:8081/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setResponse('✅ Registered successfully! Redirecting...');
        setTimeout(() => router.push('/login'), 1000);
      } else {
        setResponse('❌ Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setResponse('❌ Something went wrong.');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #7A003C, #FF4081)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a', // solid card color
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 0 40px rgba(0, 0, 0, 0.4)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img src="/mcmaster.jpg" alt="McMaster Logo" style={{ width: '140px', marginBottom: '1rem', borderRadius: '12px' }} />
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(to right, #ffffff, #ffb3c1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Register for MacMate
        </h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid #444',
            width: '100%',
            margin: '0.5rem 0',
            backgroundColor: '#2a2a2a',
            color: 'white',
            fontSize: '1rem'
          }}
        />
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
            backgroundColor: '#2a2a2a',
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
            backgroundColor: '#2a2a2a',
            color: 'white',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={handleRegister}
          style={{
            background: 'linear-gradient(to right, #ffffff, #ffb3c1)',
            color: '#7A003C',
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
          Register
        </button>

        <p style={{ marginTop: '1.5rem', color: '#ccc', fontSize: '0.95rem' }}>{response}</p>
      </div>
    </div>
  );
}
