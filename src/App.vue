<template>
	<mdui-layout id="root">
		<mdui-top-app-bar style="position: relative;">
			<mdui-top-app-bar-title>Curve Suite</mdui-top-app-bar-title>
			<div style="flex-grow: 1"></div>
			<mdui-button-icon icon="replay" @click="playCurve" data-toggle="tooltip" title="Play Curve"></mdui-button-icon>
			<mdui-button-icon icon="upload" @click="openFileInput" data-toggle="tooltip" title="Read Curve File"></mdui-button-icon>
		</mdui-top-app-bar>
		<mdui-layout-main id="main"></mdui-layout-main>
		<mdui-card id="chart" ref="chart"></mdui-card>
		<input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
	</mdui-layout>
</template>

<script>
	import * as echarts from 'echarts';
	import 'mdui/components/button-icon.js';
	import 'mdui/components/layout.js';
	import 'mdui/components/layout-item.js';
	import 'mdui/components/layout-main.js';
	import 'mdui/components/top-app-bar.js';
	import 'mdui/components/top-app-bar-title.js';
	import 'mdui/components/card.js';

	export default {
		data() {
			return {
				jsonData: [],
				playbackInterval: null,
			};
		},
		mounted() {
			window.addEventListener("resize", this.resizeChart);
		},
		methods: {
			resizeChart() {
				this.chart.resize();
			},
			openFileInput() {
				this.$refs.fileInput.click();
			},
			async handleFileChange(event) {
				const file = event.target.files[0];
				const curveDataRaw = [];
				const fileReader = new FileReader();
				fileReader.onload = () => {
					const arrayBuffer = fileReader.result;
					const dataView = new DataView(arrayBuffer);
					for (let i = 0; i < dataView.byteLength; i += 32) {
						const tempRange = new Uint8Array(arrayBuffer.slice(i, i + 32));
						curveDataRaw.push(tempRange);
					}
					curveDataRaw.forEach(tempRange => {
						this.zcBytesDecode(tempRange);
					});
					this.initChart();
				};
				fileReader.readAsArrayBuffer(file);
			},
			zcBytesDecode(tempLineList) {
				const tempTimeBuffer = new DataView(tempLineList.buffer).getInt32(19, true);
				if (tempTimeBuffer === 0) return;
				const tempVoltBuffer = new DataView(tempLineList.buffer).getInt32(3, true) / 10000.0;
				if (tempVoltBuffer <= 0.1) return;
				const tempAmpereBuffer = new DataView(tempLineList.buffer).getInt32(7, true) / 10000.0;
				if (tempAmpereBuffer <= 0.1) return;
				const tempAmpereHourBuffer = new DataView(tempLineList.buffer).getInt32(11, true) / 10000.0;
				const tempWattHourBuffer = new DataView(tempLineList.buffer).getInt32(15, true) / 10000.0;
				const tempDpBuffer = new DataView(tempLineList.buffer).getInt16(23, true) / 1000.0;
				const tempDnBuffer = new DataView(tempLineList.buffer).getInt16(25, true) / 1000.0;
				const dataObject = {
					time: this.formatTime(tempTimeBuffer),
					voltage: tempVoltBuffer,
					current: tempAmpereBuffer,
					power: parseFloat((tempVoltBuffer * tempAmpereBuffer).toFixed(4)),
					ampereHour: tempAmpereHourBuffer,
					wattHour: tempWattHourBuffer,
					dp: tempDpBuffer,
					dn: tempDnBuffer
				};
				this.jsonData.push(dataObject);
			},
			formatTime(T) {
				const num = Math.floor(T / 360000);
				const num2 = Math.floor((T % 360000) / 6000);
				const num3 = Math.floor((T % 6000) / 100);
				return this.padZero(num) + ':' + this.padZero(num2) + ':' + this.padZero(num3);
			},
			padZero(number) {
				return number < 10 ? '0' + number : '' + number;
			},
			initChart() {
				this.chart = echarts.init(this.$refs.chart);
				const option = {
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['Voltage', 'Current', 'Power', 'Ah', 'Wh', 'D+', 'D-'],
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					dataZoom: [{
							type: 'inside',
							start: 0,
							end: 100
						},
						{
							start: 0,
							end: 100,
							handleSize: '100%',
							handleStyle: {
								color: '#ddd'
							}
						}
					],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.jsonData.map(item => item.time),
					},
					yAxis: {
						type: 'value'
					},
					series: [{
							name: 'Voltage',
							type: 'line',
							stack: 'Total',
							data: this.jsonData.map(item => item.voltage)
						},
						{
							name: 'Current',
							type: 'line',
							stack: 'Total',
							data: this.jsonData.map(item => item.current)
						},
						{
							name: 'Power',
							type: 'line',
							stack: 'Total',
							data: this.jsonData.map(item => item.power)
						},
						{
							name: 'Ah',
							type: 'line',
							stack: 'Total',
							data: this.jsonData.map(item => item.ampereHour)
						},
						{
							name: 'Wh',
							type: 'line',
							stack: 'Total',
							data: this.jsonData.map(item => item.wattHour)
						},
						{
							name: 'D+',
							type: 'line',
							stack: 'Total',
							data: this.jsonData.map(item => item.dp)
						},
						{
							name: 'D-',
							type: 'line',
							stack: 'Total',
							data: this.jsonData.map(item => item.dn)
						}
					]
				};
				this.chart.setOption(option);
			},
			playCurve() {
				if (this.playbackInterval) {
					clearInterval(this.playbackInterval);
					this.playbackInterval = null;
					return;
				}
				let currentIndex = 0;
				this.playbackInterval = setInterval(() => {
					if (currentIndex >= this.jsonData.length) {
						clearInterval(this.playbackInterval);
						this.playbackInterval = null;
						return;
					}
					this.chart.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: currentIndex
					});
					this.chart.dispatchAction({
						type: 'highlight',
						seriesIndex: 0,
						dataIndex: currentIndex
					});
					currentIndex++;
				}, 100);
			}
		}
	};
</script>

<style>
	body {
		overflow: hidden;
	}

	#root {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	#main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	#chart {
		flex-grow: 1;
		margin: 15px;
		margin-bottom: 15px;
		height: calc(100%);
	}
</style>