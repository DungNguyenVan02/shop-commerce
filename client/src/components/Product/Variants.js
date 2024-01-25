import { memo } from "react";
import { formatMoney } from "~/utils/helper";

const Variants = ({ data, active, onClickActive }) => {
	const idSelected = data?.sku || data?._id;

	return (
		<div
			className="w-1/3"
			onClick={() =>
				onClickActive({
					id: idSelected,
					price: data?.price,
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
				<img
					src={data?.thumb}
					alt={data?.name}
					className="w-[30px] h-[30px] object-cover rounded"
				/>
				<div className="flex flex-col justify-center ml-2 text-[12px] flex-1">
					<h3 className="font-semibold text-gray-900 line-clamp-1">
						{data?.color}
					</h3>
					<p>{formatMoney(data?.price)}</p>
				</div>
			</div>
		</div>
	);
};

export default memo(Variants);
