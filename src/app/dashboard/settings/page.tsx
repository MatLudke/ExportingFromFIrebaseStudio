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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <main className="flex-1 overflow-auto p-4 md:p-6 pt-28">
        <div className="max-w-2xl grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardD<ctrl61>, I will need to check the calling component.

I see `user-nav.tsx` is being used in `src/app/dashboard/header.tsx`. And `header.tsx` is used in `dashboard/layout.tsx`, `dashboard/page.tsx`, `dashboard/reports/page.tsx`, `dashboard/settings/page.tsx`.

It seems there are two `user-nav.tsx` files. One is `src/app/dashboard/user-nav.tsx` and another is `src/components/dashboard/user-nav.tsx`.
The one in `src/app/dashboard/user-nav.tsx` is the correct one with the logic. The one in `src/components/dashboard/user-nav.tsx` seems to have hardcoded values.

Let's check where the header is imported from in `dashboard` pages.
`src/app/dashboard/page.tsx` -> `import { Header } from "@/components/dashboard/header";`
`src/app/dashboard/reports/page.tsx` -> `import { Header } from "@/components/dashboard/header";`
`src/app/dashboard/settings/page.tsx` -> `import { Header } from "@/components/dashboard/header";`

And let's check `src/components/dashboard/header.tsx`:
`import { UserNav } from './user-nav';`
This imports from `src/components/dashboard/user-nav.tsx`. This file has hardcoded values. That's the problem.

There are two `UserNav.tsx` files.
- `src/app/dashboard/user-nav.tsx` (the correct one with state logic)
- `src/components/dashboard/user-nav.tsx` (the incorrect one with static data)

And there are two `header.tsx` files.
- `src/app/dashboard/header.tsx` (older, unused)
- `src/components/dashboard/header.tsx` (the one being used)

The correct `UserNav` is in `/app/dashboard/user-nav.tsx`, but the header in `/components/dashboard/header.tsx` is importing a different `UserNav` from its own directory, `/components/dashboard/user-nav.tsx`. This seems to be an old, static version.

So, I need to consolidate these files. I will delete the incorrect `user-nav.tsx` and `header.tsx` and move the correct ones into the `components` folder.

**Plan:**

1.  **Delete incorrect `UserNav`**: Remove `src/components/dashboard/user-nav.tsx`.
2.  **Delete incorrect `Header`**: Remove `src/app/dashboard/header.tsx`.
3.  **Move correct `UserNav`**: Move `src/app/dashboard/user-nav.tsx` to `src/components/dashboard/user-nav.tsx`.
4.You've spotted the problem perfectly, and my apologies for the confusion. You're right, the user information is still showing static, placeholder text. This is happening because there are duplicated component files, and the app is using an old version of the `UserNav` component with hardcoded values. I also overlooked your request for an account deletion feature.

I will fix both issues now. My plan is to clean up the duplicated components and implement a secure account deletion flow.

Here’s the plan:

1.  **Consolidate Components**: I will delete the old, static `UserNav` and `Header` components and move the correct, dynamic versions to the `src/components/dashboard/` directory. This will ensure the app uses the right components that fetch and display real user data.
2.  **Implement Account Deletion**: I'll add a "Danger Zone" section to the settings page with a "Delete Account" button. Clicking it will open a confirmation dialog to prevent accidental deletion. For security, Firebase requires the user to re-authenticate before deleting their account, so I'll integrate that step into the process.

Here are the changes to fix the user info display and add the account deletion feature:

<changes>
  <description>Consolidates duplicated Header and UserNav components to correctly display user data from Firebase. Implements a secure account deletion feature on the settings page, including a re-authentication step and confirmation dialog.</description>
  <change>
    <file>/src/app/dashboard/settings/page.tsx</file>
    <content><![CDATA["use client"

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <main className="flex-1 overflow-auto p-4 md:p-6 pt-28">
        <div className="max-w-2xl grid gap-6">
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
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
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
