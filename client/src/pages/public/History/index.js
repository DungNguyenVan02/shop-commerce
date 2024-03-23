import moment from "moment";
import React, { useEffect, useState } from "react";
import { apiGetHistoryOrder } from "~/apis";

const History = () => {
	const [orders, setOrders] = useState([]);
	const fetchOrder = async () => {
		const response = await apiGetHistoryOrder();
		if (response?.success) {
			setOrders(response.listOrder);
		}
	};
	useEffect(() => {
		fetchOrder();
	}, []);

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
					</tr>
				</thead>
				<tbody>
					{orders?.map((order, i) => {
						return (
							<tr
								key={order._id}
								className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
							>
								<td className="px-6 py-3">{i + 1}</td>
								<td className="px-6 py-3">
									{order.products.map((item, i) => (
										<div
											className="flex gap-7 items-center"
											key={i}
										>
											<img
												src={item.thumbnail}
												alt=""
												className="w-[100px] object-cover mb-2"
											/>
											<div>
												<div className="text-[14px] flex gap-1">
													<span className=" text-[#333] font-semibold">
														Name:{" "}
													</span>
													<span className="line-clamp-2">
														{item.product.name}
													</span>
												</div>
												<div className="text-[14px]">
													<span className=" text-[#333] font-semibold">
														Color:{" "}
													</span>
													<span>{item.color}</span>
												</div>
												<div className="text-[14px]">
													<span className=" text-[#333] font-semibold">
														Quantity:{" "}
													</span>
													{item.quantity}
												</div>
											</div>
										</div>
									))}
								</td>

								<td className="px-4 py-3">{order.total} $</td>

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
		</div>
	);
};

export default History;
