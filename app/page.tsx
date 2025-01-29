"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Bot } from "lucide-react"

const ExtensionHandler = () => {
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
        <motion.div
          className="flex space-x-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-6">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-red-500 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Extension Data Analyzer
      </motion.h1>
      <motion.div
        className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {error ? (
          <motion.p
            className="text-red-500 text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {error}
          </motion.p>
        ) : (
          <>
            <motion.div
              initial={false}
              animate={{ height: isExtensionDataVisible ? "auto" : "40px" }}
              className="overflow-hidden"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsExtensionDataVisible(!isExtensionDataVisible)}
              >
                <h2 className="text-2xl font-semibold text-red-400 mb-4">Extension Data</h2>
                {isExtensionDataVisible ? (
                  <ChevronUp className="text-red-400" />
                ) : (
                  <ChevronDown className="text-red-400" />
                )}
              </div>
              <AnimatePresence>
                {isExtensionDataVisible && extensionData && (
                  <motion.div
                    className="max-h-96 overflow-y-auto bg-gray-700 p-4 rounded border border-gray-600 text-gray-200 text-sm"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <pre className="whitespace-pre-wrap break-words">{JSON.stringify(extensionData, null, 2)}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {!error && !result && (
          <motion.button
            className={`mt-4 w-full px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition ${
              processing && "opacity-50 cursor-not-allowed"
            }`}
            onClick={processData}
            disabled={!extensionData || processing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {processing ? "Processing..." : "Process Data"}
          </motion.button>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              className="mt-6 bg-gray-700 p-4 rounded text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <Bot className="text-red-400 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-red-400">AI Analysis</h2>
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                <pre
                  className="whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{
                    __html: parseResult(typeof result === "string" ? result : JSON.stringify(result, null, 2)),
                  }}
                ></pre>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ExtensionHandler

