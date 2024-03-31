import React, { memo } from "react";
import { formatMoney } from "~/utils/helper";

const VariantsVersion = ({ data, onChangeVersion, active, color }) => {
	return (
		<div
			className="w-full"
			onClick={() =>
				onChangeVersion({
					sku: data?.sku,
					price: data?.price,
					color: color,
					quantity: data?.quantity,
					ram: data?.ram,
					internalMemory: data?.internalMemory,
					sold: data?.sold,
					thumbnail: data?.thumbnail,
				})
			}
		>
			<div
				className={`${
					data?.ram === active?.ram &&
					data?.internalMemory === active?.internalMemory
						? "border-main bg-red-100"
						: " bg-white-200"
				} flex items-center py-[3px] px-[5px] border rounded-md cursor-pointer`}
			>
				<div className="flex flex-col items-center justify-center text-[12px] flex-1">
					<span className="flex gap-2 items-center justify-center text-[14px] font-semibold text-gray-900">
						<span>{data?.ram}</span>
						<span>{data?.internalMemory}</span>
					</span>
					<p>{formatMoney(data?.price)}</p>
				</div>
			</div>
		</div>
	);
};

export default memo(VariantsVersion);
