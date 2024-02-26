import { useEffect, useState } from "react";
import { apiGetAllOrder } from "~/apis";
import { DashboardItem } from "~/components/Admin/Dashboard";
import ChartSection from "~/components/Chart";

function DashBroad() {
	const [orders, setOrders] = useState([]);
	const [successOrder, setSuccessOrder] = useState({
		title: "Success",
		total: 0,
	});
	const [returnOrder, setReturnOrder] = useState({
		title: "Processing",
		total: 0,
	});
	const [processingOrder, setProcessingOrder] = useState({
		title: "Return",
		total: 0,
	});
	const fetchGetOrders = async () => {
		const response = await apiGetAllOrder();

		if (response.success) {
			setOrders(response.listOrder);
		}
	};

	useEffect(() => {
		fetchGetOrders();
	}, []);

	useEffect(() => {
		const listOrder = orders.filter((order) => order.status !== "Canceled");
		if (orders) {
			listOrder?.forEach((order) => {
				if (order.status === "Success") {
					setSuccessOrder((prev) => ({
						...prev,
						total: prev.total + 1,
					}));
				}
				if (order.status === "Return") {
					setReturnOrder((prev) => ({
						...prev,
						total: prev.total + 1,
					}));
				}
				if (order.status === "Processing") {
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
		<div className="bg-[#f5f5f5] min-h-full ">
			<div className="flex items-center h-[40px] bg-gray-600 text-white px-3">
				Manage dashboard
			</div>
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
									title: "Earning",
									total:
										"$" +
										Math.floor(
											orders
												.filter(
													(order) =>
														order.status ===
														"Success"
												)
												.reduce((total, item) => {
													return total + item.total;
												}, 0)
										),
								}}
							/>
						</div>
					</div>
					<div className="max-h-[630px] w-full bg-white shadow-custom p-3 mt-5 rounded-md">
						<ChartSection orders={orders} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default DashBroad;
