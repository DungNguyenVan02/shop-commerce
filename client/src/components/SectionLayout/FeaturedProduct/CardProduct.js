import { formatMoney, renderStar } from "~/utils/helper";
import images from "~/assets/images";
import { Link } from "react-router-dom";

function CardProduct({ data }) {
	return (
		<div className="col g-l-4 g-m-6 g-c-12 cursor-pointer">
			<Link
				to={`${data?.category.toLowerCase()}/${data?._id}/${
					data?.name
				}`}
				className="flex items-center border p-2 mb-4 gap-4 shadow-md"
			>
				<img
					className="w-[86px] h-[86px] object-cover"
					src={data?.thumb || images.defaultProduct}
					alt={data?.name}
				/>
				<div className="flex flex-col">
					<h3 className="capitalize text-[16px] line-clamp-1">
						{data?.name}
					</h3>
					<div className="flex">
						{renderStar(data?.totalRatings).map((star, i) => (
							<i key={i}>{star}</i>
						))}
					</div>
					<span className="text-[13px]">
						{formatMoney(data?.price)}
					</span>
				</div>
			</Link>
		</div>
	);
}

export default CardProduct;
