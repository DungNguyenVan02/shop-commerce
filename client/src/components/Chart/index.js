import React, { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import { apiGetAllOrder } from "~/apis";
import moment from "moment";
import { Line } from "react-chartjs-2";

const ChartSection = ({ orders }) => {
	const [data, setData] = useState({ labels: [], datasets: [] });

	useEffect(() => {
		if (orders) {
			const labels = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			const dataSetup = [
				{
					id: 1,
					title: "Success",
					data: labels.map(() => 0),
				},
				{
					id: 2,
					title: "Processing",
					data: labels.map(() => 0),
				},
				{
					id: 3,
					title: "Return",
					data: labels.map(() => 0),
				},
			];

			orders.forEach((order, index) => {
				dataSetup.forEach((item) => {
					if (
						item.title === "Success" &&
						order.status === "Success"
					) {
						const position =
							+moment(order.createdAt).format("MM") - 1;
						item.data.splice(position, 1, item.data[position] + 1);
					}
					if (item.title === "Return" && order.status === "Return") {
						const position =
							+moment(order.createdAt).format("MM") - 1;
						item.data.splice(position, 1, item.data[position] + 1);
					}
					if (
						item.title === "Processing" &&
						order.status === "Processing"
					) {
						const position =
							+moment(order.createdAt).format("MM") - 1;
						item.data.splice(position, 1, item.data[position] + 1);
					}
				});
			});

			const datasets = dataSetup.map((data) => ({
				label: data.title,
				data: data.data,
				borderColor:
					data.title === "Success"
						? "#51e05d"
						: data.title === "Return"
						? "#e35050"
						: "#4a90e2",
				pointBorderColor:
					data.title === "Success"
						? "#51e05d"
						: data.title === "Return"
						? "#e35050"
						: "#4a90e2",
				pointBackgroundColor: "white",
				pointHoverRadius: 5,
				pointHoverBorderWidth: 3,
				tension: 0.2,
				borderWidth: 3,
			}));

			setData({ labels, datasets });
		}
	}, [orders]);

	const options = {
		responsive: true,
		maintainAspectRatio: true,
		scales: {
			y: {
				ticks: {
					color: "gray",
				},
				grid: { color: "gray", drawTicks: false },
				border: { dash: [3, 4] },
			},
			x: {
				ticks: { color: "gray" },
				grid: { color: "transparent" },
			},
		},
		plugins: {
			legend: true,
		},
		hover: {
			mode: "dataset",
			intersect: false,
		},
	};

	return <Line data={data} options={options} />;
};

export default ChartSection;
