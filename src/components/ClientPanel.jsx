import { useState } from 'react';
import { Unlock, AlertCircle } from 'lucide-react';

export const ClientPanel = ({
  decryptedData,
  error,
  isDecrypting,
  isLoading
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Unlock className="w-5 h-5 text-primary-500" />
        <h2 className="text-xl font-semibold text-white">Decrypted Data</h2>
      </div>

      {/* Content Area */}
      {isDecrypting || isLoading ? (
        // Loading State
        <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="text-gray-400 text-sm">Decrypting payload...</p>
          </div>
        </div>
      ) : error ? (
        // Error State
        <div className="flex-1 bg-gradient-to-br from-red-900/20 to-red-900/10 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
          <p className="text-red-400 font-semibold mb-2">Decryption Failed</p>
          <p className="text-red-300/70 text-sm text-center">{error}</p>
          <div className="mt-4 p-3 bg-red-900/20 rounded border border-red-500/20">
            <p className="text-xs text-red-300">
              This could mean the passphrase is incorrect or the data has been tampered with.
            </p>
          </div>
        </div>
      ) : decryptedData ? (
        // Success State
        <div className="flex-1 bg-gradient-to-br from-green-900/20 to-green-900/10 border border-primary-500/30 rounded-lg p-4 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {/* User ID */}
              <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                <p className="text-xs text-gray-400 uppercase tracking-wide">User ID</p>
                <p className="text-lg font-mono text-primary-400 mt-1">
                  {decryptedData.userId}
                </p>
              </div>

              {/* Email */}
              <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Email Address</p>
                <p className="text-sm text-gray-200 mt-1 break-all">
                  {decryptedData.email}
                </p>
              </div>

              {/* Account Balance */}
              <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Account Balance</p>
                <p className="text-lg font-mono text-primary-400 mt-1">
                  {decryptedData.accountBalance}
                </p>
              </div>

              {/* Role */}
              <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Access Level</p>
                <p className="inline-block text-sm font-semibold text-white bg-primary-600/30 px-3 py-1 rounded mt-1 border border-primary-500/40">
                  {decryptedData.role}
                </p>
              </div>

              {/* Last Login */}
              <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Last Login</p>
                <p className="text-sm text-gray-300 mt-1">
                  {new Date(decryptedData.lastLogin).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm flex items-center justify-center">
          <p className="text-gray-500 text-sm">Enter passphrase and decrypt to view data</p>
        </div>
      )}
    </div>
  );
};
