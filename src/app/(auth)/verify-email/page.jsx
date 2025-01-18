

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

import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import {useRouter} from "next/navigation";
import axios from "@/lib/axios"; // Axios instance yang telah diatur

export default function VerificationPage() {
  const router = useRouter();
  const { logout, resendEmailVerification } = useAuth();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(null); // Status pesan ke pengguna
  const [isLoading, setIsLoading] = useState(false); // Loading untuk tombol
  const [isVerified, setIsVerified] = useState(false); // Status verifikasi

  /**
   * Handle pengiriman ulang email verifikasi
   */
  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await resendEmailVerification({ setStatus });
      setStatus("Verification email resent! Please check your inbox.");
    } catch (error) {
      console.error("Failed to resend email verification:", error);
      setStatus("Failed to resend verification email. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle logout jika pengguna ingin keluar
   */
  const handleLogout = () => {
    logout();
    router.push("/login"); // Redirect ke halaman login setelah logout
  };

  useEffect(() => {
    /**
     * Ambil parameter dari URL
     */
    const id = searchParams.get("id");
    const hash = searchParams.get("hash");
    const expires = searchParams.get("expires");
    const signature = searchParams.get("signature");

    // Periksa jika parameter valid
    if (id && hash && expires && signature) {
      /**
       * Fungsi verifikasi email
       */
      const verifyEmail = async () => {
        try {
          setStatus("Verifying your email... Please wait.");
          // Panggil endpoint API untuk verifikasi email
          await axios.get(
            `https://api-amicloud.temukreatif.id/verify-email/${id}/${hash}`,
            {
              params: { expires, signature },
            }
          );

          setStatus("Your email has been verified! Redirecting to login...");
          setIsVerified(true);
          setTimeout(() => {
            router.push("/login"); // Redirect ke halaman login setelah sukses
          }, 2000);
        } catch (error) {
          console.error("Email verification failed:", error);
          setStatus(
            "Verification failed. The link may have expired or is invalid. Please try resending the email verification."
          );
          setIsVerified(false);
        }
      };

      verifyEmail();
    } else {
      // Jika parameter tidak lengkap, tampilkan error
      setStatus(
        "Invalid verification link. Please check your email or request a new verification email."
      );
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-3xl shadow-lg max-w-xl w-full">
        <p className="mt-4 text-left md:text-xl">
          Thanks for signing up! Before getting started, could you verify your
          email address by clicking on the link we just emailed to you? If you
          didn&apos;t receive the email, we will gladly send you another.
        </p>

        {status && (
          <p
            className={`mt-4 text-center ${
              isVerified ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}

        {!isVerified && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleResendEmail}
              disabled={isLoading}
              className={`w-full py-2 px-4 font-bold rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Resending..." : "Resend Verification Email"}
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
  );
}
