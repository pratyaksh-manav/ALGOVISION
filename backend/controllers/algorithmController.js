import { algorithmList, getAlgorithm, getSimulation } from "../algorithms/index.js";

export const getAlgorithmsController = (_req, res) => {
  res.json({ algorithms: algorithmList });
};

export const getAlgorithmController = (req, res) => {
  const algorithm = getAlgorithm(req.params.id);
  res.json({ algorithm: { ...algorithm, simulate: undefined } });
};

export const simulateAlgorithmController = (req, res) => {
  const simulation = getSimulation(req.params.id, req.body ?? {});
  const algorithm = getAlgorithm(req.params.id);
  res.json({
    algorithm: { ...algorithm, simulate: undefined },
    steps: simulation
  });
};
