!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self)["webrtc-tools"]={})}(this,(function(t){"use strict";class e{constructor(t){this.dataPoints_=[],this.color_="red",this.isVisible_=!0,this.startTime_=0,this.cacheStartTime_=null,this.cacheStepSize_=0,this.cacheValues_=[],this.statsType_=t,this.boundariesMap=new Map}toJSON(){if(this.dataPoints_.length<1)return{};const t=[];for(let e=0;e<this.dataPoints_.length;++e)t.push(this.dataPoints_[e].value);return{startTime:this.dataPoints_[0].time,endTime:this.dataPoints_[this.dataPoints_.length-1].time,statsType:this.statsType_,values:JSON.stringify(t)}}addPoint(t,e=(new Date).getTime()){this.dataPoints_.push(new i(e,t));for(let i=0;i<this.dataPoints_.length&&this.dataPoints_[i].time<this.startTime_;i++)this.dataPoints_.shift()}setBoundaries(t,e,i){this.boundariesMap.set(t,{data:[e],color:i})}getBoundaries(){return this.boundariesMap}clearBoundaries(){this.boundariesMap.clear()}isVisible(){return this.isVisible_}show(t){this.isVisible_=t}getColor(){return this.color_}setColor(t){this.color_=t}getCount(){return this.dataPoints_.length}getValues(t,e,i){return this.cacheStartTime_===t&&this.cacheStepSize_===e&&this.cacheValues_.length===i||(this.cacheValues_=this.getValuesInternal_(t,e,i),this.cacheStartTime_=t,this.cacheStepSize_=e),this.cacheValues_}getValuesInternal_(t,e,i){var s;const a=[];let h=0,r=0,n=t;this.startTime_=t;for(let l=0;l<i;++l){for(;h<this.dataPoints_.length&&((null==(s=this.dataPoints_[h])?void 0:s.time)||0)<n;)r=this.dataPoints_[h].value,++h;a[l]=r,n+=e}return a}}class i{constructor(t,e){this.time=t,this.value=e}}function s(t){return document.getElementById(t)}const a="#CCC",h="#000";class r{constructor(t,e,i={}){const{scale:a,timeStep:h}=i;this.scrollbar_={position_:0,range_:0},this.graphDiv_=s(t),this.canvas_=s(e),this.startTime_=0,this.endTime_=1,this.graph_=null,this.scale_=a||1e3,this.timeStep_=h||6e4,this.updateScrollbarRange_(!0)}setScale(t){this.scale_=t}getLength_(){const t=this.endTime_-this.startTime_;return Math.floor(t/this.scale_)}graphScrolledToRightEdge_(){return this.scrollbar_.position_===this.scrollbar_.range_}updateScrollbarRange_(t){let e=this.getLength_()-this.canvas_.width;e<0&&(e=0),this.scrollbar_.position_>e&&(t=!0),this.scrollbar_.range_=e,t&&(this.scrollbar_.position_=e,this.repaint())}setDateRange(t,e){this.startTime_=t.getTime(),this.endTime_=e.getTime(),this.endTime_<=this.startTime_&&(this.startTime_=this.endTime_-1),this.updateScrollbarRange_(!0)}updateEndDate(t=(new Date).getTime()){this.endTime_=t||(new Date).getTime(),this.updateScrollbarRange_(this.graphScrolledToRightEdge_())}getStartDate(){return new Date(this.startTime_)}setDataSeries(t){this.graph_=new n;for(let e=0;e<t.length;++e)this.graph_.addDataSeries(t[e]);this.repaint()}addDataSeries(t){this.graph_||(this.graph_=new n),this.graph_.addDataSeries(t),this.repaint()}repaint(){if(null===this.canvas_.offsetParent)return;this.repaintTimerRunning_=!1;const t=this.canvas_.width;let e=this.canvas_.height;const i=this.canvas_.getContext("2d");i.fillStyle="#FFF",i.fillRect(0,0,t,e);const s=i.font.match(/([0-9]+)px/)[1],h=parseInt(s);if(0===s.length||h<=0||4*h>e||t<50)return;i.save(),i.translate(.5,.5);let r=this.scrollbar_.position_;0===this.scrollbar_.range_&&(r=this.getLength_()-this.canvas_.width);const n=this.startTime_+r*this.scale_,l=e;e-=h+4,this.drawTimeLabels(i,t,e,l,n),i.strokeStyle=a,i.strokeRect(0,0,t-1,e-1),this.graph_&&(this.graph_.layout(t,e,h,n,this.scale_),this.graph_.drawTicks(i),this.graph_.drawLines(i),this.graph_.drawLabels(i)),i.restore()}drawTimeLabels(t,e,i,s,r){const n=this.timeStep_;let l=Math.ceil(r/n)*n;for(t.textBaseline="bottom",t.textAlign="center",t.fillStyle=h,t.strokeStyle=a;;){const a=Math.round((l-r)/this.scale_);if(a>=e)break;const h=new Date(l).toLocaleTimeString();t.fillText(h,a,s),t.beginPath(),t.lineTo(a,0),t.lineTo(a,i),t.stroke(),l+=n}}drawingBoundaryLines(t,e,i,s,h){this.timeStep_,t.strokeStyle=a,t.beginPath(),t.lineTo(0,1e3),t.lineTo(e,1e3),t.stroke()}getDataSeriesCount(){return this.graph_?this.graph_.dataSeries_.length:0}hasDataSeries(t){return!!this.graph_&&this.graph_.hasDataSeries(t)}}class n{constructor(){this.dataSeries_=[],this.width_=0,this.height_=0,this.fontHeight_=0,this.startTime_=0,this.scale_=0,this.min_=0,this.max_=0,this.labels_=[]}addDataSeries(t){this.dataSeries_.push(t)}hasDataSeries(t){for(let e=0;e<this.dataSeries_.length;++e)if(this.dataSeries_[e]===t)return!0;return!1}getValues(t){return t.isVisible()?t.getValues(this.startTime_,this.scale_,this.width_):null}layout(t,e,i,s,a){this.width_=t,this.height_=e,this.fontHeight_=i,this.startTime_=s,this.scale_=a;let h=0,r=0;for(let n=0;n<this.dataSeries_.length;++n){const t=this.getValues(this.dataSeries_[n]);if(t)for(let e=0;e<t.length;++e)t[e]>h?h=t[e]:t[e]<r&&(r=t[e])}this.layoutLabels_(r,h)}layoutLabels_(t,e){if(e-t<1024)return void this.layoutLabelsBasic_(t,e,3);const i=["","k","M","G","T","P"];let s=1;for(t/=1024,e/=1024;i[s+1]&&e-t>=1024;)t/=1024,e/=1024,++s;this.layoutLabelsBasic_(t,e,3);for(let a=0;a<this.labels_.length;++a)this.labels_[a]+=" "+i[s];this.min_*=Math.pow(1024,s),this.max_*=Math.pow(1024,s)}layoutLabelsBasic_(t,e,i){this.labels_=[];const s=e-t;if(0===s)return void(this.min_=this.max_=e);const a=2*this.fontHeight_+4;let h=1+this.height_/a;h<2?h=2:h>6&&(h=6);let r=Math.pow(10,-i),n=i;for(;!(Math.ceil(s/r)+1<=h);){if(Math.ceil(s/(2*r))+1<=h){r*=2;break}if(Math.ceil(s/(5*r))+1<=h){r*=5;break}r*=10,n>0&&--n}this.max_=Math.ceil(e/r)*r,this.min_=Math.floor(t/r)*r;for(let l=this.max_;l>=this.min_;l-=r)this.labels_.push(l.toFixed(n))}drawTicks(t){const e=this.width_-1,i=this.width_-1-10;t.fillStyle=a,t.beginPath();for(let s=1;s<this.labels_.length-1;++s){const a=Math.round(this.height_*s/(this.labels_.length-1));t.moveTo(e,a),t.lineTo(i,a)}t.stroke()}drawLines(t){let e=0;const i=this.height_-1;this.max_&&(e=i/(this.max_-this.min_));for(let s=this.dataSeries_.length-1;s>=0;--s){const a=this.getValues(this.dataSeries_[s]);if(!a)continue;const h=this.dataSeries_[s].getBoundaries();h&&Array.from(h.entries()).forEach((([s,{color:h,data:r}])=>{t.strokeStyle=h,t.beginPath(),r.forEach((r=>{t.fillStyle=h,t.textAlign="left",t.fillText(s,0,i-Math.round((r-this.min_)*e)),t.moveTo(0,i-Math.round((r-this.min_)*e)),t.lineTo(a.length-1,i-Math.round((r-this.min_)*e))})),t.stroke()})),t.strokeStyle=this.dataSeries_[s].getColor(),t.beginPath();for(let s=0;s<a.length;++s)t.lineTo(s,i-Math.round((a[s]-this.min_)*e));t.stroke()}}drawLabels(t){if(0===this.labels_.length)return;const e=this.width_-3;t.fillStyle=h,t.textAlign="right",t.textBaseline="top",t.fillText(this.labels_[0],e,0),t.textBaseline="bottom";const i=(this.height_-1)/(this.labels_.length-1);for(let s=1;s<this.labels_.length;++s)t.fillText(this.labels_[s],e,i*s)}}t.TimelineDataSeries=e,t.TimelineGraphView=r,t.createTimeline=function(t,i,s){const a=new r(t,i,s),h=new e(t);return a.addDataSeries(h),{graphView:a,dataSeries:h,addGraphPoint:t=>{h.addPoint(t),a.updateEndDate()},setBoundaries:(t,e,i)=>{h.setBoundaries(t,e,i)}}},Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
