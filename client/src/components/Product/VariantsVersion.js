import React, { memo } from "react";
import { formatMoney } from "~/utils/helper";

const VariantsVersion = ({ data, active, onClickActive }) => {
	const idSelected = data?.sku || data?._id;

	return (
		<div
			className="w-1/3"
			onClick={() =>
				onClickActive({
					id: idSelected,
					price: data?.price,
					color: data?.color,
					quantity: data?.quantity,
				})
			}
		>
			<div
				className={`${
					idSelected === active
						? "border-main bg-red-100"
						: " bg-white-200"
				} flex items-center py-[3px] px-[5px] border rounded-md cursor-pointer`}
			>
				<div className="flex flex-col items-center justify-center text-[12px] flex-1">
					<div className="flex gap-2 items-center justify-center text-[14px] font-semibold text-gray-900">
						<span>{data?.ram}</span>
						<span>{data?.internalMemory}</span>
					</div>
					<p>{formatMoney(data?.price)}</p>
				</div>
			</div>
		</div>
	);
};

export default memo(VariantsVersion);
