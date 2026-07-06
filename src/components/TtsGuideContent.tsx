import React from 'react';

export const TtsGuideContent: React.FC = () => {
  return (
    <>
      {/* Premium Badge / Introduction Section */}
      <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-100/25 dark:border-emerald-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Premium Audio &amp; Linguistics Resource</span>
          <p className="text-xs text-slate-555 dark:text-slate-400 leading-relaxed">
            This comprehensive architectural guide covers Text-to-Speech (TTS) synthesis pipelines, Speech Synthesis Markup Language (SSML), and the browser-native Web Speech API. Gain insights into phoneme mapping, intonation control, and building high-performance voice outputs.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        Text-to-Speech (TTS) technologies bridge the gap between written content and auditory consumption. It is an essential component of modern accessibility structures, hands-free automation utilities, and responsive screen-reading interfaces.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-4">
        Despite its widespread availability in modern operating systems and mobile devices, deploying TTS systems programmatically poses several hidden hurdles. From coordinating asynchronous audio stream events to custom phonetics management and managing device-dependent voice profiles, engineers must navigate complex client interfaces to maintain consistent user experiences.
      </p>

      {/* SECTION 1: THE TTS PIPELINE */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="synthesis-pipeline">The Auditory Synthesis Pipeline</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Converting plain text characters into natural-sounding acoustic waveforms happens in two main functional steps inside high-performance speech engines:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 flex items-center justify-center font-bold text-xs">1</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">The Text-to-Phoneme Layer (Front-End)</h4>
          </div>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            The front-end parses raw character inputs to resolve abbreviations, normalize numbers, and map words to phonemes (linguistic representations of speech sounds). For example, it translates the string <code className="font-mono">"Dr. Smith lives on Baker Dr."</code> into distinct pronunciations for <code className="font-mono">"Doctor"</code> and <code className="font-mono">"Drive"</code> based on grammatical context.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 flex items-center justify-center font-bold text-xs">2</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">The Waveform Synthesis Layer (Back-End)</h4>
          </div>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            The back-end maps the parsed sequence of phonemes into acoustic parameters. It modulates pitch, intonation, and duration, passing the data to a vocal synthesizer or a deep neural vocoder to generate a high-fidelity digital audio stream.
          </p>
        </div>
      </div>

      {/* SECTION 2: SSML INTRODUCTION */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="ssml">Speech Synthesis Markup Language (SSML)</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To direct synthetic voices with professional precision, engines support **Speech Synthesis Markup Language (SSML)**—an XML-based protocol. SSML allows you to embed markers to modify pitch, insert pauses, define phonetic pronunciations, and style speech traits:
      </p>

      <div className="bg-slate-50 dark:bg-[#0c1019] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 my-6 space-y-2">
        <div>&lt;speak&gt;</div>
        <div className="pl-4">{"Hello! <break time=\"1s\"/> My name is John."}</div>
        <div className="pl-4">{"I want to say <prosody pitch=\"+15%\" rate=\"slow\">something exciting</prosody>!"}</div>
        <div>&lt;/speak&gt;</div>
      </div>

      {/* SECTION 3: WEB SPEECH API */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="web-speech-api">Building with Browser-Native Web Speech APIs</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Modern desktop and mobile browsers feature a built-in vocalizer called the `SpeechSynthesis` API. It does not require any external server dependencies or expensive subscription plans, processing audio entirely inside the client sandbox:
      </p>

      <div className="bg-slate-50 dark:bg-[#0c1019] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 my-6 space-y-3">
        <div className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1.5 text-slate-900 dark:text-white">
          Client-Side Web Speech API Boilerplate
        </div>
        <div>
          <span className="text-emerald-650 dark:text-emerald-400 font-bold">1. Initialize the Utterance:</span>
          <br />
          <code className="bg-slate-100 dark:bg-slate-900/50 px-1.5 py-0.5 rounded">const utterance = new SpeechSynthesisUtterance("Hello world");</code>
        </div>
        <div>
          <span className="text-emerald-650 dark:text-emerald-400 font-bold">2. Fine-Tune Parameters:</span>
          <br />
          <code className="bg-slate-100 dark:bg-slate-900/50 px-1.5 py-0.5 rounded">utterance.pitch = 1.0; utterance.rate = 1.0; utterance.volume = 0.8;</code>
        </div>
        <div>
          <span className="text-emerald-650 dark:text-emerald-400 font-bold">3. Execute Voice playback:</span>
          <br />
          <code className="bg-slate-100 dark:bg-slate-900/50 px-1.5 py-0.5 rounded">window.speechSynthesis.speak(utterance);</code>
        </div>
      </div>

      {/* SECTION 4: FAQS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      
      <div className="space-y-4 my-6">
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Why do the available voices change depending on which browser or device I use?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: The browser-native `SpeechSynthesis` API relies on voice profiles installed directly on the underlying operating system (e.g., Siri voices on macOS/iOS, SAPI voices on Windows, or Google Cloud-derived voices on Android and Chrome). If you require identical voices across all platforms, you must integrate an external API like Google Cloud TTS or ElevenLabs.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: How can I prevent voices from freezing in Chrome when speaking long texts?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: A known chromium bug occasionally stops speaking long text runs silently around the 15-second mark. To prevent this, actively split your input text string into shorter chunks (by sentence boundaries or punctuation marks) and queue them as individual speech utterances sequentially.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 md:p-8 rounded-2xl text-center space-y-4 my-8">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Summary: Integrating Conversational Audio Layer</h3>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Speech adds a powerful dimension of immersion and utility to web workflows. By mastering text parsing pipelines, employing SSML structures where supported, splitting longer passages to avoid browser-level buffer overflows, and matching appropriate system profiles, you can construct outstanding auditory assets.
        </p>
      </div>
    </>
  );
};
