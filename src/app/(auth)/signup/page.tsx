"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { GoogleIcon } from '@/components/icons/google-icon';
import { AppleIcon } from '@/components/icons/apple-icon';


export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignup = async () => {
    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Terms not accepted",
        description: "You must accept the terms of service to create an account.",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: fullName,
      });

      toast({
        title: "Account created successfully!",
        description: "You can now log in.",
      });

      router.push('/login');
    } catch (error: any) {
      let description = "An error occurred while creating your account. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email is already in use. Try logging in.";
      } else if (error.code === 'auth/weak-password') {
        description = "Your password is too weak. It must be at least 6 characters long.";
      }
      toast({
        variant: "destructive",
        title: "Account Creation Error",
        description,
      });
    }
  };
  
  const handleSocialLogin = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Account created successfully!",
        description: "Redirecting to your dashboard.",
      });
      router.push('/dashboard');
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Signup Error",
        description: "An error occurred during social signup. Please try again.",
      });
    }
  };


  return (
    <Card className="mx-auto max-w-sm w-full border-none shadow-2xl shadow-black/10">
      <CardHeader className="text-center space-y-4">
        <Logo className="mb-4 justify-center" />
        <CardTitle className="text-3xl font-headline tracking-tight">Create Your Account</CardTitle>
        <CardDescription>
          Start your productivity journey today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input 
              id="full-name" 
              placeholder="Your Name" 
              required 
              className="py-6"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
              className="py-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              className="py-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox 
              id="terms" 
              required 
              className="mt-1"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
              I accept the <Link href="#" className="underline hover:text-primary">terms of service</Link> and <Link href="#" className="underline hover:text-primary">privacy policy</Link>.
            </Label>
          </div>
          <Button type="submit" className="w-full py-6 text-base" onClick={handleSignup}>
            Create Account for Free
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleSocialLogin(googleProvider)}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline">
              <AppleIcon className="mr-2 h-4 w-4" />
              Apple
            </Button>
          </div>
        </div>
        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
