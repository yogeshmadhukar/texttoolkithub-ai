export interface GrammarIssue {
  id: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'capitalization';
  offset: number;
  length: number;
  original: string;
  correction: string;
  explanation: string;
}

// Map of common spelling mistakes (Case-insensitive check)
const SPELLING_DICTIONARY: Record<string, { correction: string; explanation: string }> = {
  'teh': { correction: 'the', explanation: 'Common typo for the word "the".' },
  'recieve': { correction: 'receive', explanation: 'Misspelled "receive". Remember: "i before e except after c".' },
  'seperate': { correction: 'separate', explanation: 'Misspelled "separate". Remember it contains the word "para" in the middle.' },
  'accomodate': { correction: 'accommodate', explanation: 'Misspelled "accommodate". It requires a double "c" and double "m".' },
  'untill': { correction: 'until', explanation: 'Misspelled "until". The modern spelling has a single "l".' },
  'truely': { correction: 'truly', explanation: 'Misspelled "truly". The silent "e" is dropped.' },
  'definately': { correction: 'definitely', explanation: 'Misspelled "definitely". Derived from "finite", it has an "i" in the middle, not an "a".' },
  'goverment': { correction: 'government', explanation: 'Misspelled "government". Remember the silent "n" from the verb "govern".' },
  'occured': { correction: 'occurred', explanation: 'Misspelled "occurred". Needs a double "r".' },
  'occurrence': { correction: 'occurrence', explanation: 'Misspelled "occurrence". Needs double "c" and double "r".' },
  'publically': { correction: 'publicly', explanation: 'Misspelled "publicly". The adverb is formed directly as publicly.' },
  'writting': { correction: 'writing', explanation: 'Misspelled "writing". Derived from "write", it contains a single "t".' },
  'comming': { correction: 'coming', explanation: 'Misspelled "coming". Only has a single "m".' },
  'dissapoint': { correction: 'disappoint', explanation: 'Misspelled "disappoint". One "s" and two "p"s.' },
  'embarass': { correction: 'embarrass', explanation: 'Misspelled "embarrass". Needs double "r" and double "s".' },
  'freind': { correction: 'friend', explanation: 'Misspelled "friend". Remember: "i before e".' },
  'grammer': { correction: 'grammar', explanation: 'Misspelled "grammar". Ends with an "ar" instead of an "er".' },
  'wierd': { correction: 'weird', explanation: 'Misspelled "weird". Exception to the "i before e" rule.' },
  'tommorow': { correction: 'tomorrow', explanation: 'Misspelled "tomorrow". One "m", double "r".' },
  'belive': { correction: 'believe', explanation: 'Misspelled "believe". Remember: "ie".' },
  'immediatly': { correction: 'immediately', explanation: 'Misspelled "immediately". Retain the silent "e".' },
  'sincerly': { correction: 'sincerely', explanation: 'Misspelled "sincerely". Retain the silent "e".' },
  'basicly': { correction: 'basically', explanation: 'Misspelled "basically". Remember the suffix "-ally".' },
  'refering': { correction: 'referring', explanation: 'Misspelled "referring". Keep the double "r" when adding suffix.' },
  'weather': { correction: 'whether', explanation: 'Double check: "whether" is used for conditionals/alternatives; "weather" is for climate.' },
  'calender': { correction: 'calendar', explanation: 'Misspelled "calendar". Ends in "ar".' },
  'arguement': { correction: 'argument', explanation: 'Misspelled "argument". The silent "e" is dropped.' },
  'colum': { correction: 'column', explanation: 'Misspelled "column". Remember the silent "n" at the end.' },
  'beautiful': { correction: 'beautiful', explanation: 'Misspelled "beautiful". Starts with "beau-".' },
  'beatiful': { correction: 'beautiful', explanation: 'Misspelled "beautiful".' },
  'aquires': { correction: 'acquires', explanation: 'Misspelled "acquires". Needs a "c".' },
  'aquire': { correction: 'acquire', explanation: 'Misspelled "acquire". Needs a "c".' },
  'rythm': { correction: 'rhythm', explanation: 'Misspelled "rhythm". Needs "h" after "r" and "t".' },
  'foriegn': { correction: 'foreign', explanation: 'Misspelled "foreign". Exception to "i before e".' },
  'nieghbor': { correction: 'neighbor', explanation: 'Misspelled "neighbor".' },
  'persistant': { correction: 'persistent', explanation: 'Misspelled "persistent". Ends with "-ent", not "-ant".' },
  'independant': { correction: 'independent', explanation: 'Misspelled "independent". Ends with "-ent", not "-ant".' },
  'existance': { correction: 'existence', explanation: 'Misspelled "existence". Ends with "-ence".' },
  'proccess': { correction: 'process', explanation: 'Misspelled "process". Only has one "c".' },
  'uforia': { correction: 'euphoria', explanation: 'Misspelled "euphoria" phonetically.' },
  'suprise': { correction: 'surprise', explanation: 'Misspelled "surprise". Remember the first silent "r".' }
};

// Days of the week & Months for capitalization check
const DAYS_AND_MONTHS = new Set([
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
]);

export function analyzeGrammar(text: string): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  if (!text) return [];

  let idCounter = 1;

  const addIssue = (type: GrammarIssue['type'], offset: number, length: number, original: string, correction: string, explanation: string) => {
    issues.push({
      id: `${type}-${idCounter++}`,
      type,
      offset,
      length,
      original,
      correction,
      explanation
    });
  };

  // --- Rule 1: Double spacing or excess spacing ---
  const doubleSpaceRegex = /[ ]{2,}/g;
  let match;
  while ((match = doubleSpaceRegex.exec(text)) !== null) {
    addIssue(
      'punctuation',
      match.index,
      match[0].length,
      match[0],
      ' ',
      'Multiple spaces detected. Use a single space between words.'
    );
  }

  // --- Rule 2: Duplicate punctuation (e.g., ,, or ?? or !!) ---
  const dupPunctRegex = /([,!?;:])\1+/g;
  while ((match = dupPunctRegex.exec(text)) !== null) {
    addIssue(
      'punctuation',
      match.index,
      match[0].length,
      match[0],
      match[1],
      `Duplicate punctuation "${match[0][0]}" detected.`
    );
  }

  // --- Rule 3: Spaces before punctuation (e.g. "word , ") ---
  const spaceBeforePunct = /(\s+)([.,!?;:])/g;
  while ((match = spaceBeforePunct.exec(text)) !== null) {
    addIssue(
      'punctuation',
      match.index,
      match[0].length,
      match[0],
      match[2],
      `Unnecessary space before a punctuation mark "${match[2]}".`
    );
  }

  // --- Rule 4: Capitalize the start of sentences ---
  // A sentence starts at head, or after . ! ? followed by space/newlines
  const sentenceRegex = /(?:^|[.!?]\s+)([a-z])/g;
  while ((match = sentenceRegex.exec(text)) !== null) {
    const matchedStr = match[0];
    const letter = match[1];
    const letterOffset = match.index + matchedStr.length - 1;
    
    // Safety checks: make sure we are not inside a URL or decimal number or file path
    let isInsideUrlOrFilePath = false;
    if (letterOffset > 0) {
      // Look back for website or file pattern like web.archive, logo.svg, etc.
      const lookback = text.substring(Math.max(0, letterOffset - 25), letterOffset);
      if (/[a-zA-Z0-0]\.[a-zA-Z]{2,4}$/.test(lookback) || /https?:\/\//.test(lookback)) {
        isInsideUrlOrFilePath = true;
      }
    }
    
    if (!isInsideUrlOrFilePath) {
      addIssue(
        'capitalization',
        letterOffset,
        1,
        letter,
        letter.toUpperCase(),
        'The first letter of a sentence must be capitalized.'
      );
    }
  }

  // --- Rule 5: Individual word checks (Spelling, Pronoun "I", Days/Months, Grammar) ---
  // We can tokenize by words, keeping track of their exact offset
  const wordRegex = /\b[a-zA-Z'-]+\b/g;
  while ((match = wordRegex.exec(text)) !== null) {
    const originalWord = match[0];
    const LowerWord = originalWord.toLowerCase();
    const offset = match.index;
    const length = originalWord.length;

    // A. Pronoun 'i' alone
    if (originalWord === 'i') {
      addIssue(
        'capitalization',
        offset,
        length,
        originalWord,
        'I',
        'The first-person singular pronoun "I" must always be capitalized.'
      );
      continue;
    }

    // B. Days & Months capitalization
    if (DAYS_AND_MONTHS.has(LowerWord)) {
      if (originalWord[0] !== originalWord[0].toUpperCase()) {
        const correctCapitalized = originalWord[0].toUpperCase() + originalWord.substring(1);
        addIssue(
          'capitalization',
          offset,
          length,
          originalWord,
          correctCapitalized,
          `The name of a day or month "${originalWord}" must be capitalized.`
        );
      }
    }

    // C. Common Spelling check
    if (SPELLING_DICTIONARY[LowerWord]) {
      const entry = SPELLING_DICTIONARY[LowerWord];
      // Keep case-sensitive preservation if possible
      let corrected = entry.correction;
      if (originalWord[0] === originalWord[0].toUpperCase()) {
        corrected = corrected[0].toUpperCase() + corrected.substring(1);
      }
      addIssue(
        'spelling',
        offset,
        length,
        originalWord,
        corrected,
        entry.explanation
      );
    }
  }

  // --- Rule 6: Contextual grammatical patterns & spelling combinations ---
  // A. Vowel prefix "a" vs "an"
  // If "a" is followed by a whitespace and a word starting with vowel sound
  const aPrefixRegex = /\b(a)\s+([aeioAEIO]\w*)\b/g;
  while ((match = aPrefixRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const article = match[1];
    const nextWord = match[2].toLowerCase();
    
    // Exclude certain consonant sounds starting with vowels like "union", "university", "one"
    if (!nextWord.startsWith('uni') && !nextWord.startsWith('one') && !nextWord.startsWith('eu')) {
      addIssue(
        'grammar',
        match.index,
        article.length,
        article,
        'an',
        `Use "an" instead of "a" before words starting with a vowel sound (e.g., "${match[2]}").`
      );
    }
  }

  // B. Consonant prefix "an" vs "a"
  // If "an" is followed by a whitespace and a word starting with consonant sound
  const anPrefixRegex = /\b(an)\s+([bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]\w*)\b/g;
  while ((match = anPrefixRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const article = match[1];
    const nextWord = match[2].toLowerCase();
    
    // Exclude words starting with silent 'h' like hour, honest, honor
    if (!nextWord.startsWith('hour') && !nextWord.startsWith('honest') && !nextWord.startsWith('honor')) {
      addIssue(
        'grammar',
        match.index,
        article.length,
        article,
        'a',
        `Use "a" instead of "an" before words starting with a consonant sound (e.g., "${match[2]}").`
      );
    }
  }

  // C. Pronoun subject-verb combinations (e.g., "he have", "I has", "she do not")
  const subjectVerbRules = [
    { regex: /\b(he|she|it)\s+(have)\b/gi, errGroupIdx: 2, correct: 'has', explanation: 'Singular third-person pronoun takes "has", not "have".' },
    { regex: /\b(I|we|they|you)\s+(has)\b/gi, errGroupIdx: 2, correct: 'have', explanation: 'Plural pronouns or first/second person takes "have", not "has".' },
    { regex: /\b(he|she|it)\s+(do\s+not|dont)\b/gi, errGroupIdx: 2, correct: 'does not', explanation: 'Singular third-person takes "does not", not "do not".' },
    { regex: /\b(I|we|they|you)\s+(does\s+not|doesn't)\b/gi, errGroupIdx: 2, correct: 'do not', explanation: 'Plural pronouns or first/second person takes "do not", not "does not".' },
    { regex: /\b(your)\s+welcome\b/gi, errGroupIdx: 1, correct: "you're", explanation: 'Conflating "your" (possessive) and contraction "you\'re" (you are welcome).' },
    { regex: /\b(your)\s+(beautiful|correct|right|going)\b/gi, errGroupIdx: 1, correct: "you're", explanation: 'Use contraction "you\'re" (you are) instead of possessive "your" before an adjective or participle.' },
    { regex: /\b(you're)\s+(car|house|book|dog|laptop|phone)\b/gi, errGroupIdx: 1, correct: 'your', explanation: 'Use possessive "your" instead of contraction "you\'re" before a noun.' },
    { regex: /\b(its)\s+(a\s+beautiful|important|necessary|crucial|going)\b/gi, errGroupIdx: 1, correct: "it's", explanation: 'Use contraction "it\'s" (it is) instead of possessive "its".' },
    { regex: /\b(it's)\s+(color|tail|size|pacing|shape|speed)\b/gi, errGroupIdx: 1, correct: 'its', explanation: 'Use possessive pronoun "its" instead of contraction "it\'s" (it is) before properties/nouns.' },
    { regex: /\b(there)\s+(book|books|car|house|mind|opinion)\b/gi, errGroupIdx: 1, correct: 'their', explanation: 'Use possessive "their" instead of location-adverb "there" to indicate ownership.' },
    { regex: /\b(their)\s+(is|are|was|were)\b/gi, errGroupIdx: 1, correct: 'there', explanation: 'Use "there" (existential pronoun) instead of possessive "their".' },
    { regex: /\bmore\s+(then)\b/gi, errGroupIdx: 1, correct: 'than', explanation: 'Use "than" for comparisons, not "then" (which refers to time).' }
  ];

  subjectVerbRules.forEach(({ regex, errGroupIdx, correct, explanation }) => {
    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0];
      const errWord = match[errGroupIdx];
      if (!errWord) {
        continue;
      }

      // Safe, relative calculation of the offset of the erroneous word inside fullMatch
      const insideMatchOffset = fullMatch.indexOf(errWord);
      if (insideMatchOffset === -1) {
        continue;
      }

      const targetOffset = match.index + insideMatchOffset;

      addIssue(
        'grammar',
        targetOffset,
        errWord.length,
        errWord,
        correct,
        explanation
      );
    }
  });

  // Sort issues by offset so they align chronologically with the content
  return issues.sort((a, b) => a.offset - b.offset);
}

export function getCorrectedText(text: string, issues: GrammarIssue[]): string {
  if (!text || issues.length === 0) return text;
  
  let corrected = '';
  let lastIndex = 0;
  
  // Sort copies of issues ascending by offset to prevent cross-cutting
  const sortedIssues = [...issues].sort((a, b) => a.offset - b.offset);
  
  for (const issue of sortedIssues) {
    // If there's an index offset overlap from previous loop adjustments, bypass
    if (issue.offset < lastIndex) {
      continue;
    }
    corrected += text.substring(lastIndex, issue.offset);
    corrected += issue.correction;
    lastIndex = issue.offset + issue.length;
  }
  
  if (lastIndex < text.length) {
    corrected += text.substring(lastIndex);
  }
  
  return corrected;
}

