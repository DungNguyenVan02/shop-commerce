import { useState } from "react";
import BreadcrumbHeader from "../../components/BreadcrumbHeader";
import { useParams } from "react-router-dom";
import { filterBys } from "../../utils/contains";
import Button from "../../components/Button";
import icons from "../../utils/icons";

function Products() {
	const { category } = useParams();
	const { FaAngleDown } = icons;
	const [isActiveFilter, setIsActiveFilter] = useState(null);

	const handleClickFilter = (id) => {
		if (isActiveFilter === id) {
			setIsActiveFilter(null);
		} else {
			setIsActiveFilter(id);
		}
	};

	return (
		<div onClick={() => setIsActiveFilter(null)}>
			<BreadcrumbHeader category={category} />
			<div className="max-w-main w-full mx-auto my-7">
				<div className="flex border p-5">
					<div className="w-10/12">
						<h3 className="mb-3 text-[14px]">Filter by</h3>
						<ul className="flex gap-3">
							{filterBys.map((item) => {
								return (
									<li key={item.id} className="relative">
										<Button
											handleClick={() =>
												handleClickFilter(item.id)
											}
											styleCustom="flex justify-around items-center bg-main hover:opacity-80 text-[14px] py-2 px-5 text-white rounded-sm"
											title={item.title}
											rightICon={<FaAngleDown />}
										/>
										{isActiveFilter === item.id && (
											<div className="flex flex-col gap-2 min-w-[200px] p-2 border mt-3 absolute top-[36px] left-0 z-10 bg-white rounded-sm shadow-md">
												{item.sub.map((el) => {
													return (
														<span
															key={el.id}
															className="rounded-sm bg-gray-500 text-[12px] text-white py-1 px-3 cursor-pointer hover:opacity-80"
														>
															{el.title}
														</span>
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
			</div>
		</div>
	);
}

export default Products;
