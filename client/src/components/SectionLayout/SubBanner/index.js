import React from "react";
import withBaseComponent from "~/components/hocs/withBaseComponent";

const SubBanner = ({ navigate }) => {
	return (
		<div className="flex flex-col gap-3">
			<div
				className="w-full max-h-[130px] rounded-md overflow-hidden"
				onClick={() =>
					navigate(
						"/smartphone/65d9feff42a0cba64836d225/Samsung Galaxy S23 8GB 128GB"
					)
				}
			>
				<img
					className="w-full object-cover hover:scale-110 ease-in-out duration-200"
					src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/samsung-s23-th1-right.png"
					alt=""
				/>
			</div>
			<div
				className="w-full max-h-[130px] rounded-md overflow-hidden"
				onClick={() => navigate("/tablet")}
			>
				<img
					className="w-full object-cover hover:scale-110 ease-in-out duration-200"
					src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-ipad-gen9-new-th2.jpg"
					alt=""
				/>
			</div>
		</div>
	);
};

export default withBaseComponent(SubBanner);
