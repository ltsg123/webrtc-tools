!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";class t{constructor(t){this.dataPoints_=[],this.color_="red",this.isVisible_=!0,this.startTime_=0,this.cacheStartTime_=null,this.cacheStepSize_=0,this.cacheValues_=[],this.statsType_=t,this.boundariesMap=new Map}toJSON(){if(this.dataPoints_.length<1)return{};const t=[];for(let e=0;e<this.dataPoints_.length;++e)t.push(this.dataPoints_[e].value);return{startTime:this.dataPoints_[0].time,endTime:this.dataPoints_[this.dataPoints_.length-1].time,statsType:this.statsType_,values:JSON.stringify(t)}}addPoint(t,i=(new Date).getTime()){this.dataPoints_.push(new e(i,t));for(let e=0;e<this.dataPoints_.length&&this.dataPoints_[e].time<this.startTime_;e++)this.dataPoints_.shift()}setBoundaries(t,e,i){this.boundariesMap.set(t,{data:[e],color:i})}getBoundaries(){return this.boundariesMap}clearBoundaries(){this.boundariesMap.clear()}isVisible(){return this.isVisible_}show(t){this.isVisible_=t}getColor(){return this.color_}setColor(t){this.color_=t}getCount(){return this.dataPoints_.length}getValues(t,e,i){return this.cacheStartTime_===t&&this.cacheStepSize_===e&&this.cacheValues_.length===i||(this.cacheValues_=this.getValuesInternal_(t,e,i),this.cacheStartTime_=t,this.cacheStepSize_=e),this.cacheValues_}getValuesInternal_(t,e,i){var s;const a=[];let h=0,n=0,r=t;this.startTime_=t;for(let l=0;l<i;++l){for(;h<this.dataPoints_.length&&((null==(s=this.dataPoints_[h])?void 0:s.time)||0)<r;)n=this.dataPoints_[h].value,++h;a[l]=n,r+=e}return a}}class e{constructor(t,e){this.time=t,this.value=e}}function i(t){return document.getElementById(t)}const s="#CCC",a="#000";class h{constructor(t,e,s={}){const{scale:a,timeStep:h}=s;this.scrollbar_={position_:0,range_:0},this.graphDiv_=i(t),this.canvas_=i(e),this.startTime_=0,this.endTime_=1,this.graph_=null,this.scale_=a||1e3,this.timeStep_=h||6e4,this.updateScrollbarRange_(!0)}setScale(t){this.scale_=t}getLength_(){const t=this.endTime_-this.startTime_;return Math.floor(t/this.scale_)}graphScrolledToRightEdge_(){return this.scrollbar_.position_===this.scrollbar_.range_}updateScrollbarRange_(t){let e=this.getLength_()-this.canvas_.width;e<0&&(e=0),this.scrollbar_.position_>e&&(t=!0),this.scrollbar_.range_=e,t&&(this.scrollbar_.position_=e,this.repaint())}setDateRange(t,e){this.startTime_=t.getTime(),this.endTime_=e.getTime(),this.endTime_<=this.startTime_&&(this.startTime_=this.endTime_-1),this.updateScrollbarRange_(!0)}updateEndDate(t=(new Date).getTime()){this.endTime_=t||(new Date).getTime(),this.updateScrollbarRange_(this.graphScrolledToRightEdge_())}getStartDate(){return new Date(this.startTime_)}setDataSeries(t){this.graph_=new n;for(let e=0;e<t.length;++e)this.graph_.addDataSeries(t[e]);this.repaint()}addDataSeries(t){this.graph_||(this.graph_=new n),this.graph_.addDataSeries(t),this.repaint()}repaint(){if(null===this.canvas_.offsetParent)return;this.repaintTimerRunning_=!1;const t=this.canvas_.width;let e=this.canvas_.height;const i=this.canvas_.getContext("2d");i.fillStyle="#FFF",i.fillRect(0,0,t,e);const a=i.font.match(/([0-9]+)px/)[1],h=parseInt(a);if(0===a.length||h<=0||4*h>e||t<50)return;i.save(),i.translate(.5,.5);let n=this.scrollbar_.position_;0===this.scrollbar_.range_&&(n=this.getLength_()-this.canvas_.width);const r=this.startTime_+n*this.scale_,l=e;e-=h+4,this.drawTimeLabels(i,t,e,l,r),i.strokeStyle=s,i.strokeRect(0,0,t-1,e-1),this.graph_&&(this.graph_.layout(t,e,h,r,this.scale_),this.graph_.drawTicks(i),this.graph_.drawLines(i),this.graph_.drawLabels(i)),i.restore()}drawTimeLabels(t,e,i,h,n){const r=this.timeStep_;let l=Math.ceil(n/r)*r;for(t.textBaseline="bottom",t.textAlign="center",t.fillStyle=a,t.strokeStyle=s;;){const s=Math.round((l-n)/this.scale_);if(s>=e)break;const a=new Date(l).toLocaleTimeString();t.fillText(a,s,h),t.beginPath(),t.lineTo(s,0),t.lineTo(s,i),t.stroke(),l+=r}}drawingBoundaryLines(t,e,i,a,h){this.timeStep_,t.strokeStyle=s,t.beginPath(),t.lineTo(0,1e3),t.lineTo(e,1e3),t.stroke()}getDataSeriesCount(){return this.graph_?this.graph_.dataSeries_.length:0}hasDataSeries(t){return!!this.graph_&&this.graph_.hasDataSeries(t)}}class n{constructor(){this.dataSeries_=[],this.width_=0,this.height_=0,this.fontHeight_=0,this.startTime_=0,this.scale_=0,this.min_=0,this.max_=0,this.labels_=[]}addDataSeries(t){this.dataSeries_.push(t)}hasDataSeries(t){for(let e=0;e<this.dataSeries_.length;++e)if(this.dataSeries_[e]===t)return!0;return!1}getValues(t){return t.isVisible()?t.getValues(this.startTime_,this.scale_,this.width_):null}layout(t,e,i,s,a){this.width_=t,this.height_=e,this.fontHeight_=i,this.startTime_=s,this.scale_=a;let h=0,n=0;for(let r=0;r<this.dataSeries_.length;++r){const t=this.getValues(this.dataSeries_[r]);if(t)for(let e=0;e<t.length;++e)t[e]>h?h=t[e]:t[e]<n&&(n=t[e])}this.layoutLabels_(n,h)}layoutLabels_(t,e){if(e-t<1024)return void this.layoutLabelsBasic_(t,e,3);const i=["","k","M","G","T","P"];let s=1;for(t/=1024,e/=1024;i[s+1]&&e-t>=1024;)t/=1024,e/=1024,++s;this.layoutLabelsBasic_(t,e,3);for(let a=0;a<this.labels_.length;++a)this.labels_[a]+=" "+i[s];this.min_*=Math.pow(1024,s),this.max_*=Math.pow(1024,s)}layoutLabelsBasic_(t,e,i){this.labels_=[];const s=e-t;if(0===s)return void(this.min_=this.max_=e);const a=2*this.fontHeight_+4;let h=1+this.height_/a;h<2?h=2:h>6&&(h=6);let n=Math.pow(10,-i),r=i;for(;!(Math.ceil(s/n)+1<=h);){if(Math.ceil(s/(2*n))+1<=h){n*=2;break}if(Math.ceil(s/(5*n))+1<=h){n*=5;break}n*=10,r>0&&--r}this.max_=Math.ceil(e/n)*n,this.min_=Math.floor(t/n)*n;for(let l=this.max_;l>=this.min_;l-=n)this.labels_.push(l.toFixed(r))}drawTicks(t){const e=this.width_-1,i=this.width_-1-10;t.fillStyle=s,t.beginPath();for(let s=1;s<this.labels_.length-1;++s){const a=Math.round(this.height_*s/(this.labels_.length-1));t.moveTo(e,a),t.lineTo(i,a)}t.stroke()}drawLines(t){let e=0;const i=this.height_-1;this.max_&&(e=i/(this.max_-this.min_));for(let s=this.dataSeries_.length-1;s>=0;--s){const a=this.getValues(this.dataSeries_[s]);if(!a)continue;const h=this.dataSeries_[s].getBoundaries();h&&Array.from(h.entries()).forEach((([s,{color:h,data:n}])=>{t.strokeStyle=h,t.beginPath(),n.forEach((n=>{t.fillStyle=h,t.textAlign="left",t.fillText(s,0,i-Math.round((n-this.min_)*e)),t.moveTo(0,i-Math.round((n-this.min_)*e)),t.lineTo(a.length-1,i-Math.round((n-this.min_)*e))})),t.stroke()})),t.strokeStyle=this.dataSeries_[s].getColor(),t.beginPath();for(let s=0;s<a.length;++s)t.lineTo(s,i-Math.round((a[s]-this.min_)*e));t.stroke()}}drawLabels(t){if(0===this.labels_.length)return;const e=this.width_-3;t.fillStyle=a,t.textAlign="right",t.textBaseline="top",t.fillText(this.labels_[0],e,0),t.textBaseline="bottom";const i=(this.height_-1)/(this.labels_.length-1);for(let s=1;s<this.labels_.length;++s)t.fillText(this.labels_[s],e,i*s)}}document.querySelector("#app").innerHTML='\n  <div>\n    <h1>WebRTC - Tools</h1>\n    <canvas id="test-canvas" width="700" height="400"></canvas>\n\n  </div>\n',function(){const e=function(e,i,s){const a=new h(e,i,s),n=new t(e);return a.addDataSeries(n),{graphView:a,dataSeries:n,addGraphPoint:t=>{n.addPoint(t),a.updateEndDate()},setBoundaries:(t,e,i)=>{n.setBoundaries(t,e,i)}}}("test","test-canvas",{scale:100,timeStep:1e4});e.setBoundaries("up",500,"blue"),e.setBoundaries("down",300,"green"),setTimeout((()=>{e.setBoundaries("up",800,"blue")}),3e3),setInterval((()=>{e.addGraphPoint(1e3*Math.random())}),1e3/30)}()}));