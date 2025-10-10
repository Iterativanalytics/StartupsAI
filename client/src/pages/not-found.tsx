import React from 'react';
import { Link } from 'wouter';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="mb-8">
        <AlertTriangle className="h-20 w-20 text-yellow-500 mb-4 mx-auto" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        <Home className="h-4 w-4 mr-2" />
        Return to Dashboard
      </Link>
    </div>
  );
}