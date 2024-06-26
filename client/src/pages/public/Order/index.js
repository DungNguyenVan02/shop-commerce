import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiGetOrder, apiUpdateSold, apiUpdateStatusOrder } from "~/apis";
import Pagination from "~/components/Pagination";
import { formatMoney } from "~/utils/helper";

const Order = () => {
	const [orders, setOrders] = useState([]);
	const [query] = useSearchParams();
	const [isRerender, setIsRerender] = useState(false);

	const fetchOrder = async (queries) => {
		const response = await apiGetOrder(queries);
		if (response?.success) {
			setOrders(response);
		}
	};

	useEffect(() => {
		const queries = Object.fromEntries([...query]);
		queries.sort = "-createdAt";
		fetchOrder(queries);
		window.scrollTo(0, 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRerender, query]);

	const handleCanceledOrder = (oid, order) => {
		Swal.fire({
			title: "Bạn có chắc chắn?",
			text: "Hủy bỏ đơn hàng!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Canceled!",
					text: "Đơn hàng đã được hủy",
					icon: "success",
				}).then(async () => {
					const response = await apiUpdateStatusOrder(
						{ status: "Hủy đơn hàng" },
						oid
					);
					if (response?.success) {
						const data = {
							arrProduct: order.products?.map((product) => ({
								quantity: product.quantity,
								pid: product?.product?._id,
								sku: product?.sku,
							})),
							state: 1,
						};
						await apiUpdateSold(data);

						setIsRerender(!isRerender);
					} else {
						toast.warning(response.message);
					}
				});
			}
		});
	};

	const handleReturnOrder = (oid, order) => {
		Swal.fire({
			title: "Bạn có chắc chắn?",
			text: "Đơn hàng sẽ hoàn lại cho đơn vị vận chuyển và nhận tiền!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Xác nhận",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response = await apiUpdateStatusOrder(
					{ status: "Hoàn trả đơn hàng" },
					oid
				);
				if (response?.success) {
					const data = {
						arrProduct: order.products?.map((product) => ({
							quantity: product.quantity,
							pid: product?.product?._id,
							sku: product?.sku,
						})),
						state: 1,
					};
					await apiUpdateSold(data);
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
			text: "Đồng ý thanh toán tiền cho người bán!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Xác nhận",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response = await apiUpdateStatusOrder(
					{ status: "Giao hàng thành công", isPayed: true },
					order._id
				);
				if (response?.success) {
					setIsRerender(!isRerender);
				} else {
					toast.warning(response.message);
				}
			}
		});
	};

	return (
		<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-white uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" className="px-6 py-3">
							#
						</th>

						<th scope="col" className="px-6 py-3">
							Sản phẩm
						</th>

						<th scope="col" className="px-4 py-3">
							Giá
						</th>

						<th scope="col" className="px-5 py-3 text-center">
							Trạng thái
						</th>
						<th scope="col" className="px-2 py-3">
							Ngày đặt
						</th>
						<th scope="col" className="px-5 py-3 text-center">
							Tùy chọn
						</th>
					</tr>
				</thead>
				<tbody>
					{orders?.orders?.map((order, i) => {
						return (
							<tr
								key={order?._id}
								className=" odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
							>
								<td className="px-6 py-3">
									{((+query.get("page") || 1) - 1) *
										process.env.REACT_APP_LIMIT +
										i +
										1}
								</td>
								<td className="px-6 py-3">
									{order?.products.map((item, i) => (
										<div
											className="flex gap-[34px] items-center"
											key={i}
										>
											<Link
												to={`/detail-product/${item.product.category}/${item.product._id}/${item.product.name}`}
											>
												<img
													loading="lazy"
													src={item?.thumbnail}
													alt=""
													className="w-[100px] object-cover mb-2"
												/>
											</Link>
											<div className="text-[#333] text-[14px] flex flex-col">
												<span className="text-[#000D] line-clamp-2">
													{item?.product?.name}
												</span>
												<span className="text-[#000D] line-clamp-2">
													Số lượng: {item?.quantity}
												</span>
												<span>Ram: {item?.ram}</span>
												<span>
													Bộ nhớ:{" "}
													{item?.internalMemory}
												</span>
												<span>
													Màu sắc: {item?.color}
												</span>
											</div>
										</div>
									))}
								</td>

								<td className="px-4 py-3">
									{formatMoney(order?.total)}
								</td>

								<td className="px-4 py-3 text-center">
									{order?.status}
								</td>
								<td className="px-4 py-3 text-center">
									{moment(order?.createdAt).format(
										"DD-MM-YYYY"
									)}
								</td>
								<td className="px-4 py-3 text-center">
									{order?.status === "Đang xử lý" ? (
										<span
											className="cursor-pointer hover:underline text-main"
											onClick={() =>
												handleCanceledOrder(
													order?._id,
													order
												)
											}
										>
											Hủy đơn hàng
										</span>
									) : order?.status === "Đang giao hàng" ? (
										<div className="flex flex-col gap-5 justify-center items-center">
											<span
												className="cursor-pointer hover:underline text-main"
												onClick={() =>
													handleReceivedOrder(order)
												}
											>
												Đã nhận được hàng
											</span>
											<span
												className="cursor-pointer hover:underline opacity-60"
												onClick={() =>
													handleReturnOrder(
														order?._id,
														order
													)
												}
											>
												Yêu cầu trả hàng
											</span>
										</div>
									) : (
										"Hoàn thành"
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className="mt-5">
				<Pagination totalCount={orders?.counts} />
			</div>
		</div>
	);
};

export default Order;
