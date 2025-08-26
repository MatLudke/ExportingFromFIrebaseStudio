'use server';
/**
 * @fileoverview Authentication flows for sending and verifying one-time codes.
 *
 * - sendCode: Generates and sends a one-time code to a user's email.
 * - verifyCode: Verifies a one-time code submitted by a user.
 *
 * This implementation uses Nodemailer to send a real email. You will need to
 * configure your email service credentials in the .env file.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';

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

// Configure your email transporter
// IMPORTANT: Replace the placeholder values in your .env file
// with your actual email service credentials.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., 'smtp.sendgrid.net' or 'smtp.gmail.com'
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: (process.env.EMAIL_PORT || '587') === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email service username
    pass: process.env.EMAIL_PASS, // Your email service password or API key
  },
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

    // 3. Generate the email content using an LLM
    const emailPrompt = `
      You are an automated system that sends verification codes.
      A user has requested a one-time code to log in to the "Zenith" study app.
      The code is: ${code}
      Compose a simple, clear, and concise email body that provides this code to the user.
      Do not include a subject line. Just the body of the email.
      The email should state that the code expires in 10 minutes.
    `;

    const llmResponse = await ai.generate({
      prompt: emailPrompt,
      model: 'googleai/gemini-2.5-flash',
    });

    const emailBody = llmResponse.text;

    // 4. Send the email using Nodemailer
    try {
      await transporter.sendMail({
        from: `"Zenith App" <${process.env.EMAIL_FROM || 'no-reply@yourapp.com'}>`,
        to: email,
        subject: "Your Zenith Verification Code",
        text: emailBody,
        html: `<p>${emailBody.replace(/\n/g, '<br>')}</p>`,
      });
      console.log(`Verification code sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      // In a real app, you might want to throw an error here to notify the user
      // that the email could not be sent.
      throw new Error('Failed to send verification email.');
    }
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
