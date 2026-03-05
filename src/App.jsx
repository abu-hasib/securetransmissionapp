import { useState, useEffect } from "react";
import { ServerPanel } from "./components/ServerPanel.jsx";
import { ClientPanel } from "./components/ClientPanel.jsx";
import { TransmissionAnimation } from "./components/TransmissionAnimation.jsx";
import { StatusIndicator } from "./components/StatusIndicator.jsx";
import {
  encryptDataBackend,
  decryptDataClient,
  simulateMITMAttack,
} from "./utils/encryption.js";
import { Lock, Zap } from "lucide-react";
import FetchMechanism from "./components/FetchMechanism.jsx";
import useSimpleState from "./hooks/useSimpleState.js";

const SAMPLE_DATA = {
  userId: "USR-48291",
  email: "ridwan@example.com",
  accountBalance: "$12,480",
  role: "Admin",
  lastLogin: "2026-02-11T10:32:00Z",
};

export function App() {
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isMitm, setIsMitm] = useState(false);
  const { isLoading, dispatch } = useSimpleState();

  // Initialize: simulate backend encryption
  useEffect(() => {
    const initializeEncryption = async () => {
      const encrypted = await encryptDataBackend(SAMPLE_DATA);
      setEncryptedData(encrypted);
    };

    initializeEncryption();
  }, []);

  // Handle decryption
  const handleDecrypt = async () => {
    if (!encryptedData || !passphrase) {
      setError("Please enter a passphrase");
      setStatus("error");
      return;
    }

    setIsDecrypting(true);
    setError(null);
    setDecryptedData(null);
    setStatus("loading");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const decrypted = await decryptDataClient(encryptedData, passphrase);
      setDecryptedData(decrypted);
      setStatus("success");
      setError(null);
    } catch (err) {
      setDecryptedData(null);
      setError(err instanceof Error ? err.message : "Decryption failed");
      setStatus("error");
    } finally {
      setIsDecrypting(false);
    }
  };

  // Handle MITM attack simulation
  const handleMITMAttack = async () => {
    if (!encryptedData) return;

    const corrupted = simulateMITMAttack(encryptedData);
    setEncryptedData(corrupted);
    setIsMitm(true);
    setDecryptedData(null);
    setError(null);
    setStatus("idle");
    setPassphrase("");

    // Automatically attempt decryption with correct passphrase to show MITM impact
    setTimeout(async () => {
      setIsDecrypting(true);
      setStatus("loading");
      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        await decryptDataClient(corrupted, "SecureTransmissionMasterKey2026");
      } catch (err) {
        setError("MITM Attack: Decryption failed due to corrupted payload");
        setStatus("error");
      } finally {
        setIsDecrypting(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex gap-4">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-primary-500" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Secure Transmission Visualizer
              </h1>
            </div>
            <TransmissionAnimation />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-lg mt-2">
              Experience end-to-end encrypted data transmission with client-side
              decryption
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mb-2">
          {status !== "idle" && (
            <StatusIndicator
              status={status}
              message={
                error ||
                (status === "success"
                  ? "Data successfully decrypted"
                  : undefined)
              }
              isMitm={isMitm && status === "success"}
            />
          )}
        </div>

        {/* Main content panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Server Panel */}
          <div className="h-[500px] bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800/50 rounded-xl p-6 backdrop-blur-lg shadow-2xl">
            <ServerPanel
              encryptedData={encryptedData}
              isMitm={isMitm}
              handleDecrypt={handleDecrypt}
              isDecrypting={isDecrypting}
              passphrase={passphrase}
              setPassphrase={setPassphrase}
            />
          </div>

          <div>
            <FetchMechanism
              setDecryptedData={setDecryptedData}
              isLoading={isLoading}
              dispatch={dispatch}
            />
          </div>

          {/* Transmission Animation */}
          <div className="h-[500px] bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800/50 rounded-xl p-6 backdrop-blur-lg shadow-2xl">
            <ClientPanel
              decryptedData={decryptedData}
              error={error}
              isDecrypting={isDecrypting}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Client Panel */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          {/* <TransmissionAnimation /> */}
          <div className="mt-8 p-4 bg-gray-800/40 rounded-lg border border-gray-700/30 max-w-xs">
            <p className="text-xs text-center text-gray-400">
              The encrypted payload is transmitted over the network. Only the
              correct passphrase can decrypt it.
            </p>
          </div>
        </div>

        {/* Mobile Transmission Animation */}
        <div className="lg:hidden mb-8">
          <TransmissionAnimation />
        </div>

        {/* Control Section */}
        <div className="space-y-6">
          {/* Passphrase Input */}

          {/* Bonus Feature: MITM Attack Simulation */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800/50 rounded-xl p-6 backdrop-blur-lg shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Simulation Tools
                </h3>
                <p className="text-xs text-gray-400">
                  Simulate a man-in-the-middle attack by corrupting the
                  encrypted payload. Notice how decryption fails.
                </p>
              </div>
              <button
                onClick={handleMITMAttack}
                disabled={isDecrypting || !encryptedData || isMitm}
                className="px-4 py-2 mt-2 md:mt-0 bg-yellow-600/20 hover:bg-yellow-600/30 disabled:hover:bg-yellow-600/20 border border-yellow-600/30 text-yellow-400 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs whitespace-nowrap"
              >
                {isMitm ? "MITM Active" : "Simulate Attack"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
          <p className="text-gray-500 text-sm">
            This application uses Web Crypto API (AES-GCM) for secure data
            transmission.
            <br />
            <span className="text-xs">
              For educational and demonstration purposes only.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
