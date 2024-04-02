import images from "~/assets/images";
import { formatMoney } from "~/utils/helper";
import Select from "react-select";
import { useEffect, useState } from "react";
import { apiPutReturnOrder, apiUpdateStatusOrder } from "~/apis";
import { toast } from "react-toastify";

const UpdateOrder = ({ dataUpdate, onHide, onRerender }) => {
	const [selectedOption, setSelectedOption] = useState(null);
	const [isInvalid, setIsInvalid] = useState(false);
	const options = [
		{ value: "Đang giao hàng", label: "Đang giao hàng" },
		{ value: "Hoàn trả đơn hàng", label: "Hoàn trả đơn hàng" },
		{ value: "Hủy đơn hàng", label: "Hủy đơn hàng" },
	];

	useEffect(() => {
		if (selectedOption !== null) {
			setIsInvalid(false);
		}
	}, [selectedOption]);

	const handleUpdateStatus = async () => {
		if (selectedOption === null) {
			setIsInvalid(true);
		} else {
			let response;
			if (dataUpdate?.status === "Hoàn trả đơn hàng") {
				response = await apiPutReturnOrder(dataUpdate._id);
			} else {
				response = await apiUpdateStatusOrder(
					{ status: selectedOption.value },
					dataUpdate._id
				);
			}
			if (response?.success) {
				onHide({ isUpdate: false, data: [] });
				onRerender((prev) => !prev);
				toast.success("Cập nhật đơn hàng thành công");
			}
		}
	};

	return (
		<div
			className="bg-[#f5f5f5] min-w-[800px] h-[90%] overflow-y-auto"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="tagHeader"></div>
			<div className="p-3 bg-white border-b">
				<h3 className="text-[24px] font-medium">
					Chi tiết đơn đặt hàng
				</h3>
			</div>
			<div className="mt-3 px-2 bg-white flex flex-col gap-2">
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Code: </span>
					<span>{dataUpdate?.code}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Người đặt: </span>
					<span>{dataUpdate?.orderBy?.fullName}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Số điện thoại: </span>
					<span>{dataUpdate?.orderBy?.phone}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Địa chỉ: </span>
					<span>{dataUpdate?.address}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Số lượng sản phẩm: </span>
					<span>
						{dataUpdate?.products.reduce((sum, pro) => {
							return sum + pro.quantity;
						}, 0)}
					</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Tổng tiền: </span>
					<span>{formatMoney(dataUpdate?.total)}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">
						Phương thức thanh toán:{" "}
					</span>
					<span>{dataUpdate?.method}</span>
				</div>
				{dataUpdate.status === "Đang xử lý" && (
					<div className="border p-3 rounded shadow-md">
						<span className="font-semibold">
							Trạng thái đơn hàng{" "}
						</span>
						<Select
							defaultValue={selectedOption}
							onChange={setSelectedOption}
							options={options}
							formatOptionLabel={(options) => (
								<div className="flex text-[#333] items-center gap-2">
									<span>{options.label}</span>
								</div>
							)}
							className=" w-full"
						/>
						{isInvalid && (
							<p className="text-[12px] text-main">
								Vui lòng chọn trạng thái của đơn hàng
							</p>
						)}
					</div>
				)}
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Sản phẩm</span>
					<span>
						{dataUpdate?.products.map((item) => {
							return (
								<div
									key={item._id}
									className="flex items-center gap-5 p-2 mt-2 border rounded"
								>
									<img
										className="w-[100px] object-cover"
										src={
											item.thumbnail ||
											images.defaultProduct
										}
										alt=""
									/>
									<div className="text-[#333] text-[14px] flex flex-col">
										<span className="text-[#000D] line-clamp-2">
											{item?.product.name}
										</span>
										<span className="text-[#000D] line-clamp-2">
											Số lượng: {item?.quantity}
										</span>
										<span>Ram: {item?.ram}</span>
										<span>
											Bộ nhớ: {item?.internalMemory}
										</span>
										<span>Màu sắc: {item?.color}</span>
									</div>
								</div>
							);
						})}
					</span>
				</div>
			</div>
			<div className="flex items-center justify-end  my-5 gap-3 px-5 ">
				<button
					className="px-5 py-2 bg-gray-600 text-white rounded hover:opacity-80"
					onClick={() => onHide({ isUpdate: false, data: [] })}
				>
					Thoát
				</button>
				{dataUpdate?.status === "Đang xử lý" && (
					<button
						className="px-3 py-2 bg-green-500 text-white rounded hover:opacity-80"
						onClick={handleUpdateStatus}
					>
						{dataUpdate.status === "Hoàn trả đơn hàng"
							? "Xác nhận hoàn trả đơn hàng"
							: "Cập nhật"}
					</button>
				)}
			</div>
		</div>
	);
};

export default UpdateOrder;
