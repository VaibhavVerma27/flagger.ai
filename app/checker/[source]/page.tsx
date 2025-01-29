"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"

const ExtensionHandler: React.FC = () => {
  const [extensionData, setExtensionData] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [processing, setProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isExtensionDataVisible, setIsExtensionDataVisible] = useState<boolean>(true)
  const params = useParams()
  let source = params.source

  if (Array.isArray(source)) {
    source = source.join()
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cache/${source}`)
        if (res.status === 200) {
          setExtensionData(res.data)
        } else if (res.status === 404) {
          setError("Data not found.")
        }
      } catch (e) {
        console.error(e)
        setError("Failed to fetch data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [source])

  const processData = async () => {
    if (!extensionData) return

    setProcessing(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/caution`, {
        collectionNameU: source,
        text: extensionData,
      })

      if (response.status === 200) {
        setResult(response.data)
        setIsExtensionDataVisible(false)
      } else {
        setResult("Failed to process data.")
      }
    } catch (error) {
      console.error("Error processing data:", error)
      setResult("Failed to process data.")
    } finally {
      setProcessing(false)
    }
  }

  const parseResult = (text: string) => {
    return text
      .replace(/\{red\}(.*?)\{\/red\}/g, '<span class="text-red-500">$1</span>')
      .replace(/\{orange\}(.*?)\{\/orange\}/g, '<span class="text-orange-500">$1</span>')
      .replace(/\{yellow\}(.*?)\{\/yellow\}/g, '<span class="text-yellow-500">$1</span>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce delay-200"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce delay-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-6">
      <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-6 text-center transition-all duration-300 ease-in-out">
        Extension Data Analyzer
      </h1>
      <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
        {error ? (
          <p className="text-red-500 text-center mb-4 transition-all duration-300 ease-in-out">{error}</p>
        ) : (
          <>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isExtensionDataVisible ? "max-h-[1000px]" : "max-h-10"}`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsExtensionDataVisible(!isExtensionDataVisible)}
              >
                <h2 className="text-2xl font-semibold text-red-400 mb-4">Extension Data</h2>
                <svg
                  className={`w-6 h-6 text-red-400 transition-transform duration-300 ${isExtensionDataVisible ? "transform rotate-180" : ""}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              {extensionData && (
                <div className="max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600 text-gray-200 text-sm transition-all duration-300 ease-in-out">
                  <pre className="whitespace-pre-wrap break-words">{JSON.stringify(extensionData, null, 2)}</pre>
                </div>
              )}
            </div>
          </>
        )}

        {!error && !result && (
          <button
            className={`mt-4 w-full px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition-all duration-300 ease-in-out ${
              processing && "opacity-50 cursor-not-allowed"
            }`}
            onClick={processData}
            disabled={!extensionData || processing}
          >
            {processing ? "Processing..." : "Process Data"}
          </button>
        )}

        {result && (
          <div className="mt-6 bg-gray-700 p-4 rounded text-gray-200 transition-all duration-300 ease-in-out">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-red-400 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <h2 className="text-xl font-semibold text-red-400">AI Analysis</h2>
            </div>
            <div className="transition-all duration-300 ease-in-out">
              <pre
                className="whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{
                  __html: parseResult(typeof result === "string" ? result : JSON.stringify(result, null, 2)),
                }}
              ></pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExtensionHandler

