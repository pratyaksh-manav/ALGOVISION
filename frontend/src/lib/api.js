const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

export const fetchAlgorithms = () => request("/algorithms");

export const fetchSimulation = (algorithmId, payload) =>
  request(`/algorithms/${algorithmId}/simulate`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const explainStep = (payload) =>
  request("/ai/explain", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const chatWithTutor = (payload) =>
  request("/ai/chat", {
    method: "POST",
    body: JSON.stringify(payload)
  });
