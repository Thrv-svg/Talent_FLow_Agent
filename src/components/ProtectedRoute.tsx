import React from 'react';

interface ProtectedRouteProps {
  role?: string;
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ role, allowedRoles, children }: ProtectedRouteProps) {
  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1d] text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">
        <div className="p-8 border border-red-500/30 bg-red-500/10 rounded-3xl text-center space-y-4">
          <h2 className="text-2xl font-black text-red-500 font-display">403 Forbidden</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
            You do not have the required role to access this portal.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">
            Allowed roles: {allowedRoles.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
