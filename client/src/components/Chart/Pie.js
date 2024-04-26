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
import { Pie } from "react-chartjs-2";
import { getMoneyByTime } from "~/utils/helper";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend
);

const PieChart = ({ orders }) => {
	const [data, setData] = useState({ labels: [], datasets: [] });

	const [day, setDay] = useState(null);

	const timeRef = useRef();

	useEffect(() => {
		const date = new Date();
		timeRef.current.valueAsDate = date;
		setDay(date);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (orders) {
			const labels = [
				"Đang xử lý",
				"Giao hàng thành công",
				"Đang giao hàng",
				"Hoàn trả đơn hàng",
				"Hủy đơn hàng",
			];

			const data = [0, 0, 0, 0, 0];

			const getDataByDay = orders.filter(
				(order) =>
					+moment(order.updatedAt).format("DD") ===
					+moment(day).format("DD")
			);

			getDataByDay.forEach((item) => {
				if (item.status === "Đang xử lý") {
					data.splice(0, 1, data[0] + 1);
				} else if (item.status === "Giao hàng thành công") {
					data.splice(1, 1, data[1] + 1);
				} else if (item.status === "Đang giao hàng") {
					data.splice(2, 1, data[2] + 1);
				} else if (item.status === "Hoàn trả đơn hàng") {
					data.splice(3, 1, data[3] + 1);
				} else {
					data.splice(4, 1, data[4] + 1);
				}
			});

			setData({
				labels,
				datasets: [
					{
						label: "Số đơn",
						backgroundColor: [
							"#36a3eb",
							"#3cba9f",
							"#ff9f41",
							"#ffcc55",
							"#ec3434",
						],
						data: data,
					},
				],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orders, day]);

	const options = {
		responsive: true,
		maintainAspectRatio: true,

		plugins: {
			legend: true,
			title: {
				display: true,
				text: "Thống kê đơn hàng theo ngày",
			},
		},
		hover: {
			mode: "dataset",
			intersect: false,
		},
	};

	return (
		<div>
			<div className="px-2 h-[40px] border flex items-center gap-3 rounded-md shadow-custom_1">
				<span>Chọn ngày: </span>
				<input
					className="outline-none"
					ref={timeRef}
					type="date"
					onChange={(e) => {
						setDay(e.target.value);
					}}
				/>
			</div>
			<div className="mt-3 shadow-custom_1 p-2 border rounded-md">
				{orders.length > 0 && (
					<span>
						Tổng doanh thu:{" "}
						{getMoneyByTime(
							day,
							"DD",
							orders.filter(
								(od) => od.status === "Giao hàng thành công"
							)
						)}
					</span>
				)}
			</div>
			<Pie data={data} options={options} />
		</div>
	);
};

export default PieChart;
