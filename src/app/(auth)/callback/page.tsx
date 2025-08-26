"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Logo } from '@/components/logo';

export default function CallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your sign-in link...');
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const signIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          email = window.prompt('Please provide your email for confirmation');
        }

        if (email) {
          try {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            // The onAuthStateChanged listener will handle the redirect to /dashboard
            setMessage('Success! Redirecting you now...');
          } catch (err: any) {
            setError(`Error signing in: ${err.message}`);
            setMessage('');
          }
        } else {
            setError('Email is required to complete sign-in.');
            setMessage('');
        }
      } else {
        setError('This is not a valid sign-in link.');
        setMessage('');
      }
    };

    signIn();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Logo className="mb-8 justify-center" />
      {message && <p className="text-lg text-muted-foreground">{message}</p>}
      {error && <p className="text-lg text-destructive">{error}</p>}
    </div>
  );
}
