"use client";
import React from "react";
import { Shield, Lock, ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PermisstionDenined = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Shield className="h-16 w-16 text-red-500" />
            <Lock className="h-8 w-8 text-red-600 absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h1>

        {/* Subtitle */}
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
          Permission Required
        </h2>

        {/* Message */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Unauthorized Action</span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            You don't have permission to edit this song. Only the song owner can
            make modifications.
          </p>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              <span className="font-semibold">Reason:</span> You are not the
              owner of this song.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full border-gray-300 mt-2 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If you believe this is an error, please contact the song owner or
            administrator.
          </p>
        </div>

        {/* Error Code */}
        <div className="mt-4">
          <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-mono">
            Error Code: 403
          </span>
        </div>
      </div>
    </div>
  );
};

export default PermisstionDenined;
