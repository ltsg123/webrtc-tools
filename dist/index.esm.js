class TimelineDataSeries {
  constructor(statsType) {
    this.dataPoints_ = [];
    this.color_ = "red";
    this.isVisible_ = true;
    this.startTime_ = 0;
    this.cacheStartTime_ = null;
    this.cacheStepSize_ = 0;
    this.cacheValues_ = [];
    this.statsType_ = statsType;
    this.boundariesMap = /* @__PURE__ */ new Map();
  }
  /**
   * @override
   */
  toJSON() {
    if (this.dataPoints_.length < 1) {
      return {};
    }
    const values = [];
    for (let i = 0; i < this.dataPoints_.length; ++i) {
      values.push(this.dataPoints_[i].value);
    }
    return {
      startTime: this.dataPoints_[0].time,
      endTime: this.dataPoints_[this.dataPoints_.length - 1].time,
      statsType: this.statsType_,
      values: JSON.stringify(values)
    };
  }
  /**
   * Adds a DataPoint to |this| with the specified time and value.
   * DataPoints are assumed to be received in chronological order.
   */
  addPoint(value, timeTicks = (/* @__PURE__ */ new Date()).getTime()) {
    this.dataPoints_.push(new DataPoint(timeTicks, value));
    for (let i = 0; i < this.dataPoints_.length; i++) {
      if (this.dataPoints_[i].time < this.startTime_) {
        this.dataPoints_.shift();
      } else {
        break;
      }
    }
  }
  /**
   *
   * @param label 边界label
   * @param values 边界值
   * @param color 绘制的颜色
   */
  setBoundaries(key, value, color) {
    this.boundariesMap.set(key, {
      data: [value],
      color
    });
  }
  getBoundaries() {
    return this.boundariesMap;
  }
  clearBoundaries() {
    this.boundariesMap.clear();
  }
  isVisible() {
    return this.isVisible_;
  }
  show(isVisible) {
    this.isVisible_ = isVisible;
  }
  getColor() {
    return this.color_;
  }
  setColor(color) {
    this.color_ = color;
  }
  getCount() {
    return this.dataPoints_.length;
  }
  /**
   * Returns a list containing the values of the data series at |count|
   * points, starting at |startTime|, and |stepSize| milliseconds apart.
   * Caches values, so showing/hiding individual data series is fast.
   */
  getValues(startTime, stepSize, count) {
    if (this.cacheStartTime_ === startTime && this.cacheStepSize_ === stepSize && this.cacheValues_.length === count) {
      return this.cacheValues_;
    }
    this.cacheValues_ = this.getValuesInternal_(startTime, stepSize, count);
    this.cacheStartTime_ = startTime;
    this.cacheStepSize_ = stepSize;
    return this.cacheValues_;
  }
  /**
   * Returns the cached |values| in the specified time period.
   */
  getValuesInternal_(startTime, stepSize, count) {
    var _a;
    const values = [];
    let nextPoint = 0;
    let currentValue = 0;
    let time = startTime;
    this.startTime_ = startTime;
    for (let i = 0; i < count; ++i) {
      while (nextPoint < this.dataPoints_.length && (((_a = this.dataPoints_[nextPoint]) == null ? void 0 : _a.time) || 0) < time) {
        currentValue = this.dataPoints_[nextPoint].value;
        ++nextPoint;
      }
      values[i] = currentValue;
      time += stepSize;
    }
    return values;
  }
}
class DataPoint {
  constructor(time, value) {
    this.time = time;
    this.value = value;
  }
}
function $(id) {
  var el = document.getElementById(id);
  return el;
}
const MAX_VERTICAL_LABELS = 6;
const LABEL_VERTICAL_SPACING = 4;
const LABEL_HORIZONTAL_SPACING = 3;
const Y_AXIS_TICK_LENGTH = 10;
const GRID_COLOR = "#CCC";
const TEXT_COLOR = "#000";
const BACKGROUND_COLOR = "#FFF";
const MAX_DECIMAL_PRECISION = 3;
class TimelineGraphView {
  constructor(divId, canvasId, options = {}) {
    const { scale, timeStep } = options;
    this.scrollbar_ = { position_: 0, range_: 0 };
    this.graphDiv_ = $(divId);
    this.canvas_ = $(canvasId);
    this.startTime_ = 0;
    this.endTime_ = 1;
    this.graph_ = null;
    this.scale_ = scale || 1e3;
    this.timeStep_ = timeStep || 1e3 * 60;
    this.updateScrollbarRange_(true);
  }
  setScale(scale) {
    this.scale_ = scale;
  }
  // Returns the total length of the graph, in pixels.
  getLength_() {
    const timeRange = this.endTime_ - this.startTime_;
    return Math.floor(timeRange / this.scale_);
  }
  /**
   * Returns true if the graph is scrolled all the way to the right.
   */
  graphScrolledToRightEdge_() {
    return this.scrollbar_.position_ === this.scrollbar_.range_;
  }
  /**
   * Update the range of the scrollbar.  If |resetPosition| is true, also
   * sets the slider to point at the rightmost position and triggers a
   * repaint.
   */
  updateScrollbarRange_(resetPosition) {
    let scrollbarRange = this.getLength_() - this.canvas_.width;
    if (scrollbarRange < 0) {
      scrollbarRange = 0;
    }
    if (this.scrollbar_.position_ > scrollbarRange) {
      resetPosition = true;
    }
    this.scrollbar_.range_ = scrollbarRange;
    if (resetPosition) {
      this.scrollbar_.position_ = scrollbarRange;
      this.repaint();
    }
  }
  /**
   * Sets the date range displayed on the graph, switches to the default
   * scale factor, and moves the scrollbar all the way to the right.
   */
  setDateRange(startDate, endDate) {
    this.startTime_ = startDate.getTime();
    this.endTime_ = endDate.getTime();
    if (this.endTime_ <= this.startTime_) {
      this.startTime_ = this.endTime_ - 1;
    }
    this.updateScrollbarRange_(true);
  }
  /**
   * Updates the end time at the right of the graph to be the current time.
   * Specifically, updates the scrollbar's range, and if the scrollbar is
   * all the way to the right, keeps it all the way to the right.  Otherwise,
   * leaves the view as-is and doesn't redraw anything.
   */
  updateEndDate(opt_date = (/* @__PURE__ */ new Date()).getTime()) {
    this.endTime_ = opt_date || (/* @__PURE__ */ new Date()).getTime();
    this.updateScrollbarRange_(this.graphScrolledToRightEdge_());
  }
  getStartDate() {
    return new Date(this.startTime_);
  }
  /**
   * Replaces the current TimelineDataSeries with |dataSeries|.
   */
  setDataSeries(dataSeries) {
    this.graph_ = new Graph();
    for (let i = 0; i < dataSeries.length; ++i) {
      this.graph_.addDataSeries(dataSeries[i]);
    }
    this.repaint();
  }
  /**
   * Adds |dataSeries| to the current graph.
   */
  addDataSeries(dataSeries) {
    if (!this.graph_) {
      this.graph_ = new Graph();
    }
    this.graph_.addDataSeries(dataSeries);
    this.repaint();
  }
  /**
   * Draws the graph on |canvas_| when visible.
   */
  repaint() {
    if (this.canvas_.offsetParent === null) {
      return;
    }
    this.repaintTimerRunning_ = false;
    const width = this.canvas_.width;
    let height = this.canvas_.height;
    const context = this.canvas_.getContext("2d");
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, width, height);
    const fontHeightString = context.font.match(/([0-9]+)px/)[1];
    const fontHeight = parseInt(fontHeightString);
    if (fontHeightString.length === 0 || fontHeight <= 0 || fontHeight * 4 > height || width < 50) {
      return;
    }
    context.save();
    context.translate(0.5, 0.5);
    let position = this.scrollbar_.position_;
    if (this.scrollbar_.range_ === 0) {
      position = this.getLength_() - this.canvas_.width;
    }
    const visibleStartTime = this.startTime_ + position * this.scale_;
    const textHeight = height;
    height -= fontHeight + LABEL_VERTICAL_SPACING;
    this.drawTimeLabels(context, width, height, textHeight, visibleStartTime);
    context.strokeStyle = GRID_COLOR;
    context.strokeRect(0, 0, width - 1, height - 1);
    if (this.graph_) {
      this.graph_.layout(
        width,
        height,
        fontHeight,
        visibleStartTime,
        this.scale_
      );
      this.graph_.drawTicks(context);
      this.graph_.drawLines(context);
      this.graph_.drawLabels(context);
    }
    context.restore();
  }
  /**
   * Draw time labels below the graph.  Takes in start time as an argument
   * since it may not be |startTime_|, when we're displaying the entire
   * time range.
   */
  drawTimeLabels(context, width, height, textHeight, startTime) {
    const timeStep = this.timeStep_;
    let time = Math.ceil(startTime / timeStep) * timeStep;
    context.textBaseline = "bottom";
    context.textAlign = "center";
    context.fillStyle = TEXT_COLOR;
    context.strokeStyle = GRID_COLOR;
    while (true) {
      const x = Math.round((time - startTime) / this.scale_);
      if (x >= width) {
        break;
      }
      const text = new Date(time).toLocaleTimeString();
      context.fillText(text, x, textHeight);
      context.beginPath();
      context.lineTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
      time += timeStep;
    }
  }
  drawingBoundaryLines(context, width, height, textHeight, startTime) {
    this.timeStep_;
    context.strokeStyle = GRID_COLOR;
    context.beginPath();
    context.lineTo(0, 1e3);
    context.lineTo(width, 1e3);
    context.stroke();
  }
  getDataSeriesCount() {
    if (this.graph_) {
      return this.graph_.dataSeries_.length;
    }
    return 0;
  }
  hasDataSeries(dataSeries) {
    if (this.graph_) {
      return this.graph_.hasDataSeries(dataSeries);
    }
    return false;
  }
}
class Graph {
  constructor() {
    this.dataSeries_ = [];
    this.width_ = 0;
    this.height_ = 0;
    this.fontHeight_ = 0;
    this.startTime_ = 0;
    this.scale_ = 0;
    this.min_ = 0;
    this.max_ = 0;
    this.labels_ = [];
  }
  addDataSeries(dataSeries) {
    this.dataSeries_.push(dataSeries);
  }
  hasDataSeries(dataSeries) {
    for (let i = 0; i < this.dataSeries_.length; ++i) {
      if (this.dataSeries_[i] === dataSeries) {
        return true;
      }
    }
    return false;
  }
  /**
   * Returns a list of all the values that should be displayed for a given
   * data series, using the current graph layout.
   */
  getValues(dataSeries) {
    if (!dataSeries.isVisible()) {
      return null;
    }
    return dataSeries.getValues(this.startTime_, this.scale_, this.width_);
  }
  /**
   * Updates the graph's layout.  In particular, both the max value and
   * label positions are updated.  Must be called before calling any of the
   * drawing functions.
   */
  layout(width, height, fontHeight, startTime, scale) {
    this.width_ = width;
    this.height_ = height;
    this.fontHeight_ = fontHeight;
    this.startTime_ = startTime;
    this.scale_ = scale;
    let max = 0;
    let min = 0;
    for (let i = 0; i < this.dataSeries_.length; ++i) {
      const values = this.getValues(this.dataSeries_[i]);
      if (!values) {
        continue;
      }
      for (let j = 0; j < values.length; ++j) {
        if (values[j] > max) {
          max = values[j];
        } else if (values[j] < min) {
          min = values[j];
        }
      }
    }
    this.layoutLabels_(min, max);
  }
  /**
   * Lays out labels and sets |max_|/|min_|, taking the time units into
   * consideration.  |maxValue| is the actual maximum value, and
   * |max_| will be set to the value of the largest label, which
   * will be at least |maxValue|. Similar for |min_|.
   */
  layoutLabels_(minValue, maxValue) {
    if (maxValue - minValue < 1024) {
      this.layoutLabelsBasic_(minValue, maxValue, MAX_DECIMAL_PRECISION);
      return;
    }
    const units = ["", "k", "M", "G", "T", "P"];
    let unit = 1;
    minValue /= 1024;
    maxValue /= 1024;
    while (units[unit + 1] && maxValue - minValue >= 1024) {
      minValue /= 1024;
      maxValue /= 1024;
      ++unit;
    }
    this.layoutLabelsBasic_(minValue, maxValue, MAX_DECIMAL_PRECISION);
    for (let i = 0; i < this.labels_.length; ++i) {
      this.labels_[i] += " " + units[unit];
    }
    this.min_ *= Math.pow(1024, unit);
    this.max_ *= Math.pow(1024, unit);
  }
  /**
   * Same as layoutLabels_, but ignores units.  |maxDecimalDigits| is the
   * maximum number of decimal digits allowed.  The minimum allowed
   * difference between two adjacent labels is 10^-|maxDecimalDigits|.
   */
  layoutLabelsBasic_(minValue, maxValue, maxDecimalDigits) {
    this.labels_ = [];
    const range = maxValue - minValue;
    if (range === 0) {
      this.min_ = this.max_ = maxValue;
      return;
    }
    const minLabelSpacing = 2 * this.fontHeight_ + LABEL_VERTICAL_SPACING;
    let maxLabels = 1 + this.height_ / minLabelSpacing;
    if (maxLabels < 2) {
      maxLabels = 2;
    } else if (maxLabels > MAX_VERTICAL_LABELS) {
      maxLabels = MAX_VERTICAL_LABELS;
    }
    let stepSize = Math.pow(10, -maxDecimalDigits);
    let stepSizeDecimalDigits = maxDecimalDigits;
    while (true) {
      if (Math.ceil(range / stepSize) + 1 <= maxLabels) {
        break;
      }
      if (Math.ceil(range / (stepSize * 2)) + 1 <= maxLabels) {
        stepSize *= 2;
        break;
      }
      if (Math.ceil(range / (stepSize * 5)) + 1 <= maxLabels) {
        stepSize *= 5;
        break;
      }
      stepSize *= 10;
      if (stepSizeDecimalDigits > 0) {
        --stepSizeDecimalDigits;
      }
    }
    this.max_ = Math.ceil(maxValue / stepSize) * stepSize;
    this.min_ = Math.floor(minValue / stepSize) * stepSize;
    for (let label = this.max_; label >= this.min_; label -= stepSize) {
      this.labels_.push(label.toFixed(stepSizeDecimalDigits));
    }
  }
  /**
   * Draws tick marks for each of the labels in |labels_|.
   */
  drawTicks(context) {
    const x1 = this.width_ - 1;
    const x2 = this.width_ - 1 - Y_AXIS_TICK_LENGTH;
    context.fillStyle = GRID_COLOR;
    context.beginPath();
    for (let i = 1; i < this.labels_.length - 1; ++i) {
      const y = Math.round(this.height_ * i / (this.labels_.length - 1));
      context.moveTo(x1, y);
      context.lineTo(x2, y);
    }
    context.stroke();
  }
  /**
   * Draws a graph line for each of the data series.
   */
  drawLines(context) {
    let scale = 0;
    const bottom = this.height_ - 1;
    if (this.max_) {
      scale = bottom / (this.max_ - this.min_);
    }
    for (let i = this.dataSeries_.length - 1; i >= 0; --i) {
      const values = this.getValues(this.dataSeries_[i]);
      if (!values) {
        continue;
      }
      const boundariesMap = this.dataSeries_[i].getBoundaries();
      if (boundariesMap) {
        Array.from(boundariesMap.entries()).forEach(
          ([type, { color, data: boundaries }]) => {
            context.strokeStyle = color;
            context.beginPath();
            boundaries.forEach((boundary) => {
              context.fillStyle = color;
              context.textAlign = "left";
              context.fillText(
                type,
                0,
                bottom - Math.round((boundary - this.min_) * scale)
              );
              context.moveTo(
                0,
                bottom - Math.round((boundary - this.min_) * scale)
              );
              context.lineTo(
                values.length - 1,
                bottom - Math.round((boundary - this.min_) * scale)
              );
            });
            context.stroke();
          }
        );
      }
      context.strokeStyle = this.dataSeries_[i].getColor();
      context.beginPath();
      for (let x = 0; x < values.length; ++x) {
        context.lineTo(x, bottom - Math.round((values[x] - this.min_) * scale));
      }
      context.stroke();
    }
  }
  /**
   * Draw labels in |labels_|.
   */
  drawLabels(context) {
    if (this.labels_.length === 0) {
      return;
    }
    const x = this.width_ - LABEL_HORIZONTAL_SPACING;
    context.fillStyle = TEXT_COLOR;
    context.textAlign = "right";
    context.textBaseline = "top";
    context.fillText(this.labels_[0], x, 0);
    context.textBaseline = "bottom";
    const step = (this.height_ - 1) / (this.labels_.length - 1);
    for (let i = 1; i < this.labels_.length; ++i) {
      context.fillText(this.labels_[i], x, step * i);
    }
  }
}
function createTimeline(key, canvasId, options) {
  const graphView = new TimelineGraphView(key, canvasId, options);
  const dataSeries = new TimelineDataSeries(key);
  graphView.addDataSeries(dataSeries);
  return {
    graphView,
    dataSeries,
    addGraphPoint: (value) => {
      dataSeries.addPoint(value);
      graphView.updateEndDate();
    },
    setBoundaries: (label, value, color) => {
      dataSeries.setBoundaries(label, value, color);
    }
  };
}
export {
  TimelineDataSeries,
  TimelineGraphView,
  createTimeline
};
