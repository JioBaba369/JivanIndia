
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    
    await sendPasswordResetEmail(auth, email);

    return NextResponse.json({ message: 'Password reset email sent successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    // Firebase returns specific error codes that can be handled if needed
    if (error.code === 'auth/user-not-found') {
        // To prevent email enumeration, we can return a generic success message
        // even if the user does not exist.
        return NextResponse.json({ message: 'If an account with this email exists, a password reset link has been sent.' }, { status: 200 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
