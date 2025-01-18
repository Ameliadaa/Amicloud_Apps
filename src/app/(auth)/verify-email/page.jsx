'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";

export default function VerificationPage() {
  const router = useRouter();
  const { verifyEmail, resendEmailVerification, logout } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/login",
  });

  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mendapatkan parameter `id` dan `hash` dari URL
  const { id, hash } = router.query;

  useEffect(() => {
    if (id && hash) {
      // Memanggil verify email setelah ID dan hash ditemukan
      const verify = async () => {
        setIsLoading(true);
        try {
          await verifyEmail({ id, hash, setStatus, setErrors });
        } catch (error) {
          setErrors([error.message || 'Email verification failed']);
        } finally {
          setIsLoading(false);
        }
      };
      verify();
    }
  }, [id, hash, verifyEmail]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await resendEmailVerification({ setStatus });
    } catch (error) {
      setErrors([error.message || 'Failed to resend verification email']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out from VerificationPage...');
    logout();
  };

  return (
    <div>
      <p className="mt-4 text-foreground text-left md:text-xl">
        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn&apos;t receive the email, we will gladly send you another.
      </p>

      {/* Tampilkan Status Verifikasi */}
      {status && <p className="mt-4 text-green-600 text-justify">{status}</p>}

      {/* Tampilkan Kesalahan jika ada */}
      {errors && <p className="mt-4 text-red-600 text-justify">{errors}</p>}

      {/* Tombol Resend Email Verification */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleResendEmail}
          disabled={isLoading}
          className={`w-full py-2 px-4 font-bold rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isLoading
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-secondary text-black hover:bg-primary hover:text-white'
          }`}
        >
          {isLoading ? 'Sending Verification Email...' : 'Resend Verification Email'}
        </button>
      </div>

      <p className="mt-6 text-center text-sm md:text-base text-gray-500">
        Not using your account anymore?&nbsp;
        <button onClick={handleLogout} className="text-blue-500 underline hover:underline">
          Log Out
        </button>
      </p>
    </div>
  );
}
