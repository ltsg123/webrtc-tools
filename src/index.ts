import { TimelineDataSeries } from "./timeline/data_series";
import {
  TimelineGraphView,
  GraphOptions,
} from "./timeline/timeline_graph_view";

/**
 * Graph interface
 */
interface Graph {
  /**
   * base instance of TimelineGraphView (modified from chrome webrtc-internals)
   */
  graphView: TimelineGraphView;
  /**
   * base instance of TimelineDataSeries (modified from chrome webrtc-internals)
   */
  dataSeries: TimelineDataSeries;
  /**
   *
   * @param value value of graph point
   */
  addGraphPoint: (value: number) => void;
  /**
   *
   * @param label label of the border
   * @param value value of the border
   * @param color color of the border
   */
  setBoundaries: (label: string, value: number, color: string) => void;
}

/**
 *
 * @param key unique key of TimeLineGraph
 * @param canvasId id of canvas element
 * @param options options for graph
 */
function createTimeline(
  key: string,
  canvasId: string,
  options?: GraphOptions
): Graph {
  const graphView = new TimelineGraphView(key, canvasId, options);

  const dataSeries = new TimelineDataSeries(key);
  graphView.addDataSeries(dataSeries);

  return {
    graphView,
    dataSeries,
    addGraphPoint: (value: number) => {
      dataSeries.addPoint(value);
      graphView.updateEndDate();
    },
    setBoundaries: (label: string, value: number, color: string) => {
      dataSeries.setBoundaries(label, value, color);
    },
  };
}

export { TimelineDataSeries, TimelineGraphView, createTimeline };
export type { Graph };
