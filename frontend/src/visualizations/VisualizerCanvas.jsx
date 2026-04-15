import { useEffect, useRef } from "react";
import * as d3 from "d3";

const renderBars = (svg, step, width, height) => {
  const array = step?.array ?? [];
  if (!array.length) return;
  const x = d3.scaleBand().domain(array.map((_, index) => index)).range([40, width - 40]).padding(0.2);
  const y = d3.scaleLinear().domain([0, d3.max(array) || 1]).range([height - 50, 50]);

  svg
    .selectAll("rect")
    .data(array)
    .join("rect")
    .attr("x", (_, index) => x(index))
    .attr("y", (value) => y(value))
    .attr("width", x.bandwidth())
    .attr("height", (value) => height - 50 - y(value))
    .attr("rx", 18)
    .attr("fill", (_, index) => {
      if (step?.pointers?.mid === index) return "#0ea5e9";
      if (step?.pointers?.currentIndex === index) return "#f97316";
      if (step?.highlights?.includes(index)) return "#fb923c";
      return "#1e293b";
    });

  svg
    .selectAll("text.value")
    .data(array)
    .join("text")
    .attr("class", "value")
    .attr("x", (_, index) => (x(index) || 0) + x.bandwidth() / 2)
    .attr("y", (value) => y(value) - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .attr("fill", "#0f172a")
    .text((value) => value);
};

const renderLinearNodes = (svg, nodes, width, height, activeColor) => {
  const spacing = Math.max(80, (width - 120) / Math.max(nodes.length, 1));
  const y = height / 2;

  svg
    .selectAll("circle.node")
    .data(nodes)
    .join("circle")
    .attr("class", "node")
    .attr("cx", (_, index) => 70 + index * spacing)
    .attr("cy", y)
    .attr("r", 28)
    .attr("fill", (node) => (node.active ? activeColor : "#1e293b"));

  svg
    .selectAll("text.node-label")
    .data(nodes)
    .join("text")
    .attr("class", "node-label")
    .attr("x", (_, index) => 70 + index * spacing)
    .attr("y", y + 4)
    .attr("fill", "#fff")
    .attr("font-size", 14)
    .attr("text-anchor", "middle")
    .text((node) => node.value);

  svg
    .selectAll("line.link")
    .data(nodes.slice(0, -1))
    .join("line")
    .attr("class", "link")
    .attr("x1", (_, index) => 98 + index * spacing)
    .attr("y1", y)
    .attr("x2", (_, index) => 42 + (index + 1) * spacing)
    .attr("y2", y)
    .attr("stroke", "#64748b")
    .attr("stroke-width", 3)
    .attr("marker-end", "url(#arrow)");
};

const renderTree = (svg, tree, width) => {
  const levels = {};
  tree.forEach((node) => {
    const level = Math.floor(Math.log2(node.index + 1));
    levels[level] ??= [];
    levels[level].push(node);
  });

  const positionMap = new Map();
  Object.entries(levels).forEach(([levelKey, nodes]) => {
    const level = Number(levelKey);
    const y = 90 + level * 110;
    const spacing = width / (nodes.length + 1);
    nodes.forEach((node, index) => {
      positionMap.set(node.id, { x: spacing * (index + 1), y });
    });
  });

  svg
    .selectAll("line.tree-edge")
    .data(tree.flatMap((node) => [node.left, node.right].filter(Boolean).map((child) => ({ source: node.id, target: child }))))
    .join("line")
    .attr("class", "tree-edge")
    .attr("x1", (edge) => positionMap.get(edge.source)?.x)
    .attr("y1", (edge) => positionMap.get(edge.source)?.y)
    .attr("x2", (edge) => positionMap.get(edge.target)?.x)
    .attr("y2", (edge) => positionMap.get(edge.target)?.y)
    .attr("stroke", "#94a3b8")
    .attr("stroke-width", 2);

  svg
    .selectAll("circle.tree-node")
    .data(tree)
    .join("circle")
    .attr("class", "tree-node")
    .attr("cx", (node) => positionMap.get(node.id)?.x)
    .attr("cy", (node) => positionMap.get(node.id)?.y)
    .attr("r", 26)
    .attr("fill", (node) => (node.active ? "#f97316" : "#1e293b"));

  svg
    .selectAll("text.tree-label")
    .data(tree)
    .join("text")
    .attr("class", "tree-label")
    .attr("x", (node) => positionMap.get(node.id)?.x)
    .attr("y", (node) => (positionMap.get(node.id)?.y || 0) + 4)
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .text((node) => node.value);
};

const renderGraph = (svg, graph) => {
  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));

  svg
    .selectAll("line.graph-edge")
    .data(graph.edges)
    .join("line")
    .attr("class", "graph-edge")
    .attr("x1", (edge) => nodeMap.get(edge.source)?.x)
    .attr("y1", (edge) => nodeMap.get(edge.source)?.y)
    .attr("x2", (edge) => nodeMap.get(edge.target)?.x)
    .attr("y2", (edge) => nodeMap.get(edge.target)?.y)
    .attr("stroke", "#cbd5e1")
    .attr("stroke-width", 3);

  svg
    .selectAll("circle.graph-node")
    .data(graph.nodes)
    .join("circle")
    .attr("class", "graph-node")
    .attr("cx", (node) => node.x)
    .attr("cy", (node) => node.y)
    .attr("r", 28)
    .attr("fill", (node) => {
      if (graph.active?.includes(node.id)) return "#f97316";
      if (graph.visited?.includes(node.id)) return "#0ea5e9";
      return "#1e293b";
    });

  svg
    .selectAll("text.graph-label")
    .data(graph.nodes)
    .join("text")
    .attr("class", "graph-label")
    .attr("x", (node) => node.x)
    .attr("y", (node) => node.y + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .text((node) => node.id);
};

export default function VisualizerCanvas({ algorithmId, step }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 760;
    const height = 430;
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 8)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#64748b");

    svg
      .append("rect")
      .attr("x", 12)
      .attr("y", 12)
      .attr("width", width - 24)
      .attr("height", height - 24)
      .attr("rx", 28)
      .attr("fill", "#fffdf8")
      .attr("stroke", "#e2e8f0");

    svg
      .append("circle")
      .attr("cx", 640)
      .attr("cy", 80)
      .attr("r", 90)
      .attr("fill", "rgba(14,165,233,0.08)");

    svg
      .append("circle")
      .attr("cx", 120)
      .attr("cy", 340)
      .attr("r", 110)
      .attr("fill", "rgba(249,115,22,0.08)");

    if (step?.array?.length) {
      renderBars(svg, step, width, height);
      return;
    }

    if (step?.nodes?.length) {
      renderLinearNodes(svg, step.nodes, width, height, step.error ? "#ef4444" : "#f97316");
      return;
    }

    if (step?.tree?.length) {
      renderTree(svg, step.tree, width);
      return;
    }

    if (step?.graph?.nodes?.length) {
      renderGraph(svg, step.graph);
    }
  }, [algorithmId, step]);

  return (
    <section className="glass-panel mesh-card rounded-[2.3rem] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Visualization Canvas</p>
          <h3 className="font-display text-2xl text-ink">Step-by-Step Animation</h3>
          <p className="mt-1 text-sm text-slate-500">Track state changes, active pointers, and traversal focus in real time.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600">
            {step?.title ?? "Awaiting simulation"}
          </div>
          <div className="rounded-full bg-[linear-gradient(135deg,#f97316,#fb7185)] px-4 py-2 text-sm font-semibold text-white">
            Live State
          </div>
        </div>
      </div>
      <svg ref={ref} className="h-[430px] w-full" />
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-slate-500">low: {step?.pointers?.low ?? "-"}</div>
        <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-slate-500">high: {step?.pointers?.high ?? "-"}</div>
        <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-slate-500">mid: {step?.pointers?.mid ?? "-"}</div>
        <div className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-slate-500">current index: {step?.pointers?.currentIndex ?? "-"}</div>
      </div>
    </section>
  );
}
