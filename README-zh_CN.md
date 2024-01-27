# WebRTC-Tools

[English](./README.md) | 简体中文

demo: https://ltsg123.github.io/webrtc-tools/example/

## Install

Use `npm`

```
# with npm
npm i webrtc-tools
```

CDN is also provided

```
<script src="https://ltsg123.github.io/webrtc-tools/dist/index.js"></script>
```

示例图片：
![](./img/test.png)

## Using

```ts
import { createTimeline } from "webrtc-tools";
const options = {
  // View Update Interval
  scale: 100,
  // Bottom Timeline Interval
  timeStep: 10 * 1000,
};

// create a timeline graph
const graph = createTimeline("key", "canvasId", options);

// set boundaries
graph.setBoundaries("up", 500, "blue");

// add graph point
setInterval(() => {
  graph.addGraphPoint(Math.random() * 1000);
}, 1000 / 30);
```

## build

yarn

yarn build

## dev

yarn

yarn dev

**Any questions you can contact me at ltsg0317@outlook.com**
