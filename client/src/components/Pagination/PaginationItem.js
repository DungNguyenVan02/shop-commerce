function PaginationItem({ children, current }) {
	console.log(typeof children);
	return (
		<span
			className={`${
				current === children ? "bg-main text-white" : " text-gray-800"
			} py-2 px-4 rounded-md cursor-pointer`}
		>
			{typeof children === "number" ? children : "..."}
		</span>
	);
}

export default PaginationItem;
