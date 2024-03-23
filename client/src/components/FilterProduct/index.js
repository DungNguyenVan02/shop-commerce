import React, { useEffect, useState } from "react";
import { createSearchParams } from "react-router-dom";
import withBaseComponent from "~/components/hocs/withBaseComponent";

const FilterProduct = ({ location, navigate }) => {
	const [price, setPrice] = useState([]);
	const [color, setColor] = useState([]);
	const [categoryChecked, setCategoryChecked] = useState([]);
	const [brand, setBrand] = useState([]);

	const handleCheckedColor = (e) => {
		const colorChecked = e.target.value;
		if (color.includes(colorChecked)) {
			setColor((prev) => prev.filter((item) => item !== colorChecked));
		} else {
			setColor((prev) => [...prev, colorChecked]);
		}
	};

	const handleCheckedBrand = (e) => {
		const brandChecked = e.target.value;
		if (brand.includes(brandChecked)) {
			setBrand((prev) => prev.filter((item) => item !== brandChecked));
		} else {
			setBrand((prev) => [...prev, brandChecked]);
		}
	};

	const handleCheckedCategory = (e) => {
		const category = e.target.value;
		if (categoryChecked.includes(category)) {
			setCategoryChecked((prev) =>
				prev.filter((item) => item !== category)
			);
		} else {
			setCategoryChecked((prev) => [...prev, category]);
		}
	};

	const handleCheckedPrice = (e) => {
		const priceChecked = e.target.value;
		if (price.includes(priceChecked)) {
			setPrice([]);
		} else {
			setPrice([priceChecked]);
		}
	};

	useEffect(() => {
		const dataSelected = {};

		if (price.length > 0) {
			const priceChecked = price[0]?.split(":");

			switch (priceChecked?.length) {
				case 2:
					dataSelected[priceChecked[0]] = priceChecked[1];
					break;
				case 3:
					dataSelected[priceChecked[0]] =
						priceChecked[1]?.split("|")[0];
					dataSelected[priceChecked[1].split("|")[1]] =
						priceChecked[2];
					break;
				default:
					console.log("Filter error price missing");
			}
		}

		if (brand.length > 0) {
			dataSelected.brand = brand.join(",");
		}
		if (color.length > 0) {
			dataSelected.color = color.join(",");
		}
		if (categoryChecked.length > 0) {
			dataSelected.category = categoryChecked.join(",");
		}

		console.log(dataSelected);

		navigate({
			pathname: location.pathname,
			search: createSearchParams(dataSelected).toString(),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [price, color, brand, categoryChecked]);

	return (
		<div className="w-full">
			<h3 className="text-[20px] font-semibold">Lọc sản phẩm theo</h3>
			<div className=" flex flex-col   mt-9 w-full">
				<div className="border-b py-5">
					<h3 className="text-[16px] uppercase font-semibold">
						Giá sản phẩm
					</h3>
					<div className="flex gap-3 flex-col justify-between w-full">
						<div className="flex justify-between w-full">
							<span>0 selected</span>
							<span className="cursor-pointer hover:text-blue-500">
								Reset
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-1">
								<input
									id="price-1"
									checked={price.includes(
										"price[lte]:3000000"
									)}
									className="w-[18px] h-[18px]"
									value="price[lte]:3000000"
									onChange={(e) => handleCheckedPrice(e)}
									type="checkbox"
								/>
								<label htmlFor="price-1">Dưới 3 triệu</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									id="price-2"
									checked={price.includes(
										"price[gte]:3000000|price[lte]:7000000"
									)}
									className="w-[18px] h-[18px]"
									value="price[gte]:3000000|price[lte]:7000000"
									onChange={(e) => handleCheckedPrice(e)}
									type="checkbox"
								/>
								<label htmlFor="price-2">
									Từ 3 triệu đến 7 triệu
								</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									id="price-3"
									checked={price.includes(
										"price[gte]:7000000|price[lte]:10000000"
									)}
									className="w-[18px] h-[18px]"
									value="price[gte]:7000000|price[lte]:10000000"
									onChange={(e) => handleCheckedPrice(e)}
									type="checkbox"
								/>
								<label htmlFor="price-3">
									Từ 7 triệu đến 10 triệu
								</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									id="price-4"
									checked={price.includes(
										"price[gte]:10000000|price[lte]:15000000"
									)}
									className="w-[18px] h-[18px]"
									value="price[gte]:10000000|price[lte]:15000000"
									onChange={(e) => handleCheckedPrice(e)}
									type="checkbox"
								/>
								<label htmlFor="price-4">
									Từ 10 triệu đến 15 triệu
								</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									id="price-5"
									checked={price.includes(
										"price[gte]:15000000"
									)}
									className="w-[18px] h-[18px]"
									value="price[gte]:15000000"
									onChange={(e) => handleCheckedPrice(e)}
									type="checkbox"
								/>
								<label htmlFor="price-5">Trên 15 triệu</label>
							</div>
						</div>
					</div>
				</div>
				<div className="border-b py-5">
					<h3 className="text-[16px] uppercase font-semibold">
						Loại sản phẩm
					</h3>
					<div className="flex gap-3 flex-col justify-between w-full">
						<div className="flex justify-between w-full">
							<span>0 selected</span>
							<span className="cursor-pointer hover:text-blue-500">
								Reset
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-1">
								<input
									id="category-1"
									className="w-[18px] h-[18px]"
									value="Điện thoại"
									onChange={(e) => handleCheckedCategory(e)}
									type="checkbox"
								/>
								<label htmlFor="category-1">Điện thoại</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									id="category-2"
									className="w-[18px] h-[18px]"
									value="Ipad"
									onChange={(e) => handleCheckedCategory(e)}
									type="checkbox"
								/>
								<label htmlFor="category-2">
									Máy tính bảng
								</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									id="category-3"
									className="w-[18px] h-[18px]"
									value="Phụ kiện"
									onChange={(e) => handleCheckedCategory(e)}
									type="checkbox"
								/>
								<label htmlFor="category-3">Phụ kiện</label>
							</div>
						</div>
					</div>
				</div>
				<div className="border-b py-5">
					<h3 className="text-[16px] uppercase font-semibold">
						Hãng sản phẩm
					</h3>
					<div className="flex gap-3 flex-col justify-between w-full">
						<div className="flex justify-between w-full">
							<span>0 selected</span>
							<span className="cursor-pointer hover:text-blue-500">
								Reset
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-1">
								<input
									id="brand-1"
									value="Apple"
									onChange={(e) => handleCheckedBrand(e)}
									className="w-[18px] h-[18px]"
									type="checkbox"
								/>
								<label htmlFor="brand-1">Apple</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									id="brand-2"
									value="Samsung"
									onChange={(e) => handleCheckedBrand(e)}
									className="w-[18px] h-[18px]"
									type="checkbox"
								/>
								<label htmlFor="brand-2">Samsung</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									id="brand-3"
									value="Vivo"
									onChange={(e) => handleCheckedBrand(e)}
									className="w-[18px] h-[18px]"
									type="checkbox"
								/>
								<label htmlFor="brand-3">Vivo</label>
							</div>
						</div>
					</div>
				</div>
				<div className="border-b py-5">
					<h3 className="text-[16px] uppercase font-semibold">
						Màu sắc
					</h3>
					<div className="flex gap-3 flex-col justify-between w-full">
						<div className="flex justify-between w-full">
							<span>0 selected</span>
							<span className="cursor-pointer hover:text-blue-500">
								Reset
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-1">
								<input
									onChange={(e) => handleCheckedColor(e)}
									value="Đen"
									id="black-checkbox"
									className="w-[18px] h-[18px] appearance-none checked:appearance-auto rounded-sm  bg-black  accent-black"
									type="checkbox"
								/>
								<label htmlFor="black-checkbox">Black</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									onChange={(e) => handleCheckedColor(e)}
									value="Xanh dương"
									id="blue-checkbox"
									className="w-[18px] h-[18px] appearance-none checked:appearance-auto rounded-sm  bg-blue-700  accent-bg-blue-700"
									type="checkbox"
								/>
								<label htmlFor="blue-checkbox">Blue</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									onChange={(e) => handleCheckedColor(e)}
									value="Xanh lam"
									id="green-checkbox"
									className="w-[18px] h-[18px] appearance-none checked:appearance-auto rounded-sm  bg-green-700  accent-green-700"
									type="checkbox"
								/>
								<label htmlFor="green-checkbox">Green</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									onChange={(e) => handleCheckedColor(e)}
									value="Xám"
									id="gray-checkbox"
									className="w-[18px] h-[18px] appearance-none checked:appearance-auto rounded-sm  bg-gray-700  accent-gray-700"
									type="checkbox"
								/>
								<label htmlFor="gray-checkbox">Gray</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									onChange={(e) => handleCheckedColor(e)}
									value="Đỏ"
									id="red-checkbox"
									className="w-[18px] h-[18px] appearance-none checked:appearance-auto rounded-sm  bg-red-700  accent-red-700"
									type="checkbox"
								/>
								<label htmlFor="red-checkbox">Red</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									onChange={(e) => handleCheckedColor(e)}
									value="Hồng"
									id="pink-checkbox"
									className="w-[18px] h-[18px] border appearance-none checked:appearance-auto rounded-sm  bg-pink-500  accent-pink-500"
									type="checkbox"
								/>
								<label htmlFor="pink-checkbox">Pink</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									onChange={(e) => handleCheckedColor(e)}
									value="Vàng"
									id="yellow-checkbox"
									className="w-[18px] h-[18px] border appearance-none checked:appearance-auto rounded-sm  bg-yellow-300  accent-yellow-300"
									type="checkbox"
								/>
								<label htmlFor="yellow-checkbox">Yellow</label>
							</div>
							<div className="flex items-center gap-1">
								<input
									onChange={(e) => handleCheckedColor(e)}
									value="Trắng"
									id="white-checkbox"
									className="w-[18px] h-[18px] border appearance-none checked:appearance-auto rounded-sm  bg-white  accent-white"
									type="checkbox"
								/>
								<label htmlFor="white-checkbox">White</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBaseComponent(FilterProduct);
