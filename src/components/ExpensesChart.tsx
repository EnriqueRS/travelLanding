import { useMemo } from "react";
import Chart from "react-apexcharts";

type ExpensesChartProps = {
	labels: string[];
	series: number[];
	colors: string[];
};

export default function ExpensesChart(props: ExpensesChartProps): JSX.Element {
	const { labels, series, colors } = props;

	const { displayLabels, displaySeries, displayColors } = useMemo(() => {
		const total = series.reduce((acc, item) => acc + item, 0);
		if (total <= 0) {
			return {
				displayLabels: ["Sin datos"],
				displaySeries: [1],
				displayColors: ["#cbd5f5"]
			};
		}
		return {
			displayLabels: labels,
			displaySeries: series,
			displayColors: colors
		};
	}, [labels, series, colors]);

	const options = useMemo(
		() => ({
			chart: {
				type: "donut",
				background: "transparent",
				toolbar: {
					show: false
				}
			},
			stroke: {
				colors: ["#0f172a"],
				width: 0
			},
			labels: displayLabels,
			colors: displayColors,
			dataLabels: {
				style: {
					fontSize: "14px",
					fontWeight: 500
				},
				dropShadow: {
					enabled: false
				}
			},
			fill: {
				type: "gradient",
				gradient: {
					type: "diagonal1",
					opacityFrom: 0.9,
					opacityTo: 0.8
				}
			},
			legend: {
				show: false
			},
			responsive: [
				{
					breakpoint: 640,
					options: {
						chart: {
							width: "100%"
						}
					}
				}
			]
		}),
		[displayLabels, displayColors]
	);

	return <Chart type="donut" width="100%" height={320} series={displaySeries} options={options} />;
}


