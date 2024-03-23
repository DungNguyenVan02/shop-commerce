import React, { memo } from "react";
import AboutOurCard from "~/components/common/AboutOurCard";

const AboutShop = () => {
	const OurShop = [
		{
			id: 1,
			title: "Hàng hóa",
			content:
				"Sản phẩm luôn được đảm bảo về chất lượng tới tận tay khách hàng",
		},
		{
			id: 2,
			title: "Khuyến mãi",
			content: "Khuyến mãi lớn với nhiều ưu đãi",
		},
		{
			id: 3,
			title: "Giao hàng",
			content:
				"Miễn phí vận chuyển cho bất kỳ đơn hàng nào từ 10 triệu đồng",
		},
		{
			id: 4,
			title: "Chất lượng",
			content:
				"Sản phẩm luôn được đảm bảo về chất lượng tới tận tay khách hàng",
		},
	];

	return (
		<div className="bg-gray-900 text-white py-[34px]">
			<div className="max-w-main w-full mx-auto py-5">
				<h3 className="text-[36px] mb-3 font-semibold">
					Về cửa hàng của chúng tôi
				</h3>
				<div className="grid wide">
					<div className="row">
						{OurShop.map((data) => {
							return (
								<div
									key={data.id}
									className="col g-l-3 g-m-6 g-c-12 mt-4"
								>
									<AboutOurCard
										title={data.title}
										content={data.content}
										number={data.id}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AboutShop);
