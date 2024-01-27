import moment from "moment";
import { useEffect, useState } from "react";
import icons from "~/utils/icons";
import { apiDeleteProduct, apiGetProducts } from "~/apis";
import Pagination from "~/components/Pagination";
import { formatMoney } from "~/utils/helper";
import { FilterProduct } from "~/components/Filter";
import { useSearchParams, createSearchParams } from "react-router-dom";
import { useDebounce } from "~/components/hooks";
import Swal from "sweetalert2";
import {
	UpdateProduct,
	VariantsProduct,
} from "~/layouts/components/admin/Product";
import withBaseComponent from "~/components/hocs/withBaseComponent";

function ManageProducts({ location, navigate }) {
	const [searchQueries] = useSearchParams();
	const { CiSearch, FaRegEdit, IoTrashBinOutline, BiCustomize } = icons;
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

	const debouncedValue = useDebounce(searchText.q, 500);

	const handleSearchText = (e) => {
		let valueSearch = e.target.value;
		if (!valueSearch.startsWith(" ")) {
			setSearchText({ q: valueSearch });
		}
	};

	const fetchProducts = async (queries) => {
		const response = await apiGetProducts({ ...queries });
		if (response.success) {
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
	}, [debouncedValue, searchQueries, isRerender, updateProduct]);

	const handleDelete = (pid) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Are you really want remove this product?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel!",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Deleted!",
					text: "Your product has been deleted.",
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
		<>
			{updateProduct.isUpdate && (
				<div className="absolute top-0 right-0 bottom-0 left-0 z-40 flex flex-col">
					<UpdateProduct
						dataUpdate={updateProduct?.data}
						onHandleHide={setUpdateProduct}
					/>
				</div>
			)}
			{variantsProduct.isVariants && (
				<div className="absolute top-0 right-0 bottom-0 left-0 z-40 flex flex-col">
					<VariantsProduct
						variantsProduct={variantsProduct?.data}
						onHandleHide={setVariantsProduct}
					/>
				</div>
			)}
			<div className="">
				<div className="flex items-center h-[40px] bg-gray-600 text-white px-3">
					Manage create products
				</div>
				<div className="px-3 bg-gray-100 min-h-screen">
					<div className="flex h-[88px] items-end py-3 gap-5">
						<div className="h-[40px] flex items-center border rounded-md ">
							<input
								type="text"
								value={searchQueries.q}
								onChange={handleSearchText}
								placeholder="Enter search user by name or brand"
								className="w-[300px] pl-3 h-full outline-none rounded-md placeholder:text-[14px]"
							/>
							<CiSearch
								size={20}
								className="mx-3 cursor-pointer opacity-80 hover:opacity-100"
							/>
						</div>
						<FilterProduct customStyle />
					</div>
					<div className="overflow-x-auto shadow-md sm:rounded-lg">
						<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
							<thead className="text-xs text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
								<tr>
									<th scope="col" className="px-6 py-3">
										#
									</th>
									<th scope="col" className="px-6 py-3">
										Thumb
									</th>
									<th scope="col" className="px-6 py-3">
										Name
									</th>
									<th scope="col" className="px-4 py-3">
										Category
									</th>
									<th scope="col" className="px-6 py-3">
										Color
									</th>
									<th scope="col" className="px-4 py-3">
										Price
									</th>

									<th scope="col" className="px-2 py-3">
										Quantity
									</th>
									<th scope="col" className="px-2 py-3">
										Sold
									</th>
									<th scope="col" className="px-2 py-3">
										Ratings
									</th>
									<th scope="col" className="px-1 py-3">
										Variants
									</th>
									<th
										scope="col"
										className="px-5 py-3 text-center"
									>
										Updated at
									</th>
									<th scope="col" className="px-6 py-3">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{products?.products?.map((product, index) => {
									return (
										<tr
											key={product._id}
											className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
										>
											<td className="px-6 py-3">
												{((+searchQueries.get("page") ||
													1) -
													1) *
													process.env
														.REACT_APP_LIMIT +
													index +
													1}
											</td>
											<td className="px-6 py-3">
												<img
													className="w-[100px] object-cover"
													src={product?.thumb}
													alt={product?.name}
												/>
											</td>
											<td className="px-6 py-3">
												{product?.name}
											</td>
											<td className="px-4 py-3">
												{product?.category}
											</td>
											<td className="px-6 py-3">
												{product?.color}
											</td>

											<td className="px-6 py-3">
												{formatMoney(product?.price)}
											</td>
											<td className=" py-3 text-center">
												{product?.quantity}
											</td>
											<td className=" py-3 text-center">
												{product?.sold}
											</td>
											<td className="py-3 text-center">
												{product?.totalRatings}
											</td>
											<td className="py-3 text-center">
												{product?.variants.length}
											</td>
											<td className="px-5 py-3 text-center">
												{moment(
													product.createdAt
												).format("DD.MM.YYYY")}
											</td>
											<td className="px-6 py-3">
												<div className="flex items-center justify-center gap-3">
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
		</>
	);
}

export default withBaseComponent(ManageProducts);
