'use client'
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative bg-green-50 text-gray-800 min-h-screen overflow-hidden">
      {/* Background pattern with subtle animation */}
      <motion.div 
        className="absolute inset-0 bg-[url('/golf-pattern.svg')] opacity-5"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.05, 0.08, 0.05] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />

      {/* Header with improved animations */}
      <header className="py-10 px-4 text-center relative z-10 inset-y-28">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-green-700"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          Flagger.ai
        </motion.h1>
        <motion.p
          className="mt-4 text-green-600 text-lg max-w-2xl mx-auto font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.3,
            duration: 1,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          Analyze and simplify website terms and conditions effortlessly with cutting-edge AI.
        </motion.p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-16 px-6 space-y-20 relative z-10">
        {/* Hero Section with spring animation */}
        <motion.section
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
        </motion.section>

        {/* Features Section with staggered animations */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Analyze Instantly",
              icon: "🏌️",
              description: "Highlight potential issues in terms and privacy policies.",
            },
            {
              title: "Protect Your Data",
              icon: "🛡️",
              description: "Identify how your data is handled securely.",
            },
            {
              title: "Easy to Use",
              icon: "🎯",
              description: "Quick analysis with a user-friendly browser extension.",
            },
            {
              title: "Fast & Reliable",
              icon: "⛳",
              description: "Accurate results powered by state-of-the-art AI.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg shadow-lg bg-white hover:bg-green-100 transition-all duration-500"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.15,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-md"
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </motion.div>
                <h3 className="text-xl font-bold text-green-700">{feature.title}</h3>
              </div>
              <p className="mt-4 text-gray-600 font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </section>

      {/* Call to Action with hover animation and open source info */}
      <section className="text-center space-y-8">
        <motion.button
          className="px-8 py-4 text-lg font-bold rounded-full shadow-lg bg-white text-green-600"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "#f0fdf4",
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          Download Web Extension
        </motion.button>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <p className="text-green-600 font-medium">This is an open source project!</p>
          <div className="flex justify-center space-x-6">
            <motion.a
              href="https://github.com/VaibhavVerma27/flagger-webextension"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-800 underline font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Web Extension Repo
            </motion.a>
            <motion.a
              href="https://github.com/VaibhavVerma27/flagger.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-800 underline font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Website Repo
            </motion.a>
          </div>
        </motion.div>
      </section>
      </main>

      {/* Enhanced floating background elements */}
      <motion.div
        className="absolute bottom-10 left-10 w-16 h-16 bg-green-200 rounded-full opacity-25 blur-xl"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 5, 
          ease: "easeInOut" 
        }}
      />
      <motion.div
        className="absolute top-20 right-20 w-24 h-24 bg-green-200 rounded-full opacity-25 blur-xl"
        animate={{ 
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 7, 
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
      />
    </div>
  );
}