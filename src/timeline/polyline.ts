import { $ } from "./utils";
import { TimelineDataSeries } from "./data_series";
import { TimelineGraphView } from "./timeline_graph_view";

const templateContainer = document.querySelector("#graph-view")!;
templateContainer.innerHTML = `
<template id="container-template"><div><div></div><div><canvas></canvas></div></div></template>
`;

document.body.appendChild(templateContainer);
const statsGraphMap = new Map<
  string,
  {
    graphView: TimelineGraphView;
    dataSeries: TimelineDataSeries;
  }
>();

function createStatsGraph(key: string) {
  let graph = statsGraphMap.get(key);
  if (graph) {
    return graph;
  }

  // @ts-ignore
  const canvasDiv = $("container-template")?.content.cloneNode(true);
  canvasDiv.querySelectorAll("div")[0].className = "graph-container";
  canvasDiv.querySelectorAll("div")[1].textContent = key;
  canvasDiv.querySelectorAll("div")[2].id = key;
  canvasDiv.querySelector("canvas").id = `p_${key}`;
  templateContainer.appendChild(canvasDiv);
  const graphView = new TimelineGraphView(key, `p_${key}`);

  // init
  graphView.setDateRange(new Date(), new Date());
  const dataSeries = new TimelineDataSeries(key);
  graphView.addDataSeries(dataSeries);

  statsGraphMap.set(key, {
    graphView,
    dataSeries,
  });
}

function getStatsGraph(key: string) {
  return statsGraphMap.get(key);
}

function addGraphPoint(key: string, value: any) {
  const graph = statsGraphMap.get(key);
  if (graph) {
    graph.dataSeries.addPoint(value);
    graph.graphView.updateEndDate();
  }
}

export { createStatsGraph, getStatsGraph, addGraphPoint };
