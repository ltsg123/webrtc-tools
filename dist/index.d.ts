/**
 *
 * @param key unique key of TimeLineGraph
 * @param canvasId id of canvas element
 * @param options options for graph
 */
export declare function createTimeline(key: string, canvasId: string, options?: GraphOptions): Graph;

/**
 * Graph interface
 */
export declare interface Graph {
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

declare interface GraphOptions {
    /**
     * 视图更新频率
     * @public
     */
    /** @en
     *  View Update Interval
     */
    scale: number;
    /**
     * 底部时间轴间隔
     * @public
     */
    /** @en
     * Bottom Timeline Interval
     */
    timeStep: number;
}

/**
 * A TimelineDataSeries collects an ordered series of (time, value) pairs,
 * and converts them to graph points.  It also keeps track of its color and
 * current visibility state.
 * It keeps MAX_STATS_DATA_POINT_BUFFER_SIZE data points at most. Old data
 * points will be dropped when it reaches this size.
 */
export declare class TimelineDataSeries {
    constructor(statsType: any);
    /**
     * @override
     */
    toJSON(): {
        startTime?: undefined;
        endTime?: undefined;
        statsType?: undefined;
        values?: undefined;
    } | {
        startTime: any;
        endTime: any;
        statsType: any;
        values: string;
    };
    /**
     * Adds a DataPoint to |this| with the specified time and value.
     * DataPoints are assumed to be received in chronological order.
     */
    addPoint(value: any, timeTicks?: number): void;
    /**
     *
     * @param label 边界label
     * @param values 边界值
     * @param color 绘制的颜色
     */
    setBoundaries(key: any, value: any, color: any): void;
    getBoundaries(): any;
    clearBoundaries(): void;
    isVisible(): any;
    show(isVisible: any): void;
    getColor(): any;
    setColor(color: any): void;
    getCount(): any;
    /**
     * Returns a list containing the values of the data series at |count|
     * points, starting at |startTime|, and |stepSize| milliseconds apart.
     * Caches values, so showing/hiding individual data series is fast.
     */
    getValues(startTime: any, stepSize: any, count: any): any;
    /**
     * Returns the cached |values| in the specified time period.
     */
    getValuesInternal_(startTime: any, stepSize: any, count: any): any[];
}

/**
 * A TimelineGraphView displays a timeline graph on a canvas element.
 */
export declare class TimelineGraphView {
    constructor(divId: any, canvasId: any, options?: {});
    setScale(scale: any): void;
    getLength_(): number;
    /**
     * Returns true if the graph is scrolled all the way to the right.
     */
    graphScrolledToRightEdge_(): boolean;
    /**
     * Update the range of the scrollbar.  If |resetPosition| is true, also
     * sets the slider to point at the rightmost position and triggers a
     * repaint.
     */
    updateScrollbarRange_(resetPosition: any): void;
    /**
     * Sets the date range displayed on the graph, switches to the default
     * scale factor, and moves the scrollbar all the way to the right.
     */
    setDateRange(startDate: any, endDate: any): void;
    /**
     * Updates the end time at the right of the graph to be the current time.
     * Specifically, updates the scrollbar's range, and if the scrollbar is
     * all the way to the right, keeps it all the way to the right.  Otherwise,
     * leaves the view as-is and doesn't redraw anything.
     */
    updateEndDate(opt_date?: number): void;
    getStartDate(): Date;
    /**
     * Replaces the current TimelineDataSeries with |dataSeries|.
     */
    setDataSeries(dataSeries: any): void;
    /**
     * Adds |dataSeries| to the current graph.
     */
    addDataSeries(dataSeries: any): void;
    /**
     * Draws the graph on |canvas_| when visible.
     */
    repaint(): void;
    /**
     * Draw time labels below the graph.  Takes in start time as an argument
     * since it may not be |startTime_|, when we're displaying the entire
     * time range.
     */
    drawTimeLabels(context: any, width: any, height: any, textHeight: any, startTime: any): void;
    drawingBoundaryLines(context: any, width: any, height: any, textHeight: any, startTime: any): void;
    getDataSeriesCount(): any;
    hasDataSeries(dataSeries: any): any;
}

export { }
