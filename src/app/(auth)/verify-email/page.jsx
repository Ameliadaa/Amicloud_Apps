

// 'use client';

// import React from "react";
// import { useState, useEffect } from "react";
// import { useAuth } from "@/hooks/auth";
// import {useRouter} from "next/navigation";



// export default function VerificationPage() {
//   const router = useRouter();
//   const { logout, resendEmailVerification } = useAuth({
//     middleware: "auth",
//     redirectIfAuthenticated: "/login",
//   });

//   const [status, setStatus] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
  

//   const handleResendEmail = async () => {
//     setIsLoading(true); 
//     try {
//       await resendEmailVerification({ setStatus });
//     } catch (error) {
//       console.error("Failed to resend email verification:", error);
//     } finally {
//       setIsLoading(false); 
//     }
//   };

//   const handleLogout = () => {
//     console.log('Logging out from VerificationPage...');
//     logout();
//   };


//   return (
//     <>
//     <div >
//     <p className="mt-4 text-foreground text-left md:text-xl">
//     Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn&apos;t receive the email, we will gladly send you another.
//       </p>

//       {status && (
//         <p className="mt-4 text-green-600 text-justify">{status}</p>
//       )}

//       <div className="mt-6 flex justify-center">
//       <button
//             onClick={handleResendEmail}
//             disabled={isLoading} 
//             className={`w-full py-2 px-4 font-bold rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               isLoading
//                   ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
//                   : 'bg-secondary text-black hover:bg-primary hover:text-white'
//           }`}
//           >
//             {isLoading ? 'Resend Verification Email' : 'Resend Verification Email'} 
//           </button>
//       </div>

//       <p className="mt-6 text-center text-sm md:text-base text-gray-500">
//       Not using your account anymore?&nbsp;
//         <button onClick={handleLogout} className="text-blue-500 underline hover:underline">
//           Log Out
//         </button>
//       </p>
//     </div>     
//       </>
//   );
// }


'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth';
import axios from "@/lib/axios";

export default function VerificationPage() {
  const router = useRouter();
  const { logout, resendEmailVerification } = useAuth();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await resendEmailVerification({ setStatus });
    } catch (error) {
      console.error('Failed to resend email verification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out from VerificationPage...');
    logout();
  };

  useEffect(() => {
    // Ambil ID dan hash dari URL
    const id = searchParams.get('id');
    const hash = searchParams.get('hash');
    const expires = searchParams.get('expires');
    const signature = searchParams.get('signature');

    if (id && hash && expires && signature) {
      // Verifikasi email dengan informasi dari URL
      const verifyEmail = async () => {
        try {
          const response = await axios.get(`/api/v1/verify-email/${id}/${hash}`, {
            params: {
              expires: expires,
              signature: signature,
            },
          });

          setStatus('Your email has been verified! Redirecting to login...');
          setIsVerified(true);
          setTimeout(() => {
            router.push('/login'); // Redirect ke halaman login setelah verifikasi berhasil
          }, 2000);
        } catch (error) {
          setStatus(
            'Verification failed. The link may have expired or is invalid.'
          );
          setIsVerified(false);
        }
      };

      verifyEmail();
    } else {
      setStatus('Invalid verification link or missing parameters.');
    }
  }, [searchParams, router]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-3xl shadow-lg max-w-xl w-full">
          <p className="mt-4 text-left md:text-xl">
            Thanks for signing up! Before getting started, could you verify
            your email address by clicking on the link we just emailed to you?
            If you didn&apos;t receive the email, we will gladly send you another.
          </p>

          {status && (
            <p className="mt-4 text-green-600 text-center">{status}</p>
          )}

          {!isVerified && (
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
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm md:text-base text-gray-500">
            Not using your account anymore?&nbsp;
            <button
              onClick={handleLogout}
              className="text-blue-500 underline hover:underline"
            >
              Log Out
            </button>
          </p>
        </div>
      </div>
    </>
  );
}