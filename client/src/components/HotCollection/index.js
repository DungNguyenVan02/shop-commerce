import { useSelector } from "react-redux";
import { appSelector } from "../../redux/selector";
import { useEffect, useState } from "react";
import images from "../../assets/images";
import icons from "../../utils/icons";

function HotCollection() {
	const [hotCollection, setHotCollection] = useState([]);
	const { categories } = useSelector(appSelector);
	const { IoIosArrowForward } = icons;

	const showHotCollection = [
		"Smartphone",
		"Tablet",
		"Laptop",
		"Accessories",
		"Television",
		"Printer",
	];

	useEffect(() => {
		const data = categories?.filter((item) =>
			showHotCollection.includes(item.name)
		);
		setHotCollection(data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categories]);

	return (
		<div>
			<h3 className="text-[20px] mb-4 text-[#151515] uppercase font-bold border-b-2 border-main pb-[15px]">
				HOT COLLECTIONS
			</h3>
			<div className="grid">
				<div className="row">
					{hotCollection?.map((item) => {
						return (
							<div
								key={item._id}
								className="col g-l-4 g-m-6 g-c-16"
							>
								<div className="flex items-center border mt-4 p-5">
									<img
										src={
											item?.image || images.defaultProduct
										}
										alt={item?.name}
										className="col g-l-6 w-[144px] h-[129px] object-contain"
									/>
									<ul className="col g-l-6">
										<h3 className="font-semibold uppercase">
											{item?.name}
										</h3>
										{item?.brand?.map((brand, index) => (
											<li key={index}>
												<span className="flex items-center mb-1 cursor-pointer text-gray-500 text-[14px] hover:text-main">
													<IoIosArrowForward />
													{brand}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default HotCollection;
