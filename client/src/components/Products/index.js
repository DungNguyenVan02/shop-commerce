import icons from "../../utils/icons";
import images from "../../assets/images";
import SelectOptions from "../SelectOptions";
import { formatMoney, renderStar } from "../../utils/helper";
import { useState } from "react";
function Product({ data, pid, active }) {
	const [isShowOptions, setIsShowOptions] = useState(false);
	const { FaHeart, BsList, FaRegEye } = icons;
	return (
		<div className="p-[15px] border border-[#ebebeb] cursor-pointer">
			<div
				className="w-full h-full mx-auto relative"
				onMouseEnter={() =>
					data._id === pid ? setIsShowOptions(true) : ""
				}
				onMouseLeave={() =>
					data._id === pid ? setIsShowOptions(false) : ""
				}
			>
				{isShowOptions && (
					<div className="product-container-options absolute bottom-0 right-0 left-0 flex justify-center gap-4 py-1 animate-slideTop">
						<SelectOptions icon={<FaHeart />} />
						<SelectOptions icon={<BsList />} />
						<SelectOptions icon={<FaRegEye />} />
					</div>
				)}
				<img
					src={data?.thumb || images.defaultProduct}
					alt=""
					className="w-full h-full object-contain"
				/>
				{active === 0 ? (
					<span className="tagTrending">Trending</span>
				) : (
					<span className="tagNew">New</span>
				)}
			</div>
			<div className="flex flex-col text-[16px] mt-6 gap-2">
				<div className="flex gap-1 h-4">
					{renderStar(data?.totalRatings)?.map((star, i) => {
						return <i key={i}>{star}</i>;
					})}
				</div>
				<h3 className="line-clamp-1">{data?.name}</h3>
				<span className="">{formatMoney(data?.price)}</span>
			</div>
		</div>
	);
}

export default Product;
