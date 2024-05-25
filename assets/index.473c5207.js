import{i as e,c as t,a,o as n,b as i}from"./vendor.b3a18405.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const a of e)if("childList"===a.type)for(const e of a.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const r={data:()=>({jsonData:[],playbackInterval:null}),mounted(){window.addEventListener("resize",this.resizeChart)},methods:{resizeChart(){this.chart.resize()},openFileInput(){this.$refs.fileInput.click()},async handleFileChange(e){const t=e.target.files[0],a=[],n=new FileReader;n.onload=()=>{const e=n.result,t=new DataView(e);for(let n=0;n<t.byteLength;n+=32){const t=new Uint8Array(e.slice(n,n+32));a.push(t)}a.forEach((e=>{this.zcBytesDecode(e)})),this.initChart()},n.readAsArrayBuffer(t)},zcBytesDecode(e){const t=new DataView(e.buffer).getInt32(19,!0);if(0===t)return;const a=new DataView(e.buffer).getInt32(3,!0)/1e4;if(a<=.1)return;const n=new DataView(e.buffer).getInt32(7,!0)/1e4;if(n<=.1)return;const i=new DataView(e.buffer).getInt32(11,!0)/1e4,r=new DataView(e.buffer).getInt32(15,!0)/1e4,o=new DataView(e.buffer).getInt16(23,!0)/1e3,l=new DataView(e.buffer).getInt16(25,!0)/1e3,s={time:this.formatTime(t),voltage:a,current:n,power:parseFloat((a*n).toFixed(4)),ampereHour:i,wattHour:r,dp:o,dn:l};this.jsonData.push(s)},formatTime(e){const t=Math.floor(e/36e4),a=Math.floor(e%36e4/6e3),n=Math.floor(e%6e3/100);return this.padZero(t)+":"+this.padZero(a)+":"+this.padZero(n)},padZero:e=>e<10?"0"+e:""+e,initChart(){this.chart=e(this.$refs.chart);const t={tooltip:{trigger:"axis"},legend:{data:["Voltage","Current","Power","Ah","Wh","D+","D-"]},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},toolbox:{feature:{saveAsImage:{}}},dataZoom:[{type:"inside",start:0,end:100},{start:0,end:100,handleSize:"100%",handleStyle:{color:"#ddd"}}],xAxis:{type:"category",boundaryGap:!1,data:this.jsonData.map((e=>e.time))},yAxis:{type:"value"},series:[{name:"Voltage",type:"line",stack:"Total",data:this.jsonData.map((e=>e.voltage))},{name:"Current",type:"line",stack:"Total",data:this.jsonData.map((e=>e.current))},{name:"Power",type:"line",stack:"Total",data:this.jsonData.map((e=>e.power))},{name:"Ah",type:"line",stack:"Total",data:this.jsonData.map((e=>e.ampereHour))},{name:"Wh",type:"line",stack:"Total",data:this.jsonData.map((e=>e.wattHour))},{name:"D+",type:"line",stack:"Total",data:this.jsonData.map((e=>e.dp))},{name:"D-",type:"line",stack:"Total",data:this.jsonData.map((e=>e.dn))}]};this.chart.setOption(t)},playCurve(){if(this.playbackInterval)return clearInterval(this.playbackInterval),void(this.playbackInterval=null);let e=0;this.playbackInterval=setInterval((()=>{if(e>=this.jsonData.length)return clearInterval(this.playbackInterval),void(this.playbackInterval=null);this.chart.dispatchAction({type:"showTip",seriesIndex:0,dataIndex:e}),this.chart.dispatchAction({type:"highlight",seriesIndex:0,dataIndex:e}),e++}),100)}}},o={id:"root"},l={style:{position:"relative"}},s=a("mdui-top-app-bar-title",null,"Curve Suite",-1),d=a("div",{style:{"flex-grow":"1"}},null,-1),c=a("mdui-layout-main",{id:"main"},null,-1),p={id:"chart",ref:"chart"};r.render=function(e,i,r,u,h,f){return n(),t("mdui-layout",o,[a("mdui-top-app-bar",l,[s,d,a("mdui-button-icon",{icon:"replay",onClick:i[0]||(i[0]=(...e)=>f.playCurve&&f.playCurve(...e)),"data-toggle":"tooltip",title:"Play Curve"}),a("mdui-button-icon",{icon:"upload",onClick:i[1]||(i[1]=(...e)=>f.openFileInput&&f.openFileInput(...e)),"data-toggle":"tooltip",title:"Read Curve File"})]),c,a("mdui-card",p,null,512),a("input",{ref:"fileInput",type:"file",style:{display:"none"},onChange:i[2]||(i[2]=(...e)=>f.handleFileChange&&f.handleFileChange(...e))},null,544)])},i(r).mount("#app");
