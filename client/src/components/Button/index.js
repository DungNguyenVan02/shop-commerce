import { memo } from "react";
function Button({
	leftICon,
	rightICon,
	handleClick,
	title,
	style,
	isDisabled,
	type,
}) {
	return (
		<button
			disabled={isDisabled}
			type={type || "button"}
			className={
				style
					? style
					: `px-4 py-2 text-white bg-red-500 text-[14px] rounded-md w-full hover:opacity-90 ${
							isDisabled ? "opacity-40" : ""
					  }`
			}
			onClick={() => {
				handleClick && handleClick();
			}}
		>
			{leftICon}
			<span>{title}</span>
			{rightICon}
		</button>
	);
}

export default memo(Button);
