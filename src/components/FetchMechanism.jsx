import { decryptDataClient, encryptDataBackend } from "../utils/encryption";
import { File, PhoneCall, Cloud, FileScanIcon, FileLock } from "lucide-react";
import { TransmissionAnimation } from "./TransmissionAnimation";
import AirDropAnimation from "./AirdropAnimation";
import Tabs from "./Tabs";
import { useState } from "react";
import Loading from "./Loading";

const FetchMechanism = ({ setDecryptedData, isLoading, dispatch, isDecrypting }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleFetchDataClick = async () => {
    dispatch({ type: "pending", loading: true });
    dispatch({ type: "decrypting" });
    setTimeout(() => {
      fetch("encrypted.json")
        .then((response) => response.ok && response.json())
        .then(async (data) => {
          const decdat = await decryptDataClient(
            data,
            "SecureTransmissionMasterKey2026",
          );
          setDecryptedData(decdat);
        });
      dispatch({ type: "resolved", loading: false });
    }, 1000);
    try {
    } catch (error) {}
  };

  const handleFromCloudClick = async () => {
    dispatch({ type: "pending", loading: true });
    dispatch({ type: "decrypting" });
    const url = "https://api.airtable.com/v0/app1hUSIJJ1Ujq67i/Users"
    setTimeout(() => {
      fetch(url, {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
        }
      })
        .then((response) => response.ok && response.json())
        .then(async (data) => {
          const {records = []} = data
          const {fields = {}} = records[0]
          const decdat = await decryptDataClient(
            fields,
            "SecureTransmissionMasterKey2026",
          );
          setDecryptedData(decdat);
        });
      dispatch({ type: "resolved", loading: false });
    }, 1000);
  }

  if (isDecrypting) {
    return <p>Decrpyting...</p>;
  }

  const tabs = [
    {
      label: "Local",
      icon: <File className="w-4 h-4" />,
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm overflow-hidden">
          <div className="flex flex-1 items-center justify-center">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <FileLock size={45} />
                <p className="italic text-gray-400 text-sm">
                  {"encrypted file"}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleFetchDataClick}
            className="w-full mt-4 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-primary-500/30 active:scale-95"
          >
            {isLoading ? "Fetching" : "Fetch"} data
          </button>
        </div>
      ),
    },
    {
      label: "Cloud",
      icon: <Cloud className="w-4 h-4" />,
      content: (
        <div className="h-full flex flex-col bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm overflow-hidden">
          <div className="flex flex-1 items-center justify-center">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <FileScanIcon size={45} />
                <p className="italic text-gray-400 text-sm">
                  {"encrypted file in cloud"}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleFromCloudClick}
            className="w-full mt-4 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-primary-500/30 active:scale-95"
          >
            {isLoading ? "Fetching" : "Fetch"} from cloud
          </button>
        </div>
      ),
    },
  
  ];

  return (
    <div className="h-[500px] bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800/50 rounded-xl p-6 backdrop-blur-lg shadow-2xl flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <PhoneCall className="w-5 h-5 text-primary-500" />
        <h2 className="text-xl font-semibold text-white">
          Data Fetching Shell
        </h2>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
    </div>
  );
};

export default FetchMechanism;
