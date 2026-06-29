export type InterviewOption = { text: string; quip: string; score: number };
export type InterviewQ = { prompt: string; options: InterviewOption[] };

export const INTERVIEW_QS: InterviewQ[] = [
  {
    prompt: "What's your biggest weakness?",
    options: [
      { text: "I just work too hard.", quip: "A bold classic. The panel nods approvingly.", score: 10 },
      { text: "I'm a perfectionist.", quip: "They've heard it 400 times today, but okay.", score: 7 },
      { text: "Honestly? Mondays.", quip: "Refreshingly honest. Possibly disqualifying.", score: 4 },
      { text: "I don't have weaknesses.", quip: "Confidence: maximum. Self-awareness: zero.", score: 6 },
    ],
  },
  {
    prompt: "Where do you see yourself in 5 years?",
    options: [
      { text: "In your chair, respectfully.", quip: "The hiring manager shifts uncomfortably.", score: 9 },
      { text: "Still applying, probably.", quip: "Too real. The room goes quiet.", score: 3 },
      { text: "Leading a team of rockstars.", quip: "Buzzword bingo: one line from a win.", score: 8 },
      { text: "On a beach. With your equity.", quip: "Ambitious. They love ambition. Maybe.", score: 6 },
    ],
  },
  {
    prompt: "Why do you want to work here?",
    options: [
      { text: "Your mission deeply resonates with me.", quip: "You don't know their mission. They don't either.", score: 8 },
      { text: "The unlimited PTO I'll never use.", quip: "Honest. The recruiter winces.", score: 4 },
      { text: "I love synergy and free snacks.", quip: "You've cracked the code.", score: 9 },
      { text: "I need a job, Brad.", quip: "Brad respects the hustle. Slightly.", score: 5 },
    ],
  },
  {
    prompt: "Tell us about a time you failed.",
    options: [
      { text: "I once succeeded too quickly.", quip: "Not a failure, but bold framing.", score: 7 },
      { text: "This interview, possibly.", quip: "Meta. The panel chuckles nervously.", score: 6 },
      { text: "I trusted a 'we'll be in touch'.", quip: "Devastating. Accurate.", score: 5 },
      { text: "I'd rather not relive it.", quip: "Mysterious. They're intrigued.", score: 8 },
    ],
  },
];
