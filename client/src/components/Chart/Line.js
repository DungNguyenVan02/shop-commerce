import React, { useEffect, useRef, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
} from "chart.js/auto";
import moment from "moment";
import { Line } from "react-chartjs-2";
import { getMoneyByTime } from "~/utils/helper";
import Select from "react-select";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend
);

const LineChart = ({ orders }) => {
	const [data, setData] = useState({ labels: [], datasets: [] });
	const [optionYear, setOptionYear] = useState([]);

	const [year, setYear] = useState(null);

	useEffect(() => {
		const date = new Date();
		setYear(date.getFullYear());

		const yearHere = date.getFullYear();

		const yearLength = 10;

		const result = [];

		for (let i = 9; i > 0; i--) {
			result.push({
				label: `Năm ${yearHere - i}`,
				value: yearHere - i,
			});
		}

		result.push({
			label: `Năm ${yearHere}`,
			value: yearHere,
		});

		setOptionYear(result);
	}, []);

	useEffect(() => {
		if (orders) {
			const labels = [
				"Tháng 1",
				"Tháng 2",
				"Tháng 3",
				"Tháng 4",
				"Tháng 5",
				"Tháng 6",
				"Tháng 7",
				"Tháng 8",
				"Tháng 9",
				"Tháng 10",
				"Tháng 11",
				"Tháng 12",
			];
			const dataSetup = [
				{
					id: 1,
					title: "Giao hàng thành công",
					data: labels.map(() => 0),
				},
			];

			const filterOrderByYear = orders.filter(
				(order) => +moment(order).format("YYYY") === year
			);

			if (filterOrderByYear.length > 0) {
				filterOrderByYear.forEach((order, index) => {
					dataSetup.forEach((item) => {
						if (
							item.title === "Giao hàng thành công" &&
							order.status === "Giao hàng thành công"
						) {
							const position =
								+moment(order.createdAt).format("MM") - 1;
							item.data.splice(
								position,
								1,
								item.data[position] + 1
							);
						}
					});
				});
			}

			const datasets = dataSetup.map((data) => ({
				label: data.title,
				data: data.data,
				borderColor: "#51e05d",

				pointBorderColor: "#51e05d",
				pointBackgroundColor: "white",

				pointHoverRadius: 5,
				pointHoverBorderWidth: 3,
				tension: 0.2,
				borderWidth: 3,
				fill: true,
			}));

			setData({ labels, datasets });
		}
	}, [orders, year]);

	const options = {
		responsive: true,
		maintainAspectRatio: true,
		scales: {
			y: {
				grid: { color: "#f2f2f2", drawTicks: false },
			},
			x: {
				grid: { color: "#f2f2f2" },
			},
		},
		plugins: {
			legend: true,
			title: {
				display: true,
				text: "Thống kê đơn theo năm",
			},
		},
		hover: {
			mode: "dataset",
			intersect: false,
		},
	};

	const customStyles = {
		// Style cho container chứa Select
		container: (provided) => ({
			...provided,
			width: "300px",
			border: "none",
		}),
		// Style cho dropdown menu
		menu: (provided) => ({
			...provided,
			backgroundColor: "#f2f2f2",
			border: "none",
		}),
		// Style cho mỗi phần tử trong dropdown menu
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected ? "#007bff" : "transparent",
			color: state.isSelected ? "#fff" : "#333",
			":hover": {
				backgroundColor: "#007bff",
				color: "#fff",
			},
		}),
		// Style cho phần tử đã chọn
		singleValue: (provided) => ({
			...provided,
			color: "#333",
		}),
	};

	return (
		<div>
			<div className="h-[40px] border flex items-center gap-3 rounded-md shadow-custom_1">
				<Select
					styles={customStyles}
					value={optionYear.find((item) => item.value === year)}
					options={optionYear}
					onChange={(e) => setYear(e.value)}
				/>
			</div>
			<div className="mt-3 shadow-custom_1 p-2 border rounded-md">
				{orders.length > 0 && (
					<span>
						Tổng doanh thu: {getMoneyByTime(year, "YYYY", orders)}
					</span>
				)}
			</div>
			<Line data={data} options={options} />
		</div>
	);
};

export default LineChart;
