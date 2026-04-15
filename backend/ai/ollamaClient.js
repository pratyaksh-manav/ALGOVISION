import axios from "axios";

const buildSystemPrompt = () =>
  [
    "You are an algorithm tutor for students.",
    "Explain clearly and briefly.",
    "When the user asks what an algorithm is, first give a direct teacher-style definition.",
    "Then explain how it works, why it is useful, and its time complexity in simple terms.",
    "Format answers in short sections with labels like Overview, Why it matters, Complexity, or Example when helpful.",
    "If there is an invalid user action, call it out and provide the correction.",
    "Tie explanations to the current simulation state and complexity when relevant."
  ].join(" ");

const fallbackReply = ({ mistake, error }) => {
  if (mistake === "stack-empty-pop") {
    return {
      reply: "Error: Cannot pop from an empty stack. Please push an element first.",
      source: "fallback",
      error: null
    };
  }

  if (mistake === "queue-empty-dequeue") {
    return {
      reply: "Error: Cannot dequeue from an empty queue. Add an element before removing one.",
      source: "fallback",
      error: null
    };
  }

  return {
    reply: "Ollama is unavailable right now. Start `ollama serve` and ensure the selected model is installed.",
    source: "fallback",
    error: error ?? null
  };
};

export const askOllama = async ({ algorithmName, question, currentStep, steps, mistake, explanation, complexity }) => {
  const model = process.env.OLLAMA_MODEL || "deepseek-coder";
  const baseURL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const prompt = [
    `Algorithm: ${algorithmName}`,
    explanation ? `Reference explanation: ${explanation}` : "",
    complexity ? `Complexity: best ${complexity.best}, average ${complexity.average}, worst ${complexity.worst}, space ${complexity.space}` : "",
    question ? `User question: ${question}` : "Task: Explain the current simulation state.",
    mistake ? `Detected mistake: ${mistake}` : "",
    currentStep ? `Current step: ${JSON.stringify(currentStep)}` : "",
    steps?.length ? `Recent steps: ${JSON.stringify(steps.slice(Math.max(0, steps.length - 3)))}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await axios.post(`${baseURL}/api/generate`, {
      model,
      system: buildSystemPrompt(),
      prompt,
      stream: false
    });

    return {
      reply:
        response.data.response?.trim() ||
        fallbackReply({ mistake }).reply,
      source: response.data.response?.trim() ? "ollama" : "fallback",
      error: null
    };
  } catch (error) {
    return fallbackReply({
      mistake,
      error: error.message
    });
  }
};
