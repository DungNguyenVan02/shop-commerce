import React, { useEffect, useState } from "react";
import icons from "~/utils/icons";
import { useSelector } from "react-redux";
import { userSelector } from "~/redux/selector";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import images from "~/assets/images";
import { formatMoney } from "~/utils/helper";
import { Button, Congratulations } from "~/components/common";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import { apiCreateOrder, apiRemoveCart, apiUpdateAddress } from "~/apis";
import { toast } from "react-toastify";
import { getCurrentUser } from "~/redux/asyncActions";
import { checkouts as checkoutsSlice } from "~/redux/userSlice";
import Swal from "sweetalert2";

const Checkout = ({ dispatch, navigate }) => {
	const [productCheckout, setProductCheckout] = useState([]);
	const [methodPayment, setMeThodPayment] = useState(1);
	const { checkouts, currentUser } = useSelector(userSelector);
	const [address, setAddress] = useState(currentUser?.address[0] || "");
	const [isSuccess, setIsSuccess] = useState(false);

	const { GiPositionMarker } = icons;

	useEffect(() => {
		if (checkouts.length > 0) {
			const products = [];
			currentUser?.cart.forEach((item) => {
				checkouts.forEach((el) => {
					if (
						el.color === item.color &&
						el.pid === item.product._id
					) {
						products.push(item);
					}
				});
			});
			setProductCheckout(products);
		} else {
			setProductCheckout([]);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkouts]);

	const handleSubmit = async () => {
		if (address.length >= 10) {
			const response = await apiUpdateAddress({ address });
			if (response.success) {
				console.log(response);
			} else {
				toast.error("Address update failed! please try again");
			}
		}
	};

	const handleCreateOrder = async () => {
		const payload = {
			products: productCheckout,
			total: (
				productCheckout.reduce(
					(total, item) => total + item.price * item.quantity,
					0
				) / 24000
			).toFixed(2),
			address,
			orderBy: currentUser._id,
			method: "Cash On Delivery",
		};
		const response = await apiCreateOrder(payload);
		if (response.success) {
			const response = await apiRemoveCart({
				arrProduct: productCheckout.map((item) => item._id),
			});

			if (response.success) {
				setIsSuccess(true);
				dispatch(checkoutsSlice([]));
				dispatch(getCurrentUser());
				setTimeout(() => {
					Swal.fire(
						"Congratulations",
						"Order successfully!",
						"success"
					).then(() => {
						setIsSuccess(false);
						navigate("/");
					});
				}, 500);
			}
		}
	};
	return (
		<>
			{isSuccess && <Congratulations />}
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
						<div className="flex items-center text-[16px]">
							<h3 className="font-semibold">
								{`${currentUser?.firstName} ${currentUser?.lastName} (${currentUser?.phone})`}
							</h3>
							<div className="ml-6">
								<span className="relative">
									{currentUser?.address.length > 0 ? (
										currentUser?.address[0] ||
										"Please choose a address"
									) : (
										<input
											value={address}
											onChange={(e) =>
												setAddress(e.target.value)
											}
											placeholder="Enter your address for you"
											className={`w-[340px] border outline-none py-1 px-3 placeholder:text-[14px] rounded ${
												address.length === 0 &&
												"border-main"
											}`}
										/>
									)}
									{address.length < 10 && (
										<p className="text-main text-[12px] absolute bottom-[-24px] left-0">
											Please must be at least 10
											characters!
										</p>
									)}
								</span>
								{currentUser?.address.length > 0 && (
									<span className="ml-2 text-blue-500 text-[14px] cursor-pointer hover:underline">
										Change
									</span>
								)}
							</div>
						</div>
					</div>
					<div className="grid wide">
						<div className="row no-gutters bg-white text-[#888] h-[55px] text-[14px] items-center mt-[24px] shadow-sm border">
							<div className=" col g-l-6 text-[#000c] text-[18px]">
								<h3 className="ml-[20px]">Products Ordered</h3>
							</div>
							<div className="text-center col g-l-2">
								Unit Price
							</div>
							<div className="text-center col g-l-2">
								Quantity
							</div>
							<div className="text-center col g-l-2">
								Total Price
							</div>
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
					</div>
					<div className="flex flex-col items-end  mt-4 bg-white shadow-md">
						<div className="flex items-center justify-between w-full h-[60px] bg-white border-b px-5">
							<h3>Payment Method</h3>
							<select
								className="text-[16px] flex gap-3 outline-none"
								onChange={(e) =>
									setMeThodPayment(e.target.value)
								}
							>
								<option value={1}>Cash on Delivery</option>
								<option value={2}>Online payment</option>
							</select>
						</div>
						<div className="flex flex-col gap-4 bg-[#fffefb] p-4 w-full">
							<div className="text-[14px] border-b-[2px] border-dashed text-[rgba(0,0,0,.54)]">
								<h3>Total product: {productCheckout.length}</h3>
								<h3>
									Total payment:
									<span className="text-[18px] text-main ml-3">
										{formatMoney(
											productCheckout.reduce(
												(total, item) =>
													total +
													item.price * item.quantity,
												0
											)
										)}
									</span>
								</h3>
							</div>
							{methodPayment === 1 ? (
								<Button
									title="Cash On Delivery"
									handleClick={handleCreateOrder}
								/>
							) : (
								<Link
									to={
										address.length !== 0 &&
										routes.checkoutOnline
									}
								>
									<Button
										title="Payment Online"
										handleClick={handleSubmit}
									/>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default withBaseComponent(Checkout);
