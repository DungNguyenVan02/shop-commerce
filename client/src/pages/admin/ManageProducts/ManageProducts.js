import moment from "moment";
import { useEffect, useState } from "react";
import icons from "~/utils/icons";
import { apiDeleteProduct, apiGetProducts } from "~/apis";
import Pagination from "~/components/Pagination";
import { formatMoney } from "~/utils/helper";
import { useSearchParams, createSearchParams } from "react-router-dom";
import { useDebounce } from "~/components/hooks";
import Swal from "sweetalert2";
import {
	CreateVariants,
	DetailProduct,
	UpdateProduct,
} from "~/layouts/components/admin/Product";
import withBaseComponent from "~/components/hocs/withBaseComponent";

function ManageProducts({ location, navigate }) {
	const [searchQueries] = useSearchParams();
	const { CiSearch, FaRegEdit, IoTrashBinOutline, BiCustomize, FaRegEye } =
		icons;
	const [searchText, setSearchText] = useState({ q: "" });
	const [products, setProducts] = useState([]);
	const [isRerender, setIsRender] = useState(false);

	const [updateProduct, setUpdateProduct] = useState({
		isUpdate: false,
		data: null,
	});
	const [variantsProduct, setVariantsProduct] = useState({
		isVariants: false,
		data: null,
	});

	const [detailProduct, setDetailProduct] = useState({
		isDetail: false,
		data: null,
	});

	const debouncedValue = useDebounce(searchText.q, 500);

	const handleSearchText = (e) => {
		let valueSearch = e.target.value;
		if (!valueSearch.startsWith(" ")) {
			setSearchText({ q: valueSearch });
		}
	};

	const fetchProducts = async (queries) => {
		const response = await apiGetProducts({ ...queries });
		if (response?.success) {
			setProducts(response);
		}
	};

	useEffect(() => {
		const queries = Object.fromEntries([...searchQueries]);
		if (debouncedValue) {
			queries.q = debouncedValue;
			queries.page = 1;
			navigate({
				pathname: location.pathname,
				search: createSearchParams(queries).toString(),
			});
		}
		if (debouncedValue === "") {
			searchQueries.get("q") &&
				navigate({
					pathname: location.pathname,
					search: createSearchParams("").toString(),
				});
		}

		fetchProducts(queries);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		debouncedValue,
		searchQueries,
		isRerender,
		updateProduct,
		variantsProduct,
	]);

	const handleDelete = (pid) => {
		Swal.fire({
			title: "Bạn có chắc chắn?",
			text: "Bạn có chắc muốn xóa sản phẩm này?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Đồng ý",
			cancelButtonText: "Thoát",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Đã xóa!",
					text: "Sản phẩm đã được xóa",
					icon: "success",
				}).then(async () => {
					await apiDeleteProduct(pid);
					setIsRender(!isRerender);
					navigate({
						pathname: location.pathname,
						search: createSearchParams("").toString(),
					});
				});
			}
		});
	};

	return (
		<div className="p-5 bg-[#f6f8fb] min-h-screen">
			{updateProduct.isUpdate && (
				<div
					className={`absolute top-0 right-0 bottom-0 left-0 z-40 min-h-screen bg-[#f6f8fb]`}
				>
					<UpdateProduct
						dataUpdate={updateProduct?.data}
						onHandleHide={setUpdateProduct}
					/>
				</div>
			)}
			{variantsProduct.isVariants && (
				<div
					onClick={() =>
						setVariantsProduct({
							isVariants: false,
							data: null,
						})
					}
					className="absolute top-0 right-0 bottom-0 left-0 z-40  bg-[rgba(10,10,10,0.2)]"
				>
					<CreateVariants
						variantsProduct={variantsProduct?.data}
						onHandleHide={setVariantsProduct}
					/>
				</div>
			)}
			{detailProduct.isDetail && (
				<div
					onClick={() =>
						setDetailProduct({
							isDetail: false,
							data: null,
						})
					}
					className="absolute top-0 right-0 bottom-0 left-0 z-40  bg-[rgba(10,10,10,0.2)]"
				>
					<DetailProduct
						detailProduct={detailProduct.data}
						onRerender={setIsRender}
					/>
				</div>
			)}
			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center text-black font-semibold text-[24px]">
					Quản lý sản phẩm
				</h3>
				<div className="flex h-[60px] items-center py-3 gap-5">
					<div className="h-full flex items-center border rounded-md shadow-custom ">
						<input
							type="text"
							value={searchText.q}
							onChange={handleSearchText}
							placeholder="Tìm kiếm theo tên & thương hiệu sản phẩm"
							className="min-w-[360px] pl-3 h-full outline-none bg-transparent placeholder:text-[14px]"
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
								<th scope="col" className="px-4 py-3">
									Hình ảnh
								</th>
								<th scope="col" className="px-4 py-3">
									Sản phẩm
								</th>

								<th scope="col" className="px-6 py-3">
									Phiên bản
								</th>
								<th scope="col" className="px-4 py-3">
									Giá
								</th>
								<th scope="col" className="p-3">
									Giảm giá
								</th>
								<th scope="col" className="px-4 py-3">
									Số lượng
								</th>
								<th scope="col" className="p-3">
									Lượt bán
								</th>
								<th scope="col" className="p-3">
									Đánh giá
								</th>
								<th scope="col" className="p-3">
									Biến thể
								</th>
								<th
									scope="col"
									className="px-5 py-3 text-center"
								>
									Ngày tạo
								</th>
								<th scope="col" className="px-6 py-3">
									Tùy chọn
								</th>
							</tr>
						</thead>
						<tbody>
							{products?.products?.map((product, index) => {
								return (
									<tr
										key={product._id}
										className="cursor-pointer hover:bg-[rgba(155,155,155,0.1)]  ease-in-out odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
										onClick={() => {
											if (product?.variants.length > 0) {
												setDetailProduct({
													isDetail: true,
													data: product,
												});
											}
										}}
									>
										<td className=" px-6 py-3">
											{((+searchQueries.get("page") ||
												1) -
												1) *
												process.env.REACT_APP_LIMIT +
												index +
												1}
										</td>
										<td className=" px-4 py-3">
											<img
												className="w-[40px] object-cover"
												src={product?.thumb}
												alt={product?.name}
											/>
										</td>
										<td className=" px-4 py-3">
											<div className="flex flex-col gap-2">
												<span className="line-clamp-2">
													{product?.category}
												</span>
												<span className="line-clamp-2">
													{product?.name}
												</span>
											</div>
										</td>

										<td className=" px-6 py-3">
											<div className="flex flex-col gap-1">
												<span>
													Màu sắc: {product?.color}
												</span>
												<span>Ram: {product?.ram}</span>
												<span>
													Bộ nhớ trong:{" "}
													{product?.internalMemory}
												</span>
											</div>
										</td>

										<td className=" px-6 py-3">
											{formatMoney(product?.price)}
										</td>
										<td className=" p-3">
											{product?.discount}%
										</td>
										<td className="  py-3 text-center">
											{product?.quantity}
										</td>
										<td className="  py-3 text-center">
											{product?.sold}
										</td>
										<td className=" py-3 text-center">
											{product?.totalRatings}
										</td>
										<td className=" px-6 py-3 text-center cursor-pointer">
											{product?.variants.length}
										</td>
										<td className=" px-5 py-3 text-center">
											{moment(product.createdAt).format(
												"DD.MM.YYYY"
											)}
										</td>
										<td className=" px-6 py-3">
											<div
												onClick={(e) =>
													e.stopPropagation()
												}
												className="flex items-center justify-center gap-3"
											>
												<span
													className="cursor-pointer opacity-75 hover:opacity-100"
													onClick={() =>
														setUpdateProduct({
															isUpdate: true,
															data: product,
														})
													}
												>
													<FaRegEdit
														size={19}
														color="#43a87b"
													/>
												</span>
												<span
													className="cursor-pointer opacity-75 hover:opacity-100"
													onClick={() =>
														setVariantsProduct({
															isVariants: true,
															data: product,
														})
													}
												>
													<BiCustomize
														size={19}
														color="#0B60B0"
													/>
												</span>
												<span
													className="cursor-pointer opacity-75 hover:opacity-100"
													onClick={() =>
														handleDelete(
															product._id
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
				<div className="py-4 flex justify-end">
					<Pagination totalCount={products.counts} />
				</div>
			</div>
		</div>
	);
}

export default withBaseComponent(ManageProducts);
