import React from 'react';

export const CronGuideContent: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100/25 dark:border-indigo-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Automation & Scheduling Standard</span>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            This developer-grade reference manual explains cron scheduling syntaxes, special characters, microsecond triggers, and container scheduling architectures.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        In the world of system administration and backend engineering, automated background operations are essential. From nightly database backups and system log rotations to periodic API polling and bulk newsletter dispatch pipelines, servers rely on precise temporal schedulers. The standard mechanism for configuring these triggers is **Cron**, a time-based job scheduler dating back to early Unix development. Understanding how to build, translate, and audit cron expressions is a core requirement for modern DevOps and cloud architects.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="cron-syntax">The Standard 5-Field Cron Expression Layout</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        A standard cron expression is a string of five (or sometimes six) whitespace-separated fields representing a schedule. The operating system's cron daemon continuously parses this sequence to determine if the current system timestamp matches the execution triggers.
      </p>
      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0c1019] border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200">
              <th className="p-3">Field Position</th>
              <th className="p-3">Temporal Unit</th>
              <th className="p-3">Allowed Integer Range</th>
              <th className="p-3">Special Wildcards Supported</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-slate-650 dark:text-slate-350">
            <tr>
              <td className="p-3 font-semibold">1</td>
              <td className="p-3 font-mono text-indigo-650 dark:text-indigo-400">Minute</td>
              <td className="p-3">0 – 59</td>
              <td className="p-3 font-mono">* , - /</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">2</td>
              <td className="p-3 font-mono text-indigo-650 dark:text-indigo-400">Hour</td>
              <td className="p-3">0 – 23</td>
              <td className="p-3 font-mono">* , - /</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">3</td>
              <td className="p-3 font-mono text-indigo-650 dark:text-indigo-400">Day of Month</td>
              <td className="p-3">1 – 31</td>
              <td className="p-3 font-mono">* , - / ? L W</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">4</td>
              <td className="p-3 font-mono text-indigo-650 dark:text-indigo-400">Month</td>
              <td className="p-3">1 – 12 (or JAN–DEC)</td>
              <td className="p-3 font-mono">* , - /</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">5</td>
              <td className="p-3 font-mono text-indigo-650 dark:text-indigo-400">Day of Week</td>
              <td className="p-3">0 – 6 (or SUN–SAT)</td>
              <td className="p-3 font-mono">* , - / ? L #</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="cron-wildcards">Mastering Cron Special Syntax Characters</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To construct complex intervals (such as "every 15 minutes during work hours" or "on the last weekday of the month"), cron supports specialized algebraic wildcards:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>Asterisk (<code>*</code>):</strong> Represents all values. An asterisk in the Hour field means "trigger every hour."</li>
        <li><strong>Comma (<code>,</code>):</strong> Defines a list of explicit values. For example, <code>1,3,5</code> in the Day of Week field matches Monday, Wednesday, and Friday.</li>
        <li><strong>Hyphen (<code>-</code>):</strong> Specifies a contiguous range of values. For example, <code>9-17</code> in the Hour field matches every hour between 9:00 AM and 5:00 PM.</li>
        <li><strong>Slash (<code>/</code>):</strong> Denotes step-increments. For example, <code>*/15</code> in the Minute field triggers execution every 15 minutes.</li>
        <li><strong>Question Mark (<code>?</code>):</strong> Specifies no specific value, used exclusively when separating the Day of Month and Day of Week fields to prevent coordinate clashes.</li>
        <li><strong>Last (<code>L</code>):</strong> Matches the last possible value (e.g., last day of the month or last Friday).</li>
      </ul>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="cloud-triggers">Cloud Task Orchestration vs. Local Crontabs</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Historically, developers configured cron scripts directly on Linux servers via the <code>crontab -e</code> system utility. While highly efficient for single machines, local crontabs are highly problematic in modern cloud architectures:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>Single Point of Failure:</strong> If the underlying server crashes, your scheduled tasks fail silently.</li>
        <li><strong>Auto-Scaling Conflicts:</strong> If your application scales horizontally to 5 container instances, a local crontab will trigger the scheduled task 5 times simultaneously, potentially corrupting database transactions.</li>
        <li><strong>State Blindness:</strong> Local cron has no built-in mechanism to retry failed tasks, aggregate execution logs, or alert administrators.</li>
      </ul>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        To solve this, modern cloud ecosystems (like AWS EventBridge, Google Cloud Scheduler, or Azure Logic Apps) offer **serverless, cluster-wide schedulers**. These distributed platforms manage cron triggers externally, firing secure HTTP webhooks, pub/sub topics, or queuing tasks safely without causing concurrency overlaps.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        Our browser-native <a href="/tools/cron-builder" className="text-indigo-650 dark:text-indigo-400 font-semibold hover:underline">Cron Expression Builder</a> translates complicated cron rows into plain-text human phrases instantly, ensuring your cloud automations trigger exactly when intended.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      <div className="space-y-4 my-6">
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: What is the difference between a 5-field and 6-field cron expression?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Standard Unix systems use 5 fields (Minute through Day of Week). Some enterprise schedulers (like Quartz Scheduler or Spring framework) support 6 fields by appending a leading **Seconds** field, or a trailing **Year** field, allowing sub-minute scheduling precision.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: How do timezone changes affect cron execution schedules?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Standard server cron daemons evaluate schedules against the server's local system time. In modern cloud containers, it is critical to configure all servers to **Coordinated Universal Time (UTC)**. This prevents tasks from triggering twice or skipping entirely during Daylight Saving Time (DST) changes.
          </p>
        </div>
      </div>
    </>
  );
};
