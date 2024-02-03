import { memo } from "react";
function Button({
	leftICon,
	leftAnimation,
	rightICon,
	rightAnimation,
	handleClick,
	title,
	styleCustom,
	isDisabled,
	type,
}) {
	return (
		<button
			disabled={isDisabled}
			type={type || "button"}
			className={
				styleCustom
					? styleCustom
					: `px-4 py-2 text-white  ${
							isDisabled
								? "opacity-40"
								: " bg-red-500 text-[14px] rounded-md w-full hover:opacity-90"
					  }`
			}
			onClick={(e) => {
				e.stopPropagation();
				handleClick && handleClick();
			}}
		>
			<span className="flex justify-center items-center relative gap-1">
				{leftICon}
				{leftAnimation}
				<span>{title}</span>
				{rightAnimation && (
					<i className="absolute top-0 right-[36%] translate-x-[50%]">
						{rightAnimation}
					</i>
				)}
				{rightICon}
			</span>
		</button>
	);
}

export default memo(Button);
