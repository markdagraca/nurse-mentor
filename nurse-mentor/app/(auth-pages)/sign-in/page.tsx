import { signInWithGoogleAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Nursing Mentor</h1>
          <p className="text-sm text-gray-600 mt-2">Your digital companion for nursing excellence</p>
        </div>
        <form className="flex flex-col gap-6">
          <h2 className="text-2xl font-medium text-center">Sign in</h2>
          <SubmitButton
            pendingText="Signing In..."
            formAction={signInWithGoogleAction}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24px"
              height="24px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Sign in with Google
          </SubmitButton>
          <FormMessage message={searchParams} />
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link className="text-blue-600 font-medium hover:underline" href="/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2023 Nursing Mentor. All rights reserved.</p>
        <p className="mt-2">
          <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
          {" | "}
          <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}
