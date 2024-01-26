import "./style.css";
import { createTimeline } from "../src";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <canvas id="test-canvas" width="700" height="400"></canvas>

  </div>
`;

function main() {
  const options = {
    scale: 100,
    timeStep: 10 * 1000,
  };
  const graph = createTimeline("test", "test-canvas", options);
  graph.setBoundaries("up", 500, "blue");
  graph.setBoundaries("down", 300, "green");

  setTimeout(() => {
    graph.setBoundaries("up", 800, "blue");
  }, 3000);

  setInterval(() => {
    graph.addGraphPoint(Math.random() * 1000);
  }, 1000 / 30);
}

main();
