import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-700">
        Page Not Found
      </h2>
      <p className="mt-4 max-w-md text-gray-500 md:text-lg">
        Sorry, we couldn't find the page you're looking for. It might have been
        removed, renamed, or never existed.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>

      {/* Decorative Background Element */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-50 to-transparent opacity-70 pointer-events-none"></div>
    </div>
  );
}