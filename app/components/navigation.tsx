'use client';

import Link from 'next/link';
import { UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';

export default function Navigation() {
  const { isSignedIn } = useAuth();

  return (
    <div className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-blue-600"
          >
            Galaxy AI
          </Link>
          <div className="flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Link
                  href="/history"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  History
                </Link>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 