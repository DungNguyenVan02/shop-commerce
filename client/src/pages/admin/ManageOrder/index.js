import moment from "moment";
import { useEffect, useState } from "react";
import { apiGetOrderByAdmin } from "~/apis";
import icons from "~/utils/icons";
import Pagination from "~/components/Pagination";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "~/components/hooks";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import Select from "react-select";

function ManageOrder({ location, navigate }) {
	const [searchQueries] = useSearchParams();
	const { CiSearch, IoTrashBinOutline, FaRegEdit, BiCustomize } = icons;
	const [searchText, setSearchText] = useState({ q: "" });
	const [orders, setOrders] = useState({});
	const [selectedOption, setSelectedOption] = useState(null);
	const [updateOrder, setUpdateOrder] = useState({
		isUpdate: false,
		data: [],
	});

	const options = [
		{ value: "Processing", label: "Processing" },
		{ value: "Success", label: "Success" },
		{ value: "Canceled", label: "Canceled" },
	];

	const fetchGetOrders = async (params) => {
		const response = await apiGetOrderByAdmin({
			...params,
			limit: process.env.REACT_APP_LIMIT,
		});
		if (response.success) {
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
		if (selectedOption && debouncedValue === "") {
			queries.status = selectedOption.value;
		} else if (!selectedOption && debouncedValue) {
			queries.q = debouncedValue;
		} else if (selectedOption && debouncedValue) {
			queries.q = debouncedValue;
			queries.status = selectedOption.value;
		} else {
			navigate({
				pathname: location.pathname,
				search: createSearchParams("").toString(),
			});
		}
		navigate({
			pathname: location.pathname,
			search: createSearchParams("").toString(),
		});

		fetchGetOrders(queries);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue, searchQueries, selectedOption]);

	useEffect(() => {}, [updateOrder]);

	return (
		<div className="w-full">
			{updateOrder.isUpdate && (
				<div className="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-overlay z-[99999999]">
					<div className="bg-white min-w-[700px] h-[90%]"></div>
				</div>
			)}
			<div className="flex items-center h-[40px] bg-gray-600 text-white px-3">
				Manage order
			</div>
			<div className="px-3 bg-gray-100 min-h-screen">
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
					<Select
						isClearable
						defaultValue={selectedOption}
						onChange={setSelectedOption}
						options={options}
						formatOptionLabel={(options) => (
							<div className="flex text-[#333] items-center gap-2">
								<span>{options.label}</span>
							</div>
						)}
						className=" w-[170px]"
					/>
				</div>
				<div className="overflow-x-auto shadow-md sm:rounded-lg">
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									#
								</th>
								<th scope="col" className="px-6 py-3">
									Code
								</th>
								<th scope="col" className="px-6 py-3">
									Quantity
								</th>
								<th scope="col" className="px-6 py-3">
									Total price
								</th>

								<th scope="col" className="px-6 py-3">
									Purchaser
								</th>

								<th scope="col" className="px-6 py-3">
									Phone number
								</th>
								<th scope="col" className="px-6 py-3">
									Status
								</th>
								<th scope="col" className="px-6 py-3">
									createdAt
								</th>
								<th scope="col" className="px-6 py-3">
									Actions
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
											{((+searchQueries.get("page") ||
												1) -
												1) *
												process.env.REACT_APP_LIMIT +
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
											{moment(order?.createdAt).format(
												"DD-MM-YYYY"
											)}
										</td>
										<td className="px-6 py-3">
											<div className="flex items-center justify-center gap-3">
												<span
													className="cursor-pointer opacity-75 hover:opacity-100"
													onClick={() =>
														setUpdateOrder({
															isUpdate: true,
															data: order,
														})
													}
												>
													<FaRegEdit
														size={19}
														color="#43a87b"
													/>
												</span>
												<span className="cursor-pointer opacity-75 hover:opacity-100">
													<BiCustomize
														size={19}
														color="#0B60B0"
													/>
												</span>
												<span className="cursor-pointer opacity-75 hover:opacity-100">
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
				<div className="mt-4 flex justify-end">
					<Pagination totalCount={orders.counts} />
				</div>
			</div>
		</div>
	);
}

export default withBaseComponent(ManageOrder);
