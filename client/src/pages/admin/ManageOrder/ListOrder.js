import moment from "moment";
import { useEffect, useState } from "react";
import { apiDeleteOrder, apiGetOrderByAdmin } from "~/apis";
import icons from "~/utils/icons";
import Pagination from "~/components/Pagination";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "~/components/hooks";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import { UpdateOrder } from "~/components/Admin/ManageOrder";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import images from "~/assets/images";

function ListOrder({ location, navigate }) {
	const [searchQueries] = useSearchParams();
	const { CiSearch, IoTrashBinOutline, FaRegEdit } = icons;
	const [searchText, setSearchText] = useState({ q: "" });
	const [orders, setOrders] = useState({});
	const [isRerender, setIsRerender] = useState(false);
	const [updateOrder, setUpdateOrder] = useState({
		isUpdate: false,
		data: [],
	});

	const fetchGetOrders = async (params) => {
		const response = await apiGetOrderByAdmin({
			...params,
			limit: process.env.REACT_APP_LIMIT,
		});
		if (response?.success) {
			setOrders(response);
		}
	};

	const debouncedValue = useDebounce(searchText.q, 500);

	const handleSearchText = (e) => {
		let valueSearch = e.target.value;
		if (!valueSearch.startsWith(" ")) {
			setSearchText({ q: valueSearch });
		}
	};

	useEffect(() => {
		const queries = Object.fromEntries([...searchQueries]);
		if (debouncedValue) {
			queries.q = debouncedValue;
			navigate({
				pathname: location.pathname,
				search: createSearchParams(queries).toString(),
			});
		} else {
			navigate({
				pathname: location.pathname,
				search: createSearchParams("").toString(),
			});
		}

		fetchGetOrders(queries);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue, searchQueries, isRerender]);

	const handleRemoveOrder = (oid) => {
		Swal.fire({
			title: "Bạn có chắc chắn?",
			text: "Xóa đơn hàng này",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Đồng ý",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Đã xóa!",
					text: "Sản phẩm đã được xóa",
					icon: "success",
				}).then(async () => {
					const response = await apiDeleteOrder(oid);
					if (response?.success) {
						setIsRerender(!isRerender);
					} else {
						toast.warning(response.message);
					}
				});
			}
		});
	};

	return (
		<div
			className="p-5 bg-[#f6f8fb] min-h-screen"
			onClick={() => setUpdateOrder({ isUpdate: false, data: [] })}
		>
			{updateOrder.isUpdate && (
				<div className="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-overlay z-[99999999]">
					<UpdateOrder
						dataUpdate={updateOrder.data}
						onHide={setUpdateOrder}
						onRerender={setIsRerender}
					/>
				</div>
			)}
			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center text-black font-semibold text-[24px]">
					Quản lý đơn đặt hàng
				</h3>
				{orders?.orders?.length > 0 ? (
					<>
						<div className="flex h-[60px] items-center py-3 gap-5">
							<div className="h-full flex items-center border rounded-md ">
								<input
									type="text"
									value={searchQueries.q}
									onChange={handleSearchText}
									placeholder="Enter search order by code"
									className="w-[300px] pl-3 h-full outline-none rounded-md placeholder:text-[14px]"
								/>
								<CiSearch
									size={20}
									className="mx-3 cursor-pointer opacity-80 hover:opacity-100"
								/>
							</div>
						</div>
						<div className="overflow-x-auto shadow-md sm:rounded-lg">
							<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<thead className="text-xs text-white uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400">
									<tr>
										<th scope="col" className="px-6 py-3">
											#
										</th>
										<th scope="col" className="px-6 py-3">
											Mã đơn hàng
										</th>
										<th scope="col" className="px-6 py-3">
											Số lượng
										</th>
										<th scope="col" className="px-6 py-3">
											Tổng tiền
										</th>

										<th scope="col" className="px-6 py-3">
											Người đặt
										</th>
										<th scope="col" className="px-6 py-3">
											Số điện thoại
										</th>
										<th scope="col" className="px-6 py-3">
											Trạng thái
										</th>
										<th scope="col" className="px-6 py-3">
											Ngày đặt
										</th>
										<th scope="col" className="px-6 py-3">
											Tùy chọn
										</th>
									</tr>
								</thead>
								<tbody>
									{orders?.orders?.map((order, index) => {
										return (
											<tr
												key={order._id}
												className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
											>
												<td className="px-6 py-3">
													{((+searchQueries.get(
														"page"
													) || 1) -
														1) *
														process.env
															.REACT_APP_LIMIT +
														index +
														1}
												</td>
												<td className="px-6 py-3">
													{order?.code}
												</td>
												<td className="px-6 py-3">
													{order?.products.length}
												</td>
												<td className="px-6 py-3">
													{order?.total}
												</td>

												<td className="px-6 py-3">
													{`${order?.orderBy?.firstName} ${order?.orderBy?.lastName}`}
												</td>

												<td className="px-6 py-3">
													{order?.orderBy?.phone}
												</td>
												<td className="px-6 py-3">
													{order?.status}
												</td>
												<td className="px-6 py-3">
													{moment(
														order?.createdAt
													).format("DD-MM-YYYY")}
												</td>
												<td className="px-6 py-3">
													<div className="flex items-center justify-center gap-3">
														<span
															className="cursor-pointer opacity-75 hover:opacity-100"
															onClick={(e) => {
																e.stopPropagation();
																setUpdateOrder({
																	isUpdate: true,
																	data: order,
																});
															}}
														>
															<FaRegEdit
																size={19}
																color="#43a87b"
															/>
														</span>
														<span
															className="cursor-pointer opacity-75 hover:opacity-100"
															onClick={() =>
																handleRemoveOrder(
																	order._id
																)
															}
														>
															<IoTrashBinOutline
																size={19}
																color="red"
															/>
														</span>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</>
				) : (
					<div className="flex items-center justify-center gap-10">
						<h3 className="text-[44px]  font-semibold text-gradient-1">
							Chưa có đơn đặt hàng nào
						</h3>
						<div className="p-[34px] border-radius-1 bg-gradient">
							<img src={images?.onlineShopping} alt="" />
						</div>
					</div>
				)}
				<div className="mt-4 flex justify-end">
					<Pagination totalCount={orders.counts} />
				</div>
			</div>
		</div>
	);
}

export default withBaseComponent(ListOrder);
