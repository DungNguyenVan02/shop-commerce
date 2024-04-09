import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { apiDeleteVariant, apiGetProduct } from "~/apis";
import images from "~/assets/images";
import { formatMoney } from "~/utils/helper";
import icons from "~/utils/icons";
import UpdateVariants from "./UpdateVariants";

const DetailProduct = ({ detailProduct, onRerender }) => {
	const { FaRegEdit, IoTrashBinOutline } = icons;
	const [product, setProduct] = useState(detailProduct);
	const [isRerender, setIsRerender] = useState(detailProduct);

	const [update, setUpdate] = useState({
		isUpdate: false,
		data: null,
	});

	const [heightScroll, setHeightScroll] = useState(window.scrollY);

	const containerRef = useRef();

	useEffect(() => {
		const scroll = () => {
			setHeightScroll(window.scrollY);
		};

		window.addEventListener("scroll", scroll);

		return () => {
			window.removeEventListener("scroll", scroll);
		};
	}, [isRerender]);

	useEffect(() => {
		containerRef.current.style.marginTop = heightScroll + 120 + "px";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetProduct = async () => {
		const response = await apiGetProduct(product?._id);
		if (response?.success) {
			setProduct(response.getProduct);
		}
	};

	useEffect(() => {
		fetProduct();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRerender]);

	const handleDelete = (sku) => {
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
					await apiDeleteVariant(product?._id, sku);
					setIsRerender(!isRerender);
					onRerender((prev) => !prev);
				});
			}
		});
	};

	return (
		<div
			ref={containerRef}
			className="flex justify-center animate-slideTopForm"
		>
			{update.isUpdate && (
				<div
					onClick={(e) => e.stopPropagation()}
					className="absolute top-0 left-0 right-0 bottom-0 z-[999999]  "
				>
					<UpdateVariants
						dataUpdate={update.data}
						onHide={setUpdate}
						pid={product._id}
						onRerender={setIsRerender}
					/>
				</div>
			)}
			<div
				onClick={(e) => e.stopPropagation()}
				className="min-w-[90%]  py-6 px-3 bg-white border rounded-lg shadow-custom_1 overflow-y-auto max-h-[500px]"
			>
				<div className="pb-3 text-black font-semibold text-[20px] p border-b-[2px]">
					<span>Thông tin sản phẩm: </span>
					<span className="text-blue-600 text-[24px]">
						{product.name}
					</span>
				</div>

				<div className="overflow-x-auto ">
					<table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
						<thead className="text-left">
							<tr>
								<th className="whitespace-nowrap p-2 font-medium text-gray-900 text-center">
									#
								</th>
								<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
									Hình ảnh
								</th>
								<th className="whitespace-nowrap px-10 py-2 font-medium text-gray-900">
									Thông tin
								</th>
								<th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
									Số lượng
								</th>
								<th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
									Lượt bán
								</th>
								<th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
									Giá sản phẩm
								</th>
								<th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
									Giảm giá
								</th>
								<th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
									Ngày tạo
								</th>
								<th className="px-4 py-2 text-center">
									Lựa chọn
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-200">
							{product?.variants?.map((item, i) => {
								return (
									<tr key={item?._id}>
										<td className="whitespace-nowrap px-2 text-gray-700">
											{i + 1}
										</td>
										<td className="whitespace-nowrap px-4 py-2 text-gray-700">
											<img
												loading="lazy"
												className="w-[50px] object-cover"
												src={
													item?.thumbnail ||
													images.defaultProduct
												}
												alt=""
											/>
										</td>
										<td className="whitespace-nowrap px-4 py-2 text-gray-700">
											<div>
												<div className="flex items-center gap-1">
													<h4>Màu sắc: </h4>
													<span>{item?.color}</span>
												</div>
												<div className="flex items-center gap-1">
													<h4>Ram: </h4>
													<span>{item?.ram}</span>
												</div>
												<div className="flex items-center gap-1">
													<h4>Bộ nhớ: </h4>
													<span>
														{item?.internalMemory}
													</span>
												</div>
											</div>
										</td>
										<td className="text-center whitespace-nowrap px-4 py-2 text-gray-700">
											{item?.quantity}
										</td>
										<td className="text-center whitespace-nowrap px-4 py-2 text-gray-700">
											{item?.sold}
										</td>
										<td className="text-center whitespace-nowrap px-4 py-2 text-gray-700">
											{formatMoney(item?.price)}
										</td>
										<td className="text-center whitespace-nowrap px-4 py-2 text-gray-700">
											{item?.discount}%
										</td>
										<td className="text-center whitespace-nowrap px-4 py-2 text-gray-700">
											{moment(item?.createdAt).format(
												"DD.MM.YYYY"
											)}
										</td>
										<td className="whitespace-nowrap px-4 py-2 ">
											<div className="flex items-center gap-2 justify-center">
												<span
													onClick={() =>
														setUpdate({
															isUpdate: true,
															data: item,
														})
													}
													className="cursor-pointer opacity-75 hover:opacity-100"
												>
													<FaRegEdit
														size={19}
														color="#43a87b"
													/>
												</span>
												<span
													onClick={() =>
														handleDelete(item?.sku)
													}
													className="cursor-pointer opacity-75 hover:opacity-100"
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
			</div>
		</div>
	);
};

export default DetailProduct;
