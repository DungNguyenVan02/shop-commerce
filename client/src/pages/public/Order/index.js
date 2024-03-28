import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiGetOrder, apiUpdateSold, apiUpdateStatusOrder } from "~/apis";

const Order = () => {
	const [orders, setOrders] = useState([]);
	const [isRerender, setIsRerender] = useState(false);

	const fetchOrder = async () => {
		const response = await apiGetOrder();
		if (response?.success) {
			setOrders(response.listOrder);
		}
	};
	useEffect(() => {
		fetchOrder();
	}, [isRerender]);

	const handleCanceledOrder = (oid) => {
		Swal.fire({
			title: "Bạn có chắc chắn?",
			text: "Cancel order!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Canceled!",
					text: "Order has been deleted.",
					icon: "success",
				}).then(async () => {
					const response = await apiUpdateStatusOrder(
						{ status: "Canceled" },
						oid
					);
					if (response?.success) {
						setIsRerender(!isRerender);
					} else {
						toast.warning(response.message);
					}
				});
			}
		});
	};

	const handleReturnOrder = (oid) => {
		Swal.fire({
			title: "Bạn có chắc chắn?",
			text: "Request for return and refund!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response = await apiUpdateStatusOrder(
					{ status: "Return" },
					oid
				);
				if (response?.success) {
					setIsRerender(!isRerender);
				} else {
					toast.warning(response.message);
				}
			}
		});
	};

	const handleReceivedOrder = (order) => {
		Swal.fire({
			title: "Bạn có chắc chắn?",
			text: "I have received the goods",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response = await apiUpdateStatusOrder(
					{ status: "Success" },
					order._id
				);
				if (response?.success) {
					const data = {
						arrProduct: order?.products?.map((od) => ({
							quantity: od.quantity,
							pid: od?.product?._id,
						})),
					};
					await apiUpdateSold(data);
					setIsRerender(!isRerender);
				} else {
					toast.warning(response.message);
				}
			}
		});
	};
	return (
		<div>
			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" className="px-6 py-3">
							#
						</th>

						<th scope="col" className="px-6 py-3">
							Products
						</th>

						<th scope="col" className="px-4 py-3">
							Price
						</th>

						<th scope="col" className="px-5 py-3 text-center">
							Status
						</th>
						<th scope="col" className="px-2 py-3">
							Created at
						</th>
						<th scope="col" className="px-5 py-3 text-center">
							Options
						</th>
					</tr>
				</thead>
				<tbody>
					{orders?.map((order, i) => {
						return (
							<tr
								key={order?._id}
								className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
							>
								<td className="px-6 py-3">{i + 1}</td>
								<td className="px-6 py-3">
									{order?.products.map((item, i) => (
										<div
											className="flex gap-7 items-center"
											key={i}
										>
											<img
												src={item?.thumbnail}
												alt=""
												className="w-[100px] object-cover mb-2"
											/>
											<div>
												<div className="text-[14px] flex gap-1">
													<span className=" text-[#333] font-semibold">
														Name:{" "}
													</span>
													<span className="line-clamp-2">
														{item?.product?.name}
													</span>
												</div>
												<div className="text-[14px]">
													<span className=" text-[#333] font-semibold">
														Color:{" "}
													</span>
													<span>{item?.color}</span>
												</div>
												<div className="text-[14px]">
													<span className=" text-[#333] font-semibold">
														Quantity:{" "}
													</span>
													{item?.quantity}
												</div>
											</div>
										</div>
									))}
								</td>

								<td className="px-4 py-3">{order?.total} $</td>

								<td className="px-4 py-3 text-center">
									{order?.status}
								</td>
								<td className="px-4 py-3 text-center">
									{moment(order?.updatedAt).format(
										"DD-MM-YYYY"
									)}
								</td>
								<td className="px-4 py-3 text-center">
									{order?.status === "Processing" ? (
										<span
											className="cursor-pointer hover:underline text-main"
											onClick={() =>
												handleCanceledOrder(order?._id)
											}
										>
											Cancel
										</span>
									) : order?.status === "Transported" ? (
										<div className="flex gap-2 justify-center items-center">
											<span
												className="cursor-pointer hover:underline text-main"
												onClick={() =>
													handleReceivedOrder(order)
												}
											>
												Received
											</span>
											<span
												className="cursor-pointer hover:underline text-main"
												onClick={() =>
													handleReturnOrder(
														order?._id
													)
												}
											>
												Return
											</span>
										</div>
									) : (
										"Success"
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Order;
