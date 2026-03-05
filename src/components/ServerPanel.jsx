import { useState } from "react";
import { Lock, Copy, Check } from "lucide-react";

export const ServerPanel = ({
  encryptedData,
  isMitm,
  passphrase,
  isDecrypting,
  handleDecrypt,
  setPassphrase,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (encryptedData) {
      navigator.clipboard.writeText(encryptedData.ciphertext);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-5 h-5 text-primary-500" />
        <h2 className="text-xl font-semibold text-white">Encrypted Payload</h2>
        <span className="text-xs text-gray-400">(In Transit)</span>
      </div>

      {/* Status Badge */}
      {isMitm && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">
            ⚠️ MITM Attack Detected: Payload corrupted
          </p>
        </div>
      )}

      {/* Encrypted Payload Display */}
      {encryptedData ? (
        <div className="flex-1 space-y-6 flex flex-col">
          <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto font-mono text-xs text-gray-400 break-all leading-relaxed">
              <div className="mb-2">
                <span className="text-primary-400">IV:</span>
                <br />
                <span className="text-gray-500">{encryptedData.iv}</span>
              </div>
              <div className="mb-2">
                <span className="text-primary-400">CIPHERTEXT:</span>
                <br />
                <span className="text-gray-500 font-mono">
                  {encryptedData.ciphertext}
                </span>
              </div>
              <div>
                <span className="text-primary-400">ALGORITHM:</span>
                <br />
                <span className="text-gray-500">{encryptedData.algorithm}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex gap-3">
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleDecrypt()}
                placeholder="Enter Passphrase to Decrypt..."
                disabled={isDecrypting}
                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleDecrypt}
                disabled={isDecrypting || !passphrase}
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-primary-500/30 active:scale-95"
              >
                {isDecrypting ? "Decrypting..." : "Decrypt"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              <span>Hint: The passphrase is </span>
              <span className="text-primary-300 font-mono">
                SecureTransmissionMasterKey2026
              </span>
            </p>
          </div>

          {/* Copy Button */}
          {/* <button
            onClick={handleCopy}
            className="mt-4 w-full py-2 px-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Payload
              </>
            )}
          </button> */}
        </div>
      ) : (
        <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm flex items-center justify-center">
          <p className="text-gray-500 text-sm">Awaiting data transmission...</p>
        </div>
      )}
    </div>
  );
};
