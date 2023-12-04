import { formatMoney, renderStar } from "../../utils/helper";
function CardProduct({ data }) {
	return (
		<div className="flex-auto w-1/3 px-[10px] mb-[10px]">
			<div className="flex w-full items-center border">
				<div className="w-[86px] h-[86px]">
					<img
						className="w-full object-cover"
						src={data?.thumb}
						alt={data?.name}
					/>
				</div>
				<div className="gap-1 flex flex-col">
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
			</div>
		</div>
	);
}

export default CardProduct;
