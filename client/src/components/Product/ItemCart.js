import React from "react";
import { formatMoney } from "~/utils/helper";
import images from "~/assets/images";
import { apiRemoveCart } from "~/apis";
import withBaseComponent from "../hocs/withBaseComponent";
import { getCurrentUser } from "~/redux/asyncActions";
import { toast } from "react-toastify";

const ItemCart = ({ data, dispatch }) => {
	const handleRemove = async () => {
		const response = await apiRemoveCart({ arrProduct: [data?._id] });
		if (response?.success) {
			dispatch(getCurrentUser());
		} else {
			toast.warning(response.mes);
		}
	};

	return (
		<div className="px-3 py-2 flex gap-2 items-center ">
			<img
				className="w-[50px] h-[50px] object-cover"
				src={data?.thumbnail || images.defaultProduct}
				alt="Product cart"
			/>
			<div className="flex-1 flex items-center">
				<div className=" w-full">
					<h3 className="font-semibold text-[#333] line-clamp-1 pr-3">
						{data?.product?.name}
					</h3>
					<div className="text-[12px] text-[#757575]">
						<span>Bộ nhớ: </span>
						<span>{data?.internalMemory}</span>
					</div>
					<div className="text-[12px] text-[#757575]">
						<span>Màu sắc: </span>
						<span>{data?.color}</span>
					</div>
				</div>
				<div className="flex flex-col items-end ">
					<div>
						<span className="text-main text-[14px] font-normal">
							{formatMoney(
								(data?.price *
									(100 - data?.product?.discount)) /
									100
							)}
						</span>
						<span className="text-[10px] text-[#757575] mx-1">
							x
						</span>
						<span className="text-[12px] text-[#757575]">
							{data?.quantity}
						</span>
					</div>
					<span
						className="text-[14px] hover:text-main"
						onClick={handleRemove}
					>
						Xóa
					</span>
				</div>
			</div>
		</div>
	);
};

export default withBaseComponent(ItemCart);
