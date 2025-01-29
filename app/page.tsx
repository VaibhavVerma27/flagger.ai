/* eslint-disable */

"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative bg-gray-900 text-gray-200 min-h-screen">
      {/* Header */}
      <header className="py-10 px-4 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-red-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AI Terms Analyzer
        </motion.h1>
        <motion.p
          className="mt-4 text-red-400 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Analyze and simplify website terms and conditions effortlessly with cutting-edge AI.
        </motion.p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-16 px-6 space-y-20">
        {/* Hero Section */}
        <motion.section
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-red-500">
            Simplifying Complexity
          </h2>
          <p className="text-red-300 max-w-3xl mx-auto">
            Leverage AI to identify risks, decode unclear terms, and empower users with transparency.
          </p>
        </motion.section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Analyze Instantly",
              icon: "⚡",
              description: "Highlight potential issues in terms and privacy policies.",
            },
            {
              title: "Protect Your Data",
              icon: "🔒",
              description: "Identify how your data is handled securely.",
            },
            {
              title: "Easy to Use",
              icon: "✨",
              description: "Quick analysis with a user-friendly browser extension.",
            },
            {
              title: "Fast & Reliable",
              icon: "🚀",
              description: "Accurate results powered by state-of-the-art AI.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg shadow-lg bg-gray-800 hover:bg-gray-700 transition-transform hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 1 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-gray-900">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-red-400">{feature.title}</h3>
              </div>
              <p className="mt-4 text-red-300">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6">
          <motion.button
            className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg bg-red-500 text-gray-900 hover:bg-red-600 hover:scale-105 transition-transform"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
          <motion.a
            href="/download-extension"
            className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg bg-gray-800 text-red-400 hover:bg-gray-700 hover:scale-105 transition-transform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Download Web Extension
          </motion.a>
        </section>
      </main>

      {/* Floating animations */}
      <motion.div
        className="absolute bottom-10 left-10 w-16 h-16 bg-red-500 rounded-full opacity-25"
        animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />
      <motion.div
        className="absolute top-20 right-20 w-24 h-24 bg-red-500 rounded-full opacity-25"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
      />
    </div>
  );
}
