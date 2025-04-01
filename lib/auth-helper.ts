import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export class AuthError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

export async function requireAuth() {
  const session = await auth();
  
  if (!session || !session.user || !session.user.id) {
    throw new AuthError('You must be logged in to perform this action');
  }

  return {
    userId: session.user.id,
    user: session.user
  };
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export function redirectToLogin() {
  redirect('/login');
} 