'use server';
/**
 * @fileoverview Authentication flows for sending and verifying one-time codes.
 *
 * - sendCode: Generates and "sends" a one-time code to a user's email.
 * - verifyCode: Verifies a one-time code submitted by a user.
 *
 * NOTE: This is a simplified prototype. In a real application, you would use
 * a secure database (like Firestore) to store codes and a real email service
 * (like SendGrid). For now, codes are stored in-memory and emails are logged
 * to the console.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit/zod';
import { generate } from 'genkit/tools';
import * as crypto from 'crypto';

// In-memory storage for demonstration purposes.
// DO NOT use this in production. Use a secure database like Firestore.
const codeStore: Map<string, { code: string; expires: number }> = new Map();

const EmailSchema = z.object({
  email: z.string().email(),
});

const VerificationSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const VerificationResultSchema = z.object({
  valid: z.boolean(),
});

export const sendCode = ai.defineFlow(
  {
    name: 'sendCodeFlow',
    inputSchema: EmailSchema,
    outputSchema: z.void(),
  },
  async ({ email }) => {
    // 1. Generate a secure 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 2. Store the code and its expiration
    codeStore.set(email, { code, expires });

    // 3. Generate the email content
    const emailPrompt = `
      You are an automated system that sends verification codes.
      A user has requested a one-time code to log in.
      The code is: ${code}
      Compose a simple, clear, and concise email body that provides this code to the user.
      Do not include a subject line. Just the body of the email.
      The email should state that the code expires in 10 minutes.
    `;

    const llmResponse = await generate({
      prompt: emailPrompt,
      model: 'googleai/gemini-2.5-flash',
    });

    const emailBody = llmResponse.text();

    // 4. "Send" the email (log to console for this prototype)
    console.log('--- SIMULATING SENDING EMAIL ---');
    console.log(`To: ${email}`);
    console.log(`Subject: Your Verification Code`);
    console.log('Body:');
    console.log(emailBody);
    console.log('---------------------------------');

    // In a real app, you would use a service like Nodemailer or SendGrid here:
    //
    // import nodemailer from 'nodemailer';
    // const transporter = nodemailer.createTransport({ /* config */ });
    // await transporter.sendMail({
    //   from: '"Your App" <no-reply@yourapp.com>',
    //   to: email,
    //   subject: "Your Verification Code",
    //   text: emailBody,
    // });
  }
);


export const verifyCode = ai.defineFlow(
  {
    name: 'verifyCodeFlow',
    inputSchema: VerificationSchema,
    outputSchema: VerificationResultSchema,
  },
  async ({ email, code }) => {
    const stored = codeStore.get(email);

    if (!stored) {
      return { valid: false };
    }

    if (Date.now() > stored.expires) {
      codeStore.delete(email); // Clean up expired code
      return { valid: false };
    }

    if (stored.code === code) {
      codeStore.delete(email); // Code is valid, delete it so it can't be reused
      return { valid: true };
    }

    return { valid: false };
  }
);
