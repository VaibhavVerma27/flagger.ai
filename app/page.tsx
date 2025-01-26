"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [hover, setHover] = useState(false);

  return (
    <div className="bg-gray-900 text-white min-h-screen overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-20 pointer-events-none animate-pulse"></div>

      <header className="py-6 px-4 text-center bg-gray-800 shadow-xl relative z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-teal-400"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI Terms Analyzer
        </motion.h1>
        <motion.p
          className="mt-2 text-gray-300 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Analyze and understand website terms and conditions effortlessly.
        </motion.p>
      </header>

      <main className="container mx-auto py-10 px-4 space-y-20 relative z-10">
        {/* Hero Section */}
        <motion.section
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="/hero-image.svg"
            alt="AI analyzing terms"
            className="mx-auto w-3/4 md:w-1/2"
            whileHover={{ scale: 1.05 }}
          />
          <h2 className="text-3xl md:text-4xl font-bold text-teal-300">
            Simplifying the Complex
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Using state-of-the-art AI, we analyze terms and conditions of websites to
            identify security risks, unclear language, and data vulnerabilities.
          </p>
        </motion.section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Analyze Terms Instantly", color: "bg-green-500", icon: "✓", description: "Our system scans terms and conditions to highlight potential issues, from unclear clauses to privacy risks." },
            { title: "Protect Your Data", color: "bg-orange-500", icon: "!", description: "Understand how your data is handled and identify any red flags in privacy policies." },
            { title: "Easy to Use", color: "bg-blue-500", icon: "🔍", description: "With our simple browser extension, checking terms and conditions is just one click away." },
            { title: "Fast and Reliable", color: "bg-yellow-500", icon: "⚡", description: "Our AI-powered tool provides quick and accurate results, saving you time and effort." }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-black font-bold text-lg">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-4 text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center mt-10 space-y-6">
          <motion.button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`px-8 py-4 text-lg font-semibold rounded-full shadow-lg transition-all ${
              hover ? "bg-teal-600" : "bg-teal-500"
            } text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>

          <motion.a
            href="/download-extension"
            className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg bg-gray-700 text-white inline-block hover:bg-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Download Web Extension
          </motion.a>
        </section>
      </main>

      {/* Bottom Section with Matching Background */}
      <section className="bg-gray-800 text-center py-12">
        <motion.h2
          className="text-2xl md:text-3xl font-semibold text-teal-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Stay Updated
        </motion.h2>
        <motion.p
          className="text-gray-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Join our newsletter for the latest updates on AI, privacy policies, and website security.
        </motion.p>
      </section>

      {/* Floating animation with smoother, non-distracting effect */}
      <motion.div
        className="absolute bottom-10 left-10 w-24 h-24 bg-teal-600 rounded-full opacity-30"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-teal-700 rounded-full opacity-30"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
      />
    </div>
  );
}
