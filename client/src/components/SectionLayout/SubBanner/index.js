import React from "react";
import images from "~/assets/images";
import withBaseComponent from "~/components/hocs/withBaseComponent";

const SubBanner = ({ navigate }) => {
	return (
		<div className="flex flex-col gap-3 p-2 shadow-custom_1 rounded-lg border">
			<div
				className="w-full max-h-[116px] rounded-md overflow-hidden"
				onClick={() =>
					navigate(
						"/dien-thoai/65d9feff42a0cba64836d225/Samsung Galaxy S23 8GB 128GB"
					)
				}
			>
				<img
					loading="lazy"
					className="w-full object-contain hover:scale-110 ease-in-out duration-200"
					src="https://clickbuy.com.vn/uploads/media/581-yyCOV.png"
					alt=""
				/>
			</div>
			<div
				className="w-full max-h-[116px] rounded-md overflow-hidden"
				onClick={() => navigate("/tablet")}
			>
				<img
					loading="lazy"
					className="w-full object-cover hover:scale-110 ease-in-out duration-200"
					src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-ipad-gen9-new-th2.jpg"
					alt=""
				/>
			</div>
			<div
				className="w-full max-h-[116px] rounded-md overflow-hidden"
				onClick={() => navigate("/tablet")}
			>
				<img
					loading="lazy"
					className="w-full object-cover hover:scale-110 ease-in-out duration-200"
					src={images.banner1}
					alt=""
				/>
			</div>
		</div>
	);
};

export default withBaseComponent(SubBanner);
