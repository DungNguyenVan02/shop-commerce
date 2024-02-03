import React, { useEffect, useState } from "react";
import icons from "~/utils/icons";
import { useSelector } from "react-redux";
import { userSelector } from "~/redux/selector";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import images from "~/assets/images";
import { formatMoney } from "~/utils/helper";
import { Button } from "~/components/common";

const Checkout = () => {
	const [productCheckout, setProductCheckout] = useState([]);
	const { checkouts, currentUser } = useSelector(userSelector);

	const { GiPositionMarker } = icons;

	useEffect(() => {
		const products = [];
		currentUser?.cart.forEach((item) => {
			checkouts.forEach((el) => {
				if (el.color === item.color && el.pid === item.product._id) {
					products.push(item);
				}
			});
		});
		setProductCheckout(products);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkouts]);

	console.log(productCheckout);

	return (
		<div className="bg-[#f5f5f5]">
			<div className="max-w-main mx-auto py-[20px]">
				<div className="tagHeader"></div>
				<div className="h-[116px] bg-white shadow-sm p-[28px] flex flex-col justify-center gap-3 border">
					<div className="flex items-center gap-1">
						<GiPositionMarker size={22} color="#EE3131" />
						<span className="text-[18px] text-main">
							Delivery Address
						</span>
					</div>
					<div className="flex items-end text-[16px]">
						<h3 className="font-semibold">
							{`${currentUser?.firstName} ${currentUser?.lastName} (${currentUser?.phone})`}
						</h3>
						<div className="ml-6">
							<span>
								{currentUser?.address[0] ||
									"Please choose a address"}
							</span>
							<span className="ml-2 text-blue-500 text-[14px] cursor-pointer hover:underline">
								Change
							</span>
						</div>
					</div>
				</div>
				<div className="grid wide">
					<div className="row no-gutters bg-white text-[#888] h-[55px] text-[14px] items-center mt-[24px] shadow-sm border">
						<div className=" col g-l-6 text-[#000c] text-[18px]">
							<h3 className="ml-[20px]">Products Ordered</h3>
						</div>
						<div className="text-center col g-l-2">Unit Price</div>
						<div className="text-center col g-l-2">Quantity</div>
						<div className="text-center col g-l-2">Total Price</div>
					</div>
					{productCheckout.map((pro, index) => (
						<div
							key={index}
							className="row no-gutters bg-white text-[#888] text-[14px] items-center p-3 mt-2 border-b shadow-sm border"
						>
							<div className="col g-l-6">
								<div className="flex gap-2 items-center">
									<div className="flex items-center gap-2">
										<img
											className="w-[80px] h-[80x] object-cover"
											src={
												pro?.thumbnail ||
												images.defaultProduct
											}
											alt=""
										/>
										<div className="flex flex-col justify-center">
											<span className="text-[#000D] line-clamp-2">
												{pro?.product?.name}
											</span>
											<span>Color: {pro?.color}</span>
										</div>
									</div>
								</div>
							</div>
							<div className=" text-center col g-l-2">
								{formatMoney(pro?.price)}
							</div>
							<div className=" text-center col g-l-2">
								{pro.quantity}
							</div>
							<div className="text-center col g-l-2">
								{formatMoney(pro?.price * pro.quantity)}
							</div>
						</div>
					))}
					<div className="flex justify-end mt-3 bg-white p-4 shadow-sm border">
						<div className="w-1/5">
							<Button title="Place Order" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
