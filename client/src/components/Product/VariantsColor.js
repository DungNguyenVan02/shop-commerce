import { memo } from "react";

const VariantsColor = ({ color, active, onChangeActive, thumb }) => {
	return (
		<div className="w-full" onClick={() => onChangeActive(color)}>
			<div
				className={`${
					color === active
						? "border-main bg-red-100"
						: " bg-white-200"
				} flex items-center justify-center h-[40px] py-[3px] border rounded-md cursor-pointer`}
			>
				<img
					src={thumb}
					alt=""
					className="w-[34px] h-[34px] object-cover rounded mr-1"
				/>
				<h3 className=" text-gray-800 line-clamp-1">{color}</h3>
			</div>
		</div>
	);
};

export default memo(VariantsColor);
