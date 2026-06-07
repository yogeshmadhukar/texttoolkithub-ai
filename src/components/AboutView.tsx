import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Cpu, Heart, Code2, Users, Flame } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      
      {/* Dynamic Glow blobs */}
      <div className="glow-accent top-12 left-10"></div>
      <div className="glow-accent top-96 right-20"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Intro Mission Banner */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 py-1 px-3.5 bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold font-sans uppercase tracking-widest rounded-full mb-4 border border-indigo-100 dark:border-indigo-950"
          >
            <Users className="w-3.5 h-3.5" /> Driven by Privacy
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white sm:text-5xl"
            id="about-title"
          >
            Empowering Writers, Coders, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-300 animate-pulse">and Daily Content Creators</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            TextToolkitHub was built out of a simple, modern necessity: having a highly professional <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">text utility toolkit and dynamic string tools</a> that does not inspect, transmit, or monetize your private documents. Let’s clean the internet together.
          </motion.p>
        </div>

        {/* Pillars Segment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-950 shadow-sm">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-slate-800 dark:text-slate-100">100% Local Sandboxing</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Every space trim, case shift, or word analysis happens locally in memory. We do not maintain databases to monitor your inputs, paste buffers, or analytics templates. 
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-950 shadow-sm">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-slate-800 dark:text-slate-100">GPU-Accelerated Client Performance</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              By using modern JavaScript engine routines and client hooks, we bypass the round-trip delay of cloud network APIs. Get live metrics on millions of words in less than 5 milliseconds!
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-950 shadow-sm">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-2xl w-fit mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-slate-800 dark:text-slate-100">Zero Commercial Advertisements</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              We stand firmly against low-grade web utility patterns loaded with intrusive display banners. TextToolkitHub runs completely clean, ensuring a workspace that keeps you focused.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-950 shadow-sm">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl w-fit mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-slate-800 dark:text-slate-100">Open & Dedicated Standards</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Compatible across all mobile layouts, iPads, and standard desktop screens. Our <a href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Free Text & String Utilities</a> suite will always keep its core text tools free, forever.
            </p>
          </div>

        </div>

        {/* Tech Stack Segment */}
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 mb-4 font-sans font-bold text-sm">
            <Flame className="w-4.5 h-4.5" /> High-Performance Stack Framework
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">Under the Hood Architecture</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
            Engineered using the absolute standards of modern front-end layout development. No bloat.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-xl">React 19 + Vite</span>
            <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-xl">TypeScript Type Safety</span>
            <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-xl">Tailwind CSS v4 Utility</span>
            <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-xl">Motion Animation API</span>
          </div>
        </div>

        {/* SEO Internal Linking / Directory Segment */}
        <div className="mt-12 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 bg-slate-50 dark:bg-slate-950/20 text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans mb-4">
            Explore Free Online Text Utilities & Tools
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Looking for specific text formatting, analysis, or converter solutions? Jump straight into our highly popular tools directly from this portal to execute private character operations instantly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="/" className="flex flex-col p-4 border border-slate-250 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-900/50 rounded-2xl bg-white dark:bg-slate-950 transition group text-left shadow-sm">
              <span className="text-xs font-sans uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">Homepage</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 hover:underline group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Text Utility Portal Home
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Our main directory of 100% private digital utilities with offline processing.
              </p>
            </a>

            <a href="/word-counter" className="flex flex-col p-4 border border-slate-250 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-900/50 rounded-2xl bg-white dark:bg-slate-950 transition group text-left shadow-sm">
              <span className="text-xs font-sans uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">Analysis</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 hover:underline group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Word & Character Counter
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Analyze words, sentences, syllables, reading speeds, and density stats locally.
              </p>
            </a>

            <a href="/text-compare" className="flex flex-col p-4 border border-slate-250 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-900/50 rounded-2xl bg-white dark:bg-slate-950 transition group text-left shadow-sm">
              <span className="text-xs font-sans uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">Comparison</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 hover:underline group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Text Difference Checker
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Compare side-by-side files or paste text blocks and highlight code differences.
              </p>
            </a>
          </div>
          
          <div className="mt-6 text-center">
            <a href="/tools" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
              Browse full portfolio in the Text Tools Directory &rarr;
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
