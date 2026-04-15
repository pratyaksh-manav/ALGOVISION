import { useEffect, useMemo, useRef, useState } from "react";
import { fetchSimulation } from "../lib/api";
import { algorithmList } from "@shared/algorithms";

const defaultInputs = {
  binarySearch: { array: "4,8,15,16,23,42", target: "15" },
  linearSearch: { array: "4,8,15,16,23,42", target: "23" },
  bubbleSort: { array: "5,1,4,2,8" },
  mergeSort: { array: "7,3,9,1,5" },
  quickSort: { array: "9,4,7,3,10,5" },
  stack: { operations: "push 5,push 9,pop,push 3" },
  queue: { operations: "enqueue 4,enqueue 7,dequeue,enqueue 9" },
  linkedList: { array: "10,20,30,40" },
  binaryTree: { array: "8,4,12,2,6,10,14" },
  bfs: { graph: "A:B,C;B:D,E;C:F", start: "A" },
  dfs: { graph: "A:B,C;B:D,E;C:F", start: "A" }
};

const speedOptions = [
  { label: "0.5x", value: 0.5, interval: 2200 },
  { label: "1x", value: 1, interval: 1300 },
  { label: "1.5x", value: 1.5, interval: 850 },
  { label: "2x", value: 2, interval: 550 }
];

export const useSimulation = () => {
  const [algorithms, setAlgorithms] = useState(algorithmList);
  const [selectedId, setSelectedId] = useState("binarySearch");
  const [inputValues, setInputValues] = useState(defaultInputs);
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const selectedAlgorithm = useMemo(
    () => algorithms.find((item) => item.id === selectedId) ?? algorithms[0],
    [algorithms, selectedId]
  );

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/algorithms`);
        if (response.ok) {
          const data = await response.json();
          setAlgorithms(data.algorithms);
        }
      } catch (_error) {
        setAlgorithms(algorithmList);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchSimulation(selectedId, inputValues[selectedId]);
        setSteps(response.steps);
        setCurrentIndex(0);
        setIsPlaying(false);
      } catch (_error) {
        setError("Failed to load the simulation.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [selectedId]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      return undefined;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((value) => {
        if (value >= steps.length - 1) {
          setIsPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, speedOptions.find((option) => option.value === speed)?.interval ?? 1300);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  const rerun = async ({ autoplay = true } = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchSimulation(selectedId, inputValues[selectedId]);
      setSteps(response.steps);
      setCurrentIndex(0);
      setIsPlaying(autoplay && response.steps.length > 1);
    } catch (_error) {
      setIsPlaying(false);
      setError("Failed to run the simulation.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateInput = (field, value) => {
    setInputValues((current) => ({
      ...current,
      [selectedId]: {
        ...current[selectedId],
        [field]: value
      }
    }));
  };

  return {
    algorithms,
    selectedId,
    setSelectedId,
    selectedAlgorithm,
    inputValues,
    updateInput,
    rerun,
    steps,
    currentIndex,
    currentStep: steps[currentIndex] ?? null,
    isPlaying,
    speed,
    speedOptions,
    isLoading,
    error,
    setIsPlaying,
    setSpeed,
    nextStep: () => setCurrentIndex((value) => Math.min(value + 1, Math.max(steps.length - 1, 0))),
    reset: () => {
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  };
};
