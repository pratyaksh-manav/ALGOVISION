const pointerSummary = (currentStep) => {
  const pointers = currentStep?.pointers ?? {};
  const parts = [];

  if (pointers.low !== undefined && pointers.low !== null) parts.push(`low = ${pointers.low}`);
  if (pointers.high !== undefined && pointers.high !== null) parts.push(`high = ${pointers.high}`);
  if (pointers.mid !== undefined && pointers.mid !== null) parts.push(`mid = ${pointers.mid}`);
  if (pointers.currentIndex !== undefined && pointers.currentIndex !== null) {
    parts.push(`current index = ${pointers.currentIndex}`);
  }

  return parts.length ? ` Active variables: ${parts.join(", ")}.` : "";
};

export const buildStepExplanation = ({ algorithm, currentStep, steps }) => {
  const stepText = currentStep?.description ?? "Run the simulation to see the next state.";
  const pointerText = pointerSummary(currentStep).replace(/^ /, "");
  const progressText = steps?.length && currentStep ? `${currentStep.title ?? "Current step"}.` : "Ready to begin.";

  return {
    reply: [
      `Overview: ${algorithm.explanation}`,
      `Current Step: ${stepText}`,
      `Active Variables: ${pointerText || "No tracked variables in this step."}`,
      `Focus: ${progressText}`
    ].join("\n"),
    source: "instant",
    error: null
  };
};
