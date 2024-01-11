import icons from "~/utils/icons";
import images from "~/assets/images";
import { SelectOptions } from "~/components/common";
import { formatMoney, renderStar } from "~/utils/helper";
import { Link } from "react-router-dom";
function Product({ data, active, productPage, productPageDetail }) {
	const { FaHeart, BsList, FaRegEye } = icons;

	return (
		<Link
			to={`${
				productPage || productPageDetail
					? "/" + data?.category?.toLowerCase()
					: data?.category?.toLowerCase()
			}/${data?._id}/${data?.name}`}
			className="p-[15px] border border-gray-300 block shadow-lg"
		>
			<div className="w-full h-full mx-auto relative product-parent">
				<div className="product-child absolute bottom-0 left-[50%] justify-center gap-4 py-1 animate-slideTop">
					<SelectOptions icon={<FaHeart />} />
					<SelectOptions icon={<BsList />} />
					<SelectOptions icon={<FaRegEye />} />
				</div>
				<img
					src={data?.thumb || images.defaultProduct}
					alt=""
					className="max-w-[280px] w-full h-full object-contain mx-auto"
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
		</Link>
	);
}

export default Product;
