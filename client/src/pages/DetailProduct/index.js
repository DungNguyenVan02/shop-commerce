import { useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts, apiRatingProduct } from "../../apis";
import { useCallback, useEffect, useState } from "react";
import icons from "../../utils/icons";

import { createSlug, formatMoney, renderStar } from "../../utils/helper";
import Button from "../../components/Button";
import ExtraInfo from "../../components/ExtraInfo";
import { extraInfo } from "../../utils/contains";
import images from "../../assets/images";
import SliderSubProduct from "../../components/SliderSubProduct";
import SelectQuantity from "../../components/SelectQuantity";
import ProInforMation from "../../components/ProInforMation";
import Slider from "../../components/Slider";
import BreadcrumbHeader from "../../components/BreadcrumbHeader";
import Ratings from "../../components/Ratings";
import Modal from "../../components/Modal";
import VoteForm from "../../components/Ratings/VoteForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { appSelector } from "../../redux/selector";

function DetailProduct() {
	const { pid, category, name } = useParams();
	const { isShowModal } = useSelector(appSelector);
	const { GoDotFill, FaCartPlus } = icons;

	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [relateProduct, setRelateProduct] = useState([]);
	const [thumbSrc, setThumbSrc] = useState("");
	const [updateRating, setUpdateRating] = useState(false);

	const fetchProductData = async () => {
		const response = await apiGetProduct(pid);
		if (response?.success) {
			setProduct(response?.getProduct);
			setThumbSrc(response?.getProduct?.thumb);
		}
	};

	const handleChangeThumb = (src) => {
		setThumbSrc(src);
	};

	const fetchRelateProductData = async () => {
		const response = await apiGetProducts({ category });
		if (response?.success) {
			setRelateProduct(response?.products);
		}
	};

	useEffect(() => {
		if (pid) {
			fetchProductData();
			fetchRelateProductData();
		}
		window.scrollTo(0, 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pid, name]);

	useEffect(() => {
		if (pid) {
			fetchProductData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updateRating]);

	const handleQuantity = useCallback(
		(number) => {
			if (+number > product?.quantity) {
				setQuantity(product?.quantity);
			} else {
				setQuantity(+number);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[quantity]
	);

	const handleChangeQuantity = useCallback(
		(number) => {
			if (number < 1) {
				setQuantity(1);
			} else if (number > product?.quantity) {
				setQuantity(product?.quantity);
			} else {
				setQuantity(number);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[quantity]
	);

	const handleRating = useCallback(
		async (dataRating) => {
			const date = new Date();
			if (!product?._id || !dataRating.comment) {
				toast.warning(
					"Please enter complete product review information",
					{
						position: "top-center",
						theme: "colored",
					}
				);
				return;
			}
			const payload = {
				pid: product?._id,
				star: dataRating.starVote || 5,
				comment: dataRating.comment,
				date: `${date.getDate()}/${
					date.getMonth() + 1
				}/${date.getFullYear()}`,
				time: `${date.getHours()}:${date.getMinutes()}`,
			};
			const response = await apiRatingProduct(payload);
			if (response.success) {
				setUpdateRating(!updateRating);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isShowModal]
	);

	return (
		<div className="w-full">
			{isShowModal && (
				<Modal>
					<VoteForm name={product?.name} onRating={handleRating} />
				</Modal>
			)}
			<BreadcrumbHeader
				category={category}
				slug={createSlug(category)}
				name={name}
			/>
			<div className="max-w-main w-full mx-auto my-[20px]">
				<div className="grid wide">
					<div className="row">
						<div className="col g-l-5 g-m-5 g-c-12">
							<div className="w-[458px] h-[458px] object-contain border">
								<img
									className="w-full h-full object-contain"
									src={thumbSrc || images?.defaultProduct}
									alt={product?.name}
								/>
							</div>
							<SliderSubProduct
								dataSrc={product?.images}
								handleClick={handleChangeThumb}
							/>
						</div>
						<div className="col g-l-4 g-m-4 g-c-12 text-[#505050] text-[14px] ">
							<h3 className="text-[30px] text-[#333333] font-semibold">
								{formatMoney(product?.price)}
							</h3>
							<div className="flex items-center gap-5 my-5 mt-[10px]">
								<span className="flex">
									{renderStar(product?.totalRatings)?.map(
										(star, i) => (
											<i key={i}>{star}</i>
										)
									)}
								</span>
								<span className="w-[1px] h-full bg-red-300 text-transparent">
									|
								</span>
								<span>{product?.ratings.length} Ratings</span>
								<span className="w-[1px] h-full bg-red-300 text-transparent">
									|
								</span>
								<span>{product?.sold} Sold</span>
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
							<div className="flex items-center gap-2">
								<span>Quantity</span>
								<SelectQuantity
									quantity={quantity}
									handleQuantity={handleQuantity}
									handleChangeQuantity={handleChangeQuantity}
								/>
								<span>
									{product?.quantity} pieces available
								</span>
							</div>
							<div className="flex gap-4">
								<Button
									title="ADD TO CART"
									leftICon={<FaCartPlus />}
									styleCustom="rounded-sm bg-red-300 border border-red-600 text-white hover:opacity-80 px-4 py3"
								/>
								<Button
									title="BUY NOW"
									styleCustom="rounded-sm bg-main text-white hover:opacity-80 px-4 py-3"
								/>
							</div>
						</div>
						<div className="col g-l-3 g-m-3 g-c-12 flex flex-col gap-3">
							{extraInfo.map((extra) => {
								return (
									<ExtraInfo
										key={extra.id}
										icon={extra.icon}
										title={extra.title}
										subTitle={extra.subTitle}
									/>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<div className="max-w-main w-full mx-auto my-[20px] mb-0">
				<ProInforMation description={product?.description} />
			</div>
			<div className="max-w-main w-full mx-auto">
				<Ratings data={product} />
			</div>
			<div className="max-w-main w-full mx-auto my-[20px]">
				<h3 className="text-[20px] mb-4 text-[#151515] uppercase font-bold border-b-2 border-main pb-[15px]">
					YOU MAY ALSO LIKE
				</h3>
				<Slider products={relateProduct} productPageDetail show={4} />
			</div>
		</div>
	);
}

export default DetailProduct;
