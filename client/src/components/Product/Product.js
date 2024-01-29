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
import { apiAddCart } from "~/apis";
import { getCurrentUser } from "~/redux/asyncActions";
import { toast } from "react-toastify";

function Product({
	data,
	active,
	productPage,
	productPageDetail,
	navigate,
	dispatch,
}) {
	const { FaHeart, FaCartPlus, FaRegEye } = icons;

	const { currentUser } = useSelector(userSelector);

	const handleClickOptions = async (e, click) => {
		e.stopPropagation();
		switch (click) {
			case "heart":
				console.log("heart");
				break;
			case "addCart":
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
							navigate(routes.login);
						}
					});
				} else {
					const response = await apiAddCart({
						pid: data._id,
						color: data.color,
					});
					if (response.success) {
						toast.success("Has been added to your cart!");
						dispatch(getCurrentUser());
					} else {
						toast.error(response.mes);
					}
				}
				break;
			case "quickView":
				navigate(
					`${
						productPage || productPageDetail
							? "/" + data?.category?.toLowerCase()
							: data?.category?.toLowerCase()
					}/${data?._id}/${data?.name}`
				);
				break;

			default:
				console.log("Invalid click action");
		}
	};

	return (
		<div
			onClick={() =>
				navigate(
					`${
						productPage || productPageDetail
							? "/" + data?.category?.toLowerCase()
							: data?.category?.toLowerCase()
					}/${data?._id}/${data?.name}`
				)
			}
			className="p-[15px] border border-gray-300 block shadow-lg"
		>
			<div className="w-full h-full mx-auto relative product-parent">
				<div className="product-child absolute bottom-0 left-[50%] justify-center gap-4 py-1 animate-slideTop">
					<span
						title="Add wishlist"
						onClick={(e) => handleClickOptions(e, "heart")}
					>
						<SelectOptions icon={<FaHeart />} />
					</span>
					<span
						title="Show detail"
						onClick={(e) => handleClickOptions(e, "addCart")}
					>
						<SelectOptions icon={<FaCartPlus />} />
					</span>
					<span
						title="Show detail"
						onClick={(e) => handleClickOptions(e, "quickView")}
					>
						<SelectOptions icon={<FaRegEye />} />
					</span>
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
		</div>
	);
}

export default withBaseComponent(memo(Product));
