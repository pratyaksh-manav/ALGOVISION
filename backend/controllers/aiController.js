import { getAlgorithm } from "../algorithms/index.js";
import { askOllama } from "../ai/ollamaClient.js";
import { buildStepExplanation } from "../ai/stepExplainer.js";

const detectMistake = ({ algorithmId, userAction, currentStep }) => {
  if (algorithmId === "stack" && userAction === "pop" && !currentStep?.nodes?.length) {
    return "stack-empty-pop";
  }
  if (algorithmId === "queue" && userAction === "dequeue" && !currentStep?.nodes?.length) {
    return "queue-empty-dequeue";
  }
  return null;
};

export const explainController = async (req, res) => {
  const { algorithmId, currentStep, steps } = req.body;
  const algorithm = getAlgorithm(algorithmId);
  res.json(buildStepExplanation({ algorithm, currentStep, steps }));
};

export const tutorChatController = async (req, res) => {
  const { algorithmId, question, currentStep, steps, userAction } = req.body;
  const algorithm = getAlgorithm(algorithmId);
  const mistake = detectMistake({ algorithmId, userAction, currentStep });
  const result = await askOllama({
    algorithmName: algorithm.name,
    question,
    explanation: algorithm.explanation,
    complexity: algorithm.complexity,
    currentStep,
    steps,
    mistake
  });

  res.json({
    ...result,
    mistake
  });
};
