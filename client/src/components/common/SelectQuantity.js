import { memo } from "react";
function SelectQuantity({ quantity, handleQuantity, handleChangeQuantity }) {
	return (
		<div className="flex items-center justify-center my-6 text-[24px]">
			<span
				onClick={() => handleChangeQuantity(quantity - 1)}
				className="flex items-center justify-center select-none cursor-pointer hover:bg-gray-300 hover:border-gray-700 h-[32px] w-[32px] border border-r-transparent"
			>
				-
			</span>
			<input
				className="text-center outline-none w-[50px] h-[32px] border text-[16px]"
				type="number"
				value={quantity}
				onChange={(e) => handleQuantity(e.target.value)}
			/>
			<span
				onClick={() => handleChangeQuantity(quantity + 1)}
				className="flex items-center justify-center select-none cursor-pointer hover:bg-gray-300 hover:border-gray-700 h-[32px] w-[32px] border border-l-transparent"
			>
				+
			</span>
		</div>
	);
}

export default memo(SelectQuantity);
