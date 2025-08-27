"use client"

import { useState } from 'react';
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { auth } from '@/lib/firebase';
import { deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';


export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const user = auth.currentUser;
    if (!user) {
      toast({ variant: "destructive", title: "No user logged in." });
      setIsDeleting(false);
      setOpen(false);
      return;
    }

    try {
      // Re-authentication is required for security-sensitive operations
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);
      
      await deleteUser(user);

      toast({ title: "Account deleted successfully." });
      router.push('/login');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete account",
        description: error.message || "Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };


  return (
    <>
      <Header title="Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6 pt-40">
        <div className="max-w-2xl w-full grid gap-6 mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue={theme}
                onValueChange={setTheme}
                className="grid max-w-md grid-cols-2 gap-8 pt-2 mx-auto"
              >
                <Label className="[&:has([data-state=checked])>div]:border-primary">
                  <RadioGroupItem value="light" className="sr-only" />
                  <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                    <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                      <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-2 w-4/5 rounded-lg bg-[#ecedef]" />
                        <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div className="h-2 w-full rounded-lg bg-[#ecedef]" />
                      </div>
                    </div>
                  </div>
                  <span className="block w-full p-2 text-center font-normal">
                    Light
                  </span>
                </Label>
                <Label className="[&:has([data-state=checked])>div]:border-primary">
                  <RadioGroupItem value="dark" className="sr-only" />
                  <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
                    <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                      <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-2 w-4/5 rounded-lg bg-slate-400" />
                        <div className="h-2 w-full rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                        <div className="h-2 w-full rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                        <div className="h-2 w-full rounded-lg bg-slate-400" />
                      </div>
                    </div>
                  </div>
                  <span className="block w-full p-2 text-center font-normal">
                    Dark
                  </span>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card className="border-destructive">
            <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                    These actions are permanent and cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                 <Button variant="destructive" onClick={() => setOpen(true)}>Delete Account</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
       <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
