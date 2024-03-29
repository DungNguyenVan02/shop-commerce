import { Link, createSearchParams, useParams } from "react-router-dom";
import {
	apiAddCart,
	apiGetProduct,
	apiGetProducts,
	apiRatingProduct,
} from "~/apis";
import { useCallback, useEffect, useState } from "react";
import DOMPurify from "dompurify";

import icons from "~/utils/icons";
import { createSlug, formatMoney, renderStar } from "~/utils/helper";
import { extraInfo } from "~/utils/contains";
import images from "~/assets/images";
import { SelectQuantity, ExtraInfo, Button } from "~/components/common";
import {
	ProInforMation,
	Product,
	VariantsColor,
	VariantsVersion,
} from "~/components/Product";
import { Slider, SliderSubProduct } from "~/components/Slider";
import { BreadcrumbHeader } from "~/components/SectionLayout";
import Ratings from "~/components/Ratings";
import Modal from "~/components/Modal";
import VoteForm from "~/components/Ratings/VoteForm";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { appSelector, userSelector } from "~/redux/selector";
import Swal from "sweetalert2";
import routes from "~/config/routes";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import { getCurrentUser } from "~/redux/asyncActions";
import { checkouts } from "~/redux/userSlice";

function DetailProduct({ navigate, dispatch, location }) {
	const { currentUser } = useSelector(userSelector);
	const { pid, category, name } = useParams();
	const { isShowModal } = useSelector(appSelector);
	const { GoDotFill, FaCartPlus } = icons;

	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [relateProduct, setRelateProduct] = useState([]);
	const [thumbSrc, setThumbSrc] = useState("");
	const [updateRating, setUpdateRating] = useState(false);
	const [selectVariants, setSelectVariants] = useState({
		id: "",
		color: null,
		price: null,
		ram: null,
		internalMemory: null,
	});

	const fetchProductData = async () => {
		const response = await apiGetProduct(pid);
		if (response?.success) {
			setSelectVariants({
				id: response?.getProduct?._id,
				price: response?.getProduct?.price,
				color: response?.getProduct?.color,
				quantity: response?.getProduct?.quantity,
				ram: response?.getProduct?.ram,
				internalMemory: response?.getProduct?.internalMemory,
			});
			setProduct(response?.getProduct);
			setThumbSrc(response?.getProduct?.thumb);
		}
	};

	const handleChangeThumb = (src) => {
		setThumbSrc(src);
	};

	const fetchRelateProductData = async () => {
		const response = await apiGetProducts({
			category: product?.category,
			brand: product?.brand,
		});
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
	useEffect(() => {
		selectVariants?.quantity > 0 ? setQuantity(1) : setQuantity(0);
		let src = "";
		if (selectVariants.id === product?._id) {
			src = product?.thumb;
		} else {
			src = product?.variants?.find(
				(el) => el.sku === selectVariants.id
			)?.thumb;
		}
		setThumbSrc(src);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectVariants]);

	// Enter quantity
	const handleQuantity = useCallback(
		(number) => {
			if (+number > selectVariants?.quantity) {
				setQuantity(selectVariants?.quantity);
			} else {
				setQuantity(+number);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[quantity, selectVariants?.quantity]
	);

	// Handle up or down quantity
	const handleChangeQuantity = useCallback(
		(number) => {
			if (number < 1) {
				setQuantity(1);
			} else if (number > selectVariants?.quantity) {
				setQuantity(selectVariants?.quantity);
			} else {
				setQuantity(number);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[quantity, selectVariants?.quantity]
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
			if (response?.success) {
				setUpdateRating(!updateRating);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isShowModal]
	);

	const handleAddCart = useCallback(async () => {
		if (!currentUser) {
			Swal.fire({
				title: "Notification!",
				text: "You need to log in to continue",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Go to login!",
				cancelButtonText: "No, cancel!",
				reverseButtons: true,
			}).then((result) => {
				if (result.isConfirmed) {
					navigate({
						pathname: routes.login,
						search: createSearchParams({
							redirect: location.pathname,
						}).toString(),
					});
				}
			});
		} else {
			const response = await apiAddCart({
				pid,
				thumbnail: thumbSrc,
				color: selectVariants.color || "Unknown",
				quantity,
				price: selectVariants.price,
			});
			if (response?.success) {
				toast.success("Has been added to your cart!");
				dispatch(getCurrentUser());
			} else {
				toast.error(response.mes);
			}
		}
	});

	const handleBuyNow = () => {
		dispatch(
			checkouts([
				{
					pid,
					color: selectVariants.color || "Unknown",
					quantity,
				},
			])
		);
		navigate(routes.checkout);
	};

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
								{formatMoney(selectVariants?.price)}
							</h3>
							<div className="flex items-center gap-5 my-5 mt-[10px]">
								<span className="flex gap-1">
									{renderStar(product?.totalRatings)?.map(
										(star, i) => (
											<i key={i}>{star}</i>
										)
									)}
								</span>
								<span className="w-[1px] h-full bg-red-300 text-transparent">
									|
								</span>
								<span>{product?.ratings.length} Đánh giá</span>
								<span className="w-[1px] h-full bg-red-300 text-transparent">
									|
								</span>
								<span>{product?.sold} Lượt bán</span>
							</div>
							<ul className="flex flex-col gap-[5px]">
								{product?.description.length > 1 ? (
									product?.description?.map((item) => (
										<li
											key={item}
											className="flex items-center gap-2"
										>
											<GoDotFill />
											{item}
										</li>
									))
								) : (
									<div
										className="line-clamp-[15]"
										dangerouslySetInnerHTML={{
											__html: DOMPurify.sanitize(
												product?.description[0]
											),
										}}
									></div>
								)}
							</ul>
							<div className="my-3">
								<h3 className="text-[16px] font-semibold text-gray-800">
									Phiên bản khác:
								</h3>
								<div className="flex flex-wrap">
									<VariantsVersion
										data={product}
										active={selectVariants.id}
										onClickActive={setSelectVariants}
									/>
								</div>
							</div>
							<div className="my-3">
								<h3 className="text-[16px] font-semibold text-gray-800">
									Màu sắc:
								</h3>
								<div className="flex flex-wrap">
									<VariantsColor
										data={product}
										active={selectVariants.id}
										onClickActive={setSelectVariants}
									/>
									{product?.variants?.map((item) => (
										<VariantsColor
											key={item.sku}
											data={item}
											active={selectVariants.id}
											onClickActive={setSelectVariants}
										/>
									))}
								</div>
							</div>
							<div className="flex items-center gap-2">
								<span>Số lượng</span>
								<SelectQuantity
									quantity={quantity}
									handleQuantity={handleQuantity}
									handleChangeQuantity={handleChangeQuantity}
								/>
								<span>
									{selectVariants?.quantity} sản phẩm còn lại
								</span>
							</div>
							<div className="flex gap-4">
								<Button
									handleClick={handleAddCart}
									title="Thêm vào giỏ hàng"
									leftICon={<FaCartPlus />}
									styleCustom="rounded-sm bg-red-300 border border-red-600 text-white hover:opacity-80 px-4 py3"
								/>
								<Button
									handleClick={handleBuyNow}
									title="Mua ngay"
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
				<div className="flex justify-between underline-heading border-b-2 border-main">
					<h3 className="text-[28px] mb-4 text-gradient uppercase font-semibold">
						Các sản phẩm tương tự
					</h3>
					<Link
						to={`${routes.products}/brand/${product?.brand}`}
						className="hover:underline hover:text-blue-500"
					>
						Tất cả
					</Link>
				</div>
				<div className="grid wide">
					<div className="row">
						{relateProduct?.map((pro) => {
							return (
								<div
									key={pro._id}
									className="col g-l-2-4 g-m-3 g-c-2 mt-3 hover:translate-y-[-2px] transitionAll"
								>
									<Product data={pro} />
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default withBaseComponent(DetailProduct);
