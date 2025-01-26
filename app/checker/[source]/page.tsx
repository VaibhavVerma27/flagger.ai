"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const ExtensionHandler = () => {
  const [extensionData, setExtensionData] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const params = useParams();
  let source = params.source;

  if (Array.isArray(source)) {
    source = source.join();
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cache/${source}`);
        if (res.status === 200) {
          setExtensionData(res.data);
        } else if (res.status === 404) {
          alert("Data not found");
        }
      } catch (e) {
        console.log(e);
        alert("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [source]);

  useEffect(() => {
    if (extensionData) {
      processData();
    }
  }, [extensionData]);

  const processData = async () => {
    if (!extensionData) return;

    setProcessing(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/caution`, {
        collectionNameU: source,
        text: extensionData,
      });

      if (response.status === 200) {
        setResult(response.data);
      } else {
        setResult("Failed to process data");
      }
    } catch (error) {
      console.error("Error processing data:", error);
      setResult("Failed to process data");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce delay-200"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce delay-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-6">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Extension Data Viewer
      </h1>
      <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Extension Data</h2>
        {extensionData ? (
          <div className="max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600 text-gray-200 text-sm">
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(extensionData, null, 2)}</pre>
          </div>
        ) : (
          <p className="text-gray-400">No data received yet.</p>
        )}

        <button
          className={`mt-4 w-full px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition ${
            processing && "opacity-50 cursor-not-allowed"
          }`}
          onClick={processData}
          disabled={!extensionData || processing}
        >
          Process Data
        </button>

        {result && (
          <div className="mt-6 bg-gray-700 p-4 rounded text-gray-200">
            <h2 className="text-lg font-semibold mb-2">Result</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtensionHandler;
