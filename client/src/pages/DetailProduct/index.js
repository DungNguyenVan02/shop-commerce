import { useParams } from "react-router-dom";
import { apiGetProduct } from "../../apis";
import { useEffect, useState } from "react";
import icons from "../../utils/icons";
import { Link } from "react-router-dom";
import routes from "../../config/routes";
import { formatMoney, renderStar } from "../../utils/helper";
import Button from "../../components/Button";
import ExtraInfo from "../../components/ExtraInfo";

function DetailProduct() {
	const { pid, category, name } = useParams();
	const {
		IoIosArrowForward,
		GoDotFill,
		IoShieldCheckmark,
		FaShippingFast,
		IoGift,
		IoArrowUndo,
		FaPhoneAlt,
	} = icons;

	const [product, setProduct] = useState(null);

	const fetchProductData = async () => {
		const response = await apiGetProduct(pid);
		if (response?.success) {
			setProduct(response?.getProduct);
		}
	};

	useEffect(() => {
		if (pid) fetchProductData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pid, name]);

	return (
		<div className="w-full">
			<header className="h-[81px] bg-[#f7f7f7] w-full flex justify-center">
				<div className="max-w-main w-full flex flex-col justify-center">
					<h3 className="text-[18px] font-semibold text-[#151515]">
						{name}
					</h3>
					<div className="flex gap-1 items-center text-[14px] font-[400] opacity-80">
						<Link
							to={routes.home}
							className="cursor-pointer hover:text-main text-[#1c1d1d]"
						>
							Home
						</Link>
						<IoIosArrowForward />
						<Link
							to={`${routes.home}/${product?.category}`}
							className="cursor-pointer hover:text-main text-[#1c1d1d]"
						>
							{category}
						</Link>
						<IoIosArrowForward />
						<span className="text-[#505050]">{product?.name}</span>
					</div>
				</div>
			</header>
			<div className="max-w-main w-full mx-auto my-[20px]">
				<div className="grid wide">
					<div className="row">
						<div className="col g-l-5 g-m-5 g-c-12">
							<img src={product?.thumb} alt={product?.name} />
						</div>
						<div className="col g-l-4 g-m-4 g-c-12 text-[#505050] text-[14px] ">
							<h3 className="text-[30px] text-[#333333] font-semibold">
								{formatMoney(product?.price)}
							</h3>
							<div className="flex items-center gap-2 my-[20px]">
								<span className="flex">
									{renderStar(product?.totalRatings)?.map(
										(star, i) => (
											<i key={i}>{star}</i>
										)
									)}
								</span>
								<span>{product?.ratings.length} reviews</span>
							</div>
							<ul className="flex flex-col gap-[5px]">
								{product?.description?.map((item) => (
									<li
										key={item}
										className="flex items-center gap-2"
									>
										<GoDotFill />
										{item}
									</li>
								))}
							</ul>
							<Button
								title="ADD TO CART"
								styleCustom="w-full h-[40px] bg-main text-white"
							/>
						</div>
						<div className="col g-l-3 g-m-3 g-c-12 flex flex-col gap-3">
							<ExtraInfo
								icon={
									<IoShieldCheckmark
										size={22}
										color="white"
									/>
								}
								title="Guarantee"
								subTitle="Quality Checked"
							/>
							<ExtraInfo
								icon={
									<FaShippingFast size={22} color="white" />
								}
								title="Free Shipping"
								subTitle="Free On All Products"
							/>
							<ExtraInfo
								icon={<IoGift size={22} color="white" />}
								title="Special Gift Cards"
								subTitle="Special Gift Cards"
							/>
							<ExtraInfo
								icon={<IoArrowUndo size={22} color="white" />}
								title="Free Return"
								subTitle="Within 7 Days"
							/>
							<ExtraInfo
								icon={<FaPhoneAlt size={22} color="white" />}
								title="Free Return"
								subTitle="Within 7 Days"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DetailProduct;
