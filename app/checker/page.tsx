"use client";

import { useEffect, useState } from "react";

const ExtensionHandler = () => {
  const [extensionData, setExtensionData] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);


  useEffect(() => {
    window.addEventListener('message', (event) => {
      // Verify sender origin

      if (event.data.type === 'TERMS_DATA') {
        setExtensionData(event.data.payload);
      }
    })
  }, []);

  // Simulate API call to process the data
  const processData = async () => {
    if (!extensionData) return;

    try {
      const response = await fetch("/api/processData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: extensionData }),
      });

      const result = await response.json();
      setResult(result.message);
    } catch (error) {
      console.error("Error processing data:", error);
      setResult("Failed to process data");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Browser Extension Data Handler
      </h1>
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Extension Data</h2>
        {extensionData ? (
          <pre className="p-4 bg-gray-200 rounded text-sm overflow-x-auto">
            {JSON.stringify(extensionData, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-600">No data received yet.</p>
        )}

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          onClick={processData}
          disabled={!extensionData}
        >
          Process Data
        </button>

        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Result</h2>
            <p className="p-4 bg-green-200 rounded">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtensionHandler;
