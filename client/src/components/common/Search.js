import { useEffect, useRef, useState } from "react";
import icons from "~/utils/icons";
import HeadlessTippy from "@tippyjs/react/headless";
import { useDebounce } from "../hooks";
import withBaseComponent from "../hocs/withBaseComponent";
import { apiGetProducts } from "~/apis";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { SpinnerAnimation } from "../Animation";

function Search({ location, navigate }) {
	const [searchQueries] = useSearchParams();
	const [searchText, setSearchText] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [isShow, setIsShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { CiSearch, MdOutlineScreenSearchDesktop, IoCloseOutline } = icons;
	const inputRef = useRef();

	const fnClear = () => {
		setSearchResult([]);
		setSearchText("");
	};

	const debouncedValue = useDebounce(searchText, 500);

	const fetchProducts = async (queries) => {
		const response = await apiGetProducts({ ...queries });
		if (response?.success) {
			setIsLoading(false);
			setSearchResult(response.products);
		} else {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const queries = Object.fromEntries([...searchQueries]);
		if (debouncedValue) {
			queries.q = debouncedValue;
			navigate({
				pathname: location.pathname,
				search: createSearchParams(queries).toString(),
			});
		}
		if (debouncedValue === "") {
			searchQueries.get("q") &&
				navigate({
					pathname: location.pathname,
					search: createSearchParams("").toString(),
				});
			fnClear();
		}
		if (debouncedValue) {
			setIsLoading(true);
			setTimeout(() => {
				fetchProducts(queries);
			}, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue]);

	const handleChangeInput = (e) => {
		let searchValue = e.target.value;
		if (!searchValue.startsWith(" ")) {
			setSearchText(searchValue);
		}
	};
	const handleShowDetail = (path) => {
		fnClear();
		navigate(path);
	};

	const handleShowResult = (attrs) => {
		return (
			<div
				className="w-[880px] max-h-[70vh] overflow-y-auto bg-white rounded-lg shadow-lg py-3"
				tabIndex="-1"
				{...attrs}
			>
				<div className="flex items-center text-[#000000de] px-3">
					<MdOutlineScreenSearchDesktop size={20} color="orange" />
					<h3 className="text-[14px] ml-2">{`Search results for "${debouncedValue}"`}</h3>
				</div>
				<div className="mt-2">
					{searchResult.map((item) => (
						<div
							onClick={() =>
								handleShowDetail(
									`/${item.category.toLowerCase()}/${
										item._id
									}/${item.name}`
								)
							}
							key={item._id}
							className="flex items-center p-2 gap-3 mt-2 hover:cursor-pointer hover:bg-gray-50"
						>
							<img
								className="w-[40px] object-cover"
								src={item?.thumb}
								alt=""
							/>
							<h3 className="text-[14px] text-[#000000de]  line-clamp-1">
								{item.name}
							</h3>
						</div>
					))}
				</div>
			</div>
		);
	};
	const handleHideResults = () => {
		setIsShow(false);
	};
	return (
		<div className="flex-[2]">
			<HeadlessTippy
				visible={isShow && searchResult.length > 0}
				onClickOutside={handleHideResults}
				interactive
				render={handleShowResult}
				placement="bottom"
				offset={[0, 0]}
			>
				<div className="flex items-center border border-[#e26273] w-full pr-4 rounded-full">
					<input
						ref={inputRef}
						value={searchText}
						className="placeholder:text-gray-400a placeholder:text-[14px] h-full w-full pl-4 pr-2 py-2 outline-none bg-transparent"
						placeholder="Tìm kiếm sản phẩm"
						onChange={handleChangeInput}
						onFocus={() => setIsShow(true)}
					/>
					<div className="border-r pr-3 mr-[10px] h-full">
						{searchText.length > 0 && !isLoading && (
							<span
								className="cursor-pointer hover:opacity-80"
								onClick={() => {
									setSearchResult([]);
									setSearchText("");
								}}
							>
								<IoCloseOutline size={20} />
							</span>
						)}
						{isLoading && <SpinnerAnimation />}
					</div>
					<CiSearch
						className="cursor-pointer"
						size={24}
						color="#e26273"
					/>
				</div>
			</HeadlessTippy>
		</div>
	);
}

export default withBaseComponent(Search);
