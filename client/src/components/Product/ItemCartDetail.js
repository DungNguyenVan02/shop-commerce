import React, { memo, useCallback, useEffect, useState } from "react";
import { formatMoney } from "~/utils/helper";
import { SelectQuantity } from "../common";
import images from "~/assets/images";

const ItemCartDetail = ({
	data,
	onChangeChecked,
	checkedList,
	onRemoveCart,
	onUpdateCart,
}) => {
	const [quantity, setQuantity] = useState(data?.quantity);

	// console.log(debounceQuantity);

	useEffect(() => {
		onUpdateCart({ pid: data?.product._id, color: data?.color, quantity });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quantity]);

	// Enter quantity
	const handleQuantity = useCallback(
		(number) => {
			if (+number > data?.product.quantity) {
				setQuantity(data?.product.quantity);
			} else {
				setQuantity(+number);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[quantity]
	);

	// Handle up or down quantity
	const handleChangeQuantity = useCallback(
		(number) => {
			if (+number < 1) {
				setQuantity(1);
			} else if (+number > data?.product.quantity) {
				setQuantity(data?.product.quantity);
			} else {
				setQuantity(+number);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[quantity]
	);

	return (
		<div className="row bg-white text-[#888] text-[14px] items-center px-3 py-[18px] border-b shadow-sm">
			<div className="col g-l-5">
				<div className="flex gap-2 items-center">
					<input
						checked={checkedList?.some(
							(item) =>
								item.pid === data?.product._id &&
								item.color === data?.color
						)}
						onChange={() =>
							onChangeChecked(
								data?._id,
								data?.product._id,
								data?.color
							)
						}
						className="w-[18px] h-[18px]"
						type="checkbox"
					/>
					<div className="flex items-center gap-2">
						<img
							className="w-[80px] h-[80x] object-cover"
							src={data?.thumbnail || images.defaultProduct}
							alt=""
						/>
						<div className="flex flex-col justify-center">
							<span className="text-[#000D] line-clamp-2">
								{data?.product.name}
							</span>
							<span>Color: {data?.color}</span>
						</div>
					</div>
				</div>
			</div>
			<div className=" text-center col g-l-2">
				{formatMoney(data?.price)}
			</div>
			<div className=" text-center col g-l-2">
				<SelectQuantity
					quantity={quantity}
					handleQuantity={handleQuantity}
					handleChangeQuantity={handleChangeQuantity}
				/>
			</div>
			<div className="text-center col g-l-2">
				{formatMoney(data?.price * quantity)}
			</div>
			<div
				className="text-center cursor-pointer hover:underline hover:text-main col g-l-1"
				onClick={() => onRemoveCart(data?._id)}
			>
				Delete
			</div>
		</div>
	);
};

export default memo(ItemCartDetail);
