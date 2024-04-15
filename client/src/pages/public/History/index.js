import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiGetHistoryOrder } from "~/apis";
import Pagination from "~/components/Pagination";
import { formatMoney } from "~/utils/helper";

const History = () => {
	const [orders, setOrders] = useState([]);
	const [query] = useSearchParams();

	const fetchOrder = async (queries) => {
		const response = await apiGetHistoryOrder(queries);
		if (response?.success) {
			setOrders(response);
		}
	};
	useEffect(() => {
		const queries = Object.fromEntries([...query]);

		fetchOrder(queries);
		window.scrollTo(0, 0);
	}, [query]);

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
					</tr>
				</thead>
				<tbody>
					{orders?.orders?.map((order, i) => {
						return (
							<tr
								key={order._id}
								className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
							>
								<td className="px-6 py-3">
									{((+query.get("page") || 1) - 1) *
										process.env.REACT_APP_LIMIT +
										i +
										1}
								</td>
								<td className="px-6 py-3">
									{order.products.map((item, i) => (
										<div
											className="flex gap-7 items-center mb-5"
											key={i}
										>
											<Link
												to={`/detail-product/${item.product.category}/${item.product._id}/${item.product?.name}`}
											>
												<img
													loading="lazy"
													src={item.thumbnail}
													alt=""
													className="w-[100px] object-cover mb-2"
												/>
											</Link>
											<div className="text-[#333] text-[14px] flex flex-col">
												<span className="text-[#000D] line-clamp-2">
													{item?.product.name}
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
									{formatMoney(order.total)}
								</td>

								<td className="px-4 py-3 text-center">
									{order.status}
								</td>
								<td className="px-4 py-3 text-center">
									{moment(order.updatedAt).format(
										"DD-MM-YYYY"
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

export default History;
