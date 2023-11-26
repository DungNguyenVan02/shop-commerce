import Search from "../Search";

function Header() {
	return (
		<div className="h-[110px] flex justify-between items-center border-b py-[35px]">
			<div>Logo</div>
			<Search />
			<div>action</div>
		</div>
	);
}

export default Header;
