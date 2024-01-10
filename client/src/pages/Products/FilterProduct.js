import { useEffect, useState, memo } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { filterBys, sortBys } from "~/utils/contains";
import Button from "~/components/Button";
import icons from "~/utils/icons";

function FilterProduct() {
	const navigate = useNavigate();
	const { category } = useParams();
	const { FaAngleDown, FaCheck } = icons;
	const [sort, setSort] = useState(null);
	const [selectedByPrice, setSelectedByPrice] = useState("");
	const [selectedByColor, setSelectedByColor] = useState([]);
	const [isActiveFilter, setIsActiveFilter] = useState(null);

	const handleSelected = (e, selected) => {
		switch (selected) {
			case "Price":
				if (selectedByPrice === e.target.outerText) {
					setSelectedByPrice("");
				} else {
					setSelectedByPrice(e.target.outerText);
				}
				break;
			case "Color":
				if (selectedByColor.includes(e?.target.outerText)) {
					setSelectedByColor((prev) =>
						prev.filter((item) => item !== e?.target.outerText)
					);
				} else {
					setSelectedByColor((prev) => [
						...prev,
						e?.target.outerText,
					]);
				}
				break;
			default:
				throw new Error("Something went wrong");
		}
	};

	const handleClickFilter = (id) => {
		if (isActiveFilter === id) {
			setIsActiveFilter(null);
		} else {
			setIsActiveFilter(id);
		}
	};

	useEffect(() => {
		const dataSelected = {};
		const selectedByPriceArr = selectedByPrice.split(" ");
		switch (selectedByPriceArr[0]) {
			case "Under":
				dataSelected["price[lte]"] = selectedByPriceArr[1] * 1000000;
				break;
			case "From":
				const filterNumber = selectedByPriceArr[1].split("-");
				dataSelected["price[gte]"] = filterNumber[0] * 1000000;
				dataSelected["price[lte]"] = filterNumber[1] * 1000000;
				break;
			case "Over":
				dataSelected["price[gte]"] = selectedByPriceArr[1] * 1000000;
				break;
			default:
				break;
		}

		if (selectedByColor.length > 0) {
			dataSelected.color = selectedByColor.join(",");
		}

		if (sort !== null) {
			dataSelected.sort = sort.sort;
		}

		navigate({
			pathname: `/${category}`,
			search: createSearchParams(dataSelected).toString(),
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedByPrice, selectedByColor, sort]);
	return (
		<div
			className="flex flex-col gap-4 border p-5"
			onClick={() => {
				if (isActiveFilter !== null) setIsActiveFilter(null);
			}}
		>
			<div>
				<h3 className="mb-1 text-[16px] font-medium">Filter by</h3>
				<ul className="flex gap-3">
					{filterBys.map((item) => {
						return (
							<li key={item.id} className="relative">
								<Button
									handleClick={() => {
										handleClickFilter(item.id);
									}}
									styleCustom="flex justify-around items-center bg-main hover:opacity-80 text-[14px] py-2 px-5 text-white rounded-sm"
									title={item.title}
									rightICon={<FaAngleDown />}
								/>
								{isActiveFilter === item.id && (
									<div
										onClick={(e) => e.stopPropagation()}
										className="flex flex-col gap-2 min-w-[200px] p-2 border mt-3 absolute top-[36px] left-0 z-10 bg-white rounded-sm shadow-md"
									>
										{item?.sub?.map((el) => {
											return (
												<div
													key={el.id}
													className="relative flex"
												>
													<span
														onClick={(e) => {
															handleSelected(
																e,
																item.title
															);
														}}
														className={`${
															selectedByPrice.includes(
																el.title
															) ||
															selectedByColor.includes(
																el.title
															)
																? "bg-red-300 border-main border-solid"
																: "border-transparent"
														} rounded-lg bg-gray-500 text-[12px] text-white py-1 px-5 w-full cursor-pointer hover:opacity-80 border border-solid`}
													>
														{el.title}
													</span>
													{(selectedByPrice.includes(
														el.title
													) ||
														selectedByColor.includes(
															el.title
														)) && (
														<i className="absolute top-0 left-0 p-1 rounded-custom bg-main">
															{
																<FaCheck
																	size={10}
																	color="white"
																/>
															}
														</i>
													)}
												</div>
											);
										})}
									</div>
								)}
							</li>
						);
					})}
				</ul>
			</div>
			<div>
				<h3 className="mb-1 text-[16px] font-medium">Sort by</h3>
				<div className="flex gap-4 ">
					{sortBys.map((item) => (
						<Button
							styleCustom={`${
								sort?.title === item.title
									? "bg-red-300 border border-main"
									: ""
							} py-2 px-5 border border-main bg-main text-white text-[14px] rounded-sm`}
							key={item.id}
							title={item.title}
							handleClick={() => {
								if (item.title === sort?.title) {
									setSort(null);
								} else {
									setSort(item);
								}
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default memo(FilterProduct);
