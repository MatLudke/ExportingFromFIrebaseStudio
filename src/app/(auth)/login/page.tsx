"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { GoogleIcon } from '@/components/icons/google-icon';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Success!",
        description: "You are now logged in.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full border-none shadow-2xl shadow-black/10">
      <CardHeader className="text-center space-y-4">
        <Logo className="mb-4 justify-center" />
        <CardTitle className="text-3xl font-headline tracking-tight">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to continue to your study dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <Button 
            variant="outline" 
            className="w-full py-6 text-base" 
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <GoogleIcon className="mr-2 h-5 w-5" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
