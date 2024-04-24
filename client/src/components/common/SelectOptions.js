function SelectOptions({ icon, customStyle }) {
	return (
		<div
			className={`${
				customStyle
					? customStyle
					: "inline-block bg-gray-100 p-3 rounded-full border shadow-md hover:bg-gray-700 hover:text-[#fff] hover:border-gray-700 cursor-pointer"
			}`}
		>
			{icon}
		</div>
	);
}

export default SelectOptions;
