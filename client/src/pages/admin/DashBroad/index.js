import { useEffect, useState } from "react";
import { apiGetAllOrder } from "~/apis";
import { DashboardItem } from "~/components/Admin/Dashboard";
import BarChart from "~/components/Chart/Bar";
import LineChart from "~/components/Chart/Line";
import PieChart from "~/components/Chart/Pie";
import { formatMoney } from "~/utils/helper";

function DashBroad() {
	const [orders, setOrders] = useState([]);

	const [successOrder, setSuccessOrder] = useState({
		title: "Giao hàng thành công",
		total: 0,
	});
	const [returnOrder, setReturnOrder] = useState({
		title: "Hoàn trả đơn hàng",
		total: 0,
	});
	const [processingOrder, setProcessingOrder] = useState({
		title: "Đang xử lý",
		total: 0,
	});

	const fetchGetOrders = async () => {
		const response = await apiGetAllOrder();

		if (response?.success) {
			setOrders(response.listOrder);
		}
	};

	useEffect(() => {
		fetchGetOrders();
	}, []);

	useEffect(() => {
		const listOrder = orders.filter(
			(order) => order.status !== "Hủy đơn hàngs"
		);
		if (orders) {
			listOrder?.forEach((order) => {
				if (order.status === "Giao hàng thành công") {
					setSuccessOrder((prev) => ({
						...prev,
						total: prev.total + 1,
					}));
				}
				if (order.status === "Hoàn trả đơn hàng") {
					setReturnOrder((prev) => ({
						...prev,
						total: prev.total + 1,
					}));
				}
				if (order.status === "Đang xử lý") {
					setProcessingOrder((prev) => ({
						...prev,
						total: prev.total + 1,
					}));
				}
			});
		}

		return () => {
			setSuccessOrder((prev) => ({
				...prev,
				total: 0,
			}));
			setReturnOrder((prev) => ({
				...prev,
				total: 0,
			}));
			setProcessingOrder((prev) => ({
				...prev,
				total: 0,
			}));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orders]);

	return (
		<div className="p-5 bg-[#f6f8fb] min-h-screen">
			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center text-black font-semibold text-[24px]">
					Quản lý chung
				</h3>
				<div className="p-5 ">
					<div className="grid wide">
						<div className="row">
							<div className="col g-l-3 g-m-6 g-c-12">
								<DashboardItem data={successOrder} />
							</div>
							<div className="col g-l-3 g-m-6 g-c-12">
								<DashboardItem data={returnOrder} />
							</div>
							<div className="col g-l-3 g-m-6 g-c-12">
								<DashboardItem data={processingOrder} />
							</div>
							<div className="col g-l-3 g-m-6 g-c-12">
								<DashboardItem
									data={{
										title: "Thu nhập",
										total: formatMoney(
											orders
												.filter(
													(order) =>
														order.status ===
														"Giao hàng thành công"
												)
												.reduce((total, item) => {
													return total + item.total;
												}, 0)
										),
									}}
								/>
							</div>
						</div>
						<div className=" w-full mt-5 rounded-md">
							<div className="grid wide">
								<div className="row">
									<div className="col g-l-4 g-m-4 g-c-12">
										<div className="p-3 bg-white border rounded-md shadow-custom_1 h-full">
											<PieChart orders={orders} />
										</div>
									</div>
									<div className="col g-l-8 g-m-8 g-c-12">
										<div className="p-3 bg-white border rounded-md shadow-custom_1">
											<BarChart orders={orders} />
										</div>
									</div>
									<div className="col g-l-12 g-m-12 gc-12 mt-4">
										<div className="p-3 bg-white border rounded-md shadow-custom_1">
											<LineChart orders={orders} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DashBroad;
