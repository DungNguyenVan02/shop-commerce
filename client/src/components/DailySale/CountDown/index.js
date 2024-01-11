import { memo } from "react";

function CountDown({ unit, number }) {
	return (
		<div className="flex flex-col items-center w-[30%] bg-[#f4f4f4] p-2">
			<span className="text-[18px] font-bold">{number}</span>
			<p className="text-sm">{unit}</p>
		</div>
	);
}

export default memo(CountDown);
