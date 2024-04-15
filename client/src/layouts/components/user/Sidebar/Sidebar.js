import { Link } from "react-router-dom";

import icons from "~/utils/icons";
import { useSelector } from "react-redux";
import { appSelector } from "~/redux/selector";
import routes from "~/config/routes";
function Sidebar() {
	const { categories } = useSelector(appSelector);

	const { FaList, IoPhonePortraitOutline, FaTabletAlt, TbDeviceAirpods } =
		icons;

	const iconsTop = [IoPhonePortraitOutline, FaTabletAlt, TbDeviceAirpods];

	return (
		<aside className="w-full">
			<div className="flex flex-col border">
				<h3 className="flex items-center text-4 py-[10px] px-[20px] bg-main text-white font-semibold">
					<i className="pr-2">
						<FaList />
					</i>
					Danh mục sản phẩm
				</h3>
				{categories?.map((category, i) => {
					const Icon = iconsTop[i];
					return (
						<Link
							key={category._id}
							to={`${routes.products}/${category.name}`}
							className=" cursor-pointer flex items-center text-4 py-[10px] px-[20px] hover:text-main hover:bg-slate-100 gap-3"
						>
							<Icon />
							{category.name}
						</Link>
					);
				})}
				<h3 className="flex items-center text-4 py-[8px] px-[20px] bg-main text-white font-semibold">
					Hãng sản xuất
				</h3>
				{categories
					?.find((el) => el.name === "Điện thoại")
					?.brand?.map((brand, i) => {
						return (
							<Link
								to={`${routes.products}/brand/${brand}`}
								key={i}
								className=" cursor-pointer flex items-center text-4 py-[10px] px-[20px] hover:text-main hover:bg-slate-100 gap-3"
							>
								{brand}
							</Link>
						);
					})}
			</div>
		</aside>
	);
}

export default Sidebar;
