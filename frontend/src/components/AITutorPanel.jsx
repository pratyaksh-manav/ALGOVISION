import { useEffect, useRef, useState } from "react";
import { chatWithTutor, explainStep } from "../lib/api";

const promptLibrary = {
  default: ["What is this algorithm?", "Why is it useful?", "Give me a simple example", "Explain the time complexity"],
  stack: ["What is a stack?", "When should I use a stack?", "Explain push vs pop", "Why is stack O(1)?"],
  queue: ["What is a queue?", "When should I use a queue?", "Explain enqueue vs dequeue", "Why is queue O(1)?"],
  binarySearch: ["What is binary search?", "Why must the array be sorted?", "Explain O(log n)", "Give me a simple example"],
  bfs: ["What is BFS?", "Why does BFS use a queue?", "When is BFS useful?", "Give me a graph example"],
  dfs: ["What is DFS?", "Why does DFS use a stack/recursion?", "When is DFS useful?", "Give me a graph example"]
};

const buildSections = (content) => {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const labelled = lines
    .map((line) => {
      const match = line.match(/^([A-Za-z\s]+):\s*(.+)$/);
      return match ? { title: match[1], body: match[2] } : null;
    })
    .filter(Boolean);

  if (labelled.length >= 2) {
    return labelled;
  }

  return content
    .split(/(?<=[.?!])\s+(?=[A-Z])/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => ({
      title: index === 0 ? "Answer" : `Point ${index + 1}`,
      body: part
    }));
};

function AssistantMessage({ message, onSpeak, onStop, isSpeaking }) {
  const sections = buildSections(message.content);

  return (
    <div className="w-full rounded-[1.7rem] border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
          {message.source === "instant" ? "Step Guide" : message.source === "ollama" ? "AI Answer" : "System"}
        </div>
        <div
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            message.source === "ollama"
              ? "bg-emerald-100 text-emerald-700"
              : message.source === "instant"
                ? "bg-sky-100 text-sky-700"
                : "bg-amber-100 text-amber-700"
          }`}
        >
          {message.source}
        </div>
      </div>
      <div className="mb-3 flex justify-end">
        <button
          onClick={() => (isSpeaking ? onStop() : onSpeak(message.content))}
          aria-label={isSpeaking ? "Stop audio playback" : "Play audio for this answer"}
          title={isSpeaking ? "Stop audio" : "Play audio"}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            isSpeaking
              ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {isSpeaking ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M7 7h4v10H7zM13 7h4v10h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M14.5 4.5a1 1 0 0 1 1.7.7v13.6a1 1 0 0 1-1.7.7l-4.04-4.04H7a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3h3.46L14.5 4.5zm3.92 3.08a1 1 0 0 1 1.41 0A6.96 6.96 0 0 1 22 12a6.96 6.96 0 0 1-2.17 5.42 1 1 0 1 1-1.4-1.44A4.98 4.98 0 0 0 20 12a4.98 4.98 0 0 0-1.57-3.98 1 1 0 0 1-.01-1.44zm-2.83 2.82a1 1 0 0 1 1.4 0A3.02 3.02 0 0 1 18 12a3.02 3.02 0 0 1-1.01 2.6 1 1 0 0 1-1.39-1.44A1.04 1.04 0 0 0 16 12c0-.41-.14-.8-.4-1.16a1 1 0 0 1-.01-1.44z" />
            </svg>
          )}
        </button>
      </div>
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={`${section.title}-${index}`} className="rounded-[1.25rem] border border-slate-100 bg-slate-50/80 p-4">
            <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">{section.title}</div>
            <div className="mt-2 text-[15px] leading-7 text-slate-700">{section.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AITutorPanel({ algorithm, currentStep, steps }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Select an algorithm or run a step to get an AI-guided explanation.",
      source: "system"
    }
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ source: "system", error: null });
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speakingId, setSpeakingId] = useState(null);
  const speechRef = useRef(null);
  const quickPrompts = promptLibrary[algorithm.id] ?? promptLibrary.default;

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return undefined;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (!selectedVoice && availableVoices.length) {
        const englishVoice =
          availableVoices.find((voice) => /en/i.test(voice.lang) && /female|samantha|karen|moira/i.test(voice.name)) ||
          availableVoices.find((voice) => /en/i.test(voice.lang)) ||
          availableVoices[0];
        setSelectedVoice(englishVoice?.name ?? "");
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
  }, [algorithm.id, currentStep?.title]);

  useEffect(() => {
    const bootstrapExplanation = async () => {
      if (!currentStep) return;
      setLoading(true);
      try {
        const response = await explainStep({
          algorithmId: algorithm.id,
          currentStep,
          steps
        });
        setMessages([
          {
            role: "assistant",
            content: response.reply,
            source: response.source
          }
        ]);
        setStatus({ source: response.source, error: response.error ?? null });
      } finally {
        setLoading(false);
      }
    };

    bootstrapExplanation();
  }, [algorithm.id, currentStep, steps]);

  const sendQuestion = async (userAction, promptOverride) => {
    const outbound = (promptOverride ?? question).trim();
    if (!outbound && !userAction) return;
    if (outbound) {
      setMessages((current) => [...current, { role: "user", content: outbound }]);
    }
    setQuestion("");
    setLoading(true);
    try {
      const response = await chatWithTutor({
        algorithmId: algorithm.id,
        question: outbound,
        currentStep,
        steps,
        userAction
      });
      setMessages((current) => [...current, { role: "assistant", content: response.reply, source: response.source }]);
      setStatus({ source: response.source, error: response.error ?? null });
    } finally {
      setLoading(false);
    }
  };

  const mistakeAction = algorithm.id === "stack" ? "pop" : algorithm.id === "queue" ? "dequeue" : null;

  const speakMessage = (content, messageId) => {
    if (!("speechSynthesis" in window)) {
      setStatus((current) => ({
        ...current,
        error: "This browser does not support speech playback."
      }));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content.replace(/\n/g, ". "));
    const voice = voices.find((item) => item.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => {
      setSpeakingId(null);
      setStatus((current) => ({
        ...current,
        error: "Audio playback failed in the browser."
      }));
    };
    speechRef.current = utterance;
    setSpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  return (
    <aside className="glass-panel mesh-card sticky top-6 flex h-[960px] flex-col overflow-hidden self-start rounded-[2.3rem] p-6 2xl:h-[1020px]">
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">AI Tutor</p>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-3xl text-ink">Teacher Mode</h3>
          <div
            className={`rounded-full px-3.5 py-2 text-sm font-semibold ${
              status.source === "ollama"
                ? "bg-emerald-100 text-emerald-700"
                : status.source === "instant"
                  ? "bg-sky-100 text-sky-700"
                  : "bg-amber-100 text-amber-700"
            }`}
          >
            {status.source === "ollama"
              ? "Ollama chat"
              : status.source === "instant"
                ? "Instant step mode"
                : "Fallback mode"}
          </div>
        </div>
        {status.error && <p className="mt-2 text-sm text-amber-700">Ollama unavailable: {status.error}</p>}
      </div>
      <div className="mb-3 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Voice Teacher</div>
          {speakingId !== null && (
            <button
              onClick={stopSpeaking}
              className="rounded-full bg-rose-100 px-3.5 py-2 text-sm font-semibold text-rose-700"
            >
              Stop Speaking
            </button>
          )}
        </div>
        <select
          value={selectedVoice}
          onChange={(event) => setSelectedVoice(event.target.value)}
          className="w-full rounded-[1rem] border border-slate-200 bg-white px-3 py-3 text-[15px] text-slate-700 outline-none focus:border-sky"
        >
          {voices.length ? (
            voices.map((voice) => (
              <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))
          ) : (
            <option value="">Default browser voice</option>
          )}
        </select>
      </div>
      <div className="mb-3 rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
        Ask conceptual questions in chat. Step execution guidance updates instantly above.
      </div>
      <div className="mb-3 rounded-[1.6rem] border border-slate-200/80 bg-white/70 p-3">
        <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Current Step Snapshot</div>
        <div className="mt-2 rounded-[1.2rem] bg-slate-950 px-4 py-3 text-white">
          <div className="text-lg font-semibold">{currentStep?.title ?? "Ready"}</div>
          <div className="mt-2 text-[15px] leading-6 text-slate-300">{currentStep?.description ?? "Run a simulation to see the first step."}</div>
        </div>
      </div>
      <div className="mb-3">
        <div className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Quick Ask</div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendQuestion(null, prompt)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-sky hover:text-sky-700"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto rounded-[1.8rem] border border-slate-200/80 bg-white/65 p-5">
        {messages.map((message, index) => (
          message.role === "assistant" ? (
            <AssistantMessage
              key={`${message.role}-${index}`}
              message={message}
              onSpeak={(content) => speakMessage(content, index)}
              onStop={stopSpeaking}
              isSpeaking={speakingId === index}
            />
          ) : (
            <div
              key={`${message.role}-${index}`}
              className="ml-auto w-full rounded-[1.6rem] bg-[linear-gradient(135deg,#0f172a,#1e3a8a)] px-4 py-4 text-[15px] leading-7 text-white"
            >
              {message.content}
            </div>
          )
        ))}
        {loading && <div className="text-[15px] text-slate-400">Thinking with Ollama...</div>}
      </div>
      {mistakeAction && (
        <button
          onClick={() => sendQuestion(mistakeAction)}
          className="mt-4 rounded-[1.5rem] border border-dashed border-peach bg-orange-50/60 px-4 py-4 text-left text-[15px] text-peach transition hover:bg-orange-50"
        >
          Test mistake detection: try invalid `{mistakeAction}`
        </button>
      )}
      <div className="mt-4 flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendQuestion();
            }
          }}
          placeholder="Ask a conceptual question..."
          className="flex-1 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-[15px] outline-none transition focus:border-sky"
        />
        <button
          onClick={() => sendQuestion()}
          className="rounded-[1.5rem] bg-[linear-gradient(135deg,#0f172a,#334155)] px-5 py-4 text-[15px] font-semibold text-white"
        >
          Send
        </button>
      </div>
    </aside>
  );
}
