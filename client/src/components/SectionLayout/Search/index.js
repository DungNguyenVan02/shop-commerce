import icons from "~/utils/icons";

function Search() {
	const { CiSearch } = icons;
	return (
		<div className="flex flex-[2] items-center border border-[#e26273] w-[300px] pr-4 rounded-full">
			<input
				className="placeholder:text-gray-400a placeholder:text-[14px] h-full w-full pl-4 pr-2 py-2 outline-none bg-transparent"
				placeholder="Search products..."
			/>
			<CiSearch className="cursor-pointer" size={24} color="#e26273" />
		</div>
	);
}

export default Search;
