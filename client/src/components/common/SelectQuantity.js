import { memo } from "react";
function SelectQuantity({
	quantity,
	handleQuantity,
	handleChangeQuantity,
	customStyle,
}) {
	const handleChangeInput = (e) => {
		const value = e.target.value;
		if (!value.startsWith(0) && value !== 0 && value !== "") {
			handleQuantity(value);
		} else {
			handleQuantity(1);
		}
	};
	return (
		<div
			className={` ${
				customStyle
					? customStyle
					: "flex items-center justify-center my-6 text-[24px]"
			}  `}
		>
			<span
				onClick={() => handleChangeQuantity(quantity - 1)}
				className="flex items-center justify-center select-none cursor-pointer hover:bg-gray-300 hover:border-gray-700 h-[32px] w-[32px] border border-r-transparent"
			>
				-
			</span>
			<input
				className="text-center outline-none w-[50px] h-[32px] border text-[16px]"
				value={quantity}
				min="1"
				type="number"
				onChange={(e) => handleChangeInput(e)}
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
