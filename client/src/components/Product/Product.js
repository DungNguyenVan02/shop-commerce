import icons from "~/utils/icons";
import images from "~/assets/images";
import { SelectOptions } from "~/components/common";
import { formatMoney, renderStar } from "~/utils/helper";
import { memo } from "react";
import withBaseComponent from "../hocs/withBaseComponent";
import { useSelector } from "react-redux";
import { userSelector } from "~/redux/selector";
import Swal from "sweetalert2";
import routes from "~/config/routes";
import { apiAddCart, apiUpdateWishlist } from "~/apis";
import { getCurrentUser } from "~/redux/asyncActions";
import { toast } from "react-toastify";
import { Link, createSearchParams } from "react-router-dom";

function Product({ data, active, navigate, location, dispatch, border }) {
	const { FaHeart, FaCartPlus, FaRegEye } = icons;

	const { currentUser } = useSelector(userSelector);

	const handleClickOptions = async (e, click) => {
		e.stopPropagation();
		switch (click) {
			case "heart":
				const response = await apiUpdateWishlist(data._id);
				if (response?.success) {
					toast.success(response.mes);
					dispatch(getCurrentUser());
				} else {
					toast.error(response.mes);
				}
				break;
			case "addCart":
				if (!currentUser) {
					Swal.fire({
						title: "Hệ thống thông báo!",
						text: "Bạn cần đăng nhập vào hệ thống trước khi thêm sản phẩm vào giỏ hàng",
						icon: "warning",
						showCancelButton: true,
						confirmButtonText: "Đăng nhập",
						cancelButtonText: "Thoát",
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
						pid: data._id,
						color: data?.color || "Unknown",
						price: data?.price,
						quantity: 1,
						thumbnail: data.thumb,
					});
					if (response?.success) {
						toast.success("Sản phẩm đã được thêm vào giỏ hàng");
						dispatch(getCurrentUser());
					} else {
						toast.error(response.mes);
					}
				}
				break;

			default:
				console.log("Invalid click action");
		}
	};

	return (
		<div
			className={`relative p-2 w-full rounded-lg cursor-pointer ${
				border ? "border" : "shadow-custom"
			} bg-white`}
		>
			{data?.discount > 0 && (
				<span className="tagDiscount">{data?.discount} %</span>
			)}
			<div className="w-full h-full mx-auto relative product-parent">
				<div className="product-child absolute bottom-0 left-[50%] justify-center gap-4 py-1 animate-slideTop">
					<span
						title="Add wishlist"
						onClick={(e) => handleClickOptions(e, "heart")}
					>
						<SelectOptions
							icon={
								<FaHeart
									color={
										currentUser?.wishlist?.find(
											(item) => item._id === data._id
										)
											? "red"
											: ""
									}
								/>
							}
						/>
					</span>
					<span
						title="Add your cart"
						onClick={(e) => {
							e.stopPropagation();
							handleClickOptions(e, "addCart");
						}}
					>
						<SelectOptions icon={<FaCartPlus />} />
					</span>
					<Link
						to={`/${routes.detailProduct}/${data?.category}/${data?._id}/${data?.name}`}
						title="Show detail"
					>
						<SelectOptions icon={<FaRegEye />} />
					</Link>
				</div>
				<img
					className="max-w-[230px] w-full object-cover mx-auto"
					src={data?.thumb || images.noProductImage}
					alt=""
				/>
				{active === 0 ? (
					<span className="tagTrending">Trending</span>
				) : active === 1 ? (
					<span className="tagNew">New</span>
				) : (
					""
				)}
			</div>
			<div>
				<div>
					<h3 className="line-clamp-1 text-[18px] font-medium">
						{data?.name}
					</h3>
					<p className="opacity-80 font-light text-[12px]">
						{data?.brand}
					</p>
				</div>
				<div className="flex items-center gap-1">
					{renderStar(data?.totalRatings).map((item, i) => (
						<i key={i}>{item}</i>
					))}
				</div>
				<div className="text-[13px] mb-3 h-[34px] flex items-center justify-between">
					<h4 className="text-[14px] font-medium ">
						{formatMoney(
							data?.price * ((100 - data?.discount) / 100)
						)}
					</h4>
					{data?.discount > 0 && (
						<h4 className="line-through text-[12px] opacity-60 font-medium">
							{formatMoney(data?.price)}
						</h4>
					)}
				</div>
			</div>
		</div>
	);
}

export default withBaseComponent(memo(Product));
