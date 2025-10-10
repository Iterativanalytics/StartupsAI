import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Upload as UploadIcon, Brain } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Iterativ</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/upload"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <UploadIcon className="h-5 w-5" />
              <span>Upload</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;