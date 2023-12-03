import icons from "../../utils/icons";
import images from "../../assets/images";
import { formatMoney, renderStar } from "../../utils/helper";
function Product({ data, active }) {
	const { IoStar, IoStarOutline } = icons;
	return (
		<div className="p-[15px] border border-[#ebebeb] cursor-pointer">
			<div className="w-[243px] h-[243px] mx-auto relative">
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
				<h3 className="line-clamp-1">{data?.name}</h3>
				<div className="flex gap-1">
					{renderStar(data?.totalRatings)?.map((item, i) => {
						return (
							<i key={i}>
								{item === 1 ? (
									<IoStar className="text-star" />
								) : (
									<IoStarOutline className="text-star" />
								)}
							</i>
						);
					})}
				</div>

				<span className="">{formatMoney(data?.price)}</span>
			</div>
		</div>
	);
}

export default Product;
