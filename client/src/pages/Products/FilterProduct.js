import { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { filterBys } from "../../utils/contains";
import Button from "../../components/Button";
import icons from "../../utils/icons";

function FilterProduct() {
	const navigate = useNavigate();
	const { category } = useParams();
	const { FaAngleDown, FaCheck } = icons;
	const [selectedByPrice, setSelectedByPrice] = useState([]);
	const [selectedByColor, setSelectedByColor] = useState([]);
	const [isActiveFilter, setIsActiveFilter] = useState(null);

	const handleSelected = (e, selected) => {
		let selectedBys;
		let setSelectedBys;
		switch (selected) {
			case "Price":
				selectedBys = selectedByPrice;
				setSelectedBys = setSelectedByPrice;
				break;

			default:
				throw new Error("Something went wrong");
		}

		if (selectedBys.includes(e?.target.outerText)) {
			setSelectedBys((prev) =>
				prev.filter((item) => item !== e?.target.outerText)
			);
		} else {
			setSelectedBys((prev) => {
				if (selected === "Price") {
					return e?.target.outerText;
				}
				return [...prev, e?.target.outerText];
			});
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
		navigate({
			pathname: `/${category}`,
			search: createSearchParams({
				price: selectedByPrice,
			}).toString(),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedByPrice]);
	return (
		<div className="flex border p-5">
			<div className="w-10/12">
				<h3 className="mb-3 text-[14px]">Filter by</h3>
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
															)
																? "bg-red-300 border-main border-solid"
																: "border-transparent"
														} rounded-lg bg-gray-500 text-[12px] text-white py-1 px-5 w-full cursor-pointer hover:opacity-80 border border-solid`}
													>
														{el.title}
													</span>
													{selectedByPrice.includes(
														el.title
													) && (
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
			<div className="w-2/12">
				<h3 className="mb-3 text-[14px]">Sort by</h3>
			</div>
		</div>
	);
}

export default FilterProduct;
