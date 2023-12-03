import icons from "../../utils/icons";

function Search() {
	const { CiSearch } = icons;
	return (
		<div className="flex items-center border w-[300px] pr-4 rounded-full">
			<input
				className="placeholder:text-slate-400 h-full w-full pl-4 pr-2 py-2 outline-none bg-transparent"
				placeholder="Tìm kiếm gì đó..."
			/>
			<CiSearch className="cursor-pointer" size={24} color="#000" />
		</div>
	);
}

export default Search;
