import React from "react";
import { formatMoney } from "~/utils/helper";
import images from "~/assets/images";
import { apiRemoveCart } from "~/apis";
import withBaseComponent from "../hocs/withBaseComponent";
import { getCurrentUser } from "~/redux/asyncActions";
import { toast } from "react-toastify";

const ItemCart = ({ data, dispatch }) => {
	const handleRemove = async () => {
		const response = await apiRemoveCart(data?.product._id, {
			color: data?.color,
		});
		if (response.success) {
			dispatch(getCurrentUser());
		} else {
			toast.warning(response.mes);
		}
	};

	return (
		<div className="px-3 py-2 flex gap-2">
			<img
				className="w-[50px] h-[50px] object-cover"
				src={data?.thumbnail || images.defaultProduct}
				alt="Product cart"
			/>
			<div className="flex-1">
				<div className="flex justify-between w-full">
					<h3 className="font-semibold text-[#333] line-clamp-1 pr-3">
						{data?.product.name}
					</h3>
					<div>
						<span className="text-main text-[14px] font-normal">
							{formatMoney(data?.price)}
						</span>
						<span className="text-[10px] text-[#757575] mx-1">
							x
						</span>
						<span className="text-[12px] text-[#757575]">
							{data?.quantity}
						</span>
					</div>
				</div>
				<div className="flex justify-between">
					<div className="text-[12px] text-[#757575]">
						<span>Color: </span>
						<span>{data?.color}</span>
					</div>
					<span
						className="text-[14px] hover:text-main"
						onClick={handleRemove}
					>
						Remove
					</span>
				</div>
			</div>
		</div>
	);
};

export default withBaseComponent(ItemCart);
