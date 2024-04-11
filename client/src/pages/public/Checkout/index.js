import React, { useEffect, useMemo, useState } from "react";
import icons from "~/utils/icons";
import { useSelector } from "react-redux";
import { userSelector } from "~/redux/selector";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import images from "~/assets/images";
import { formatMoney } from "~/utils/helper";
import { Button, Congratulations } from "~/components/common";
import { apiCheckoutOnline, apiCreateOrder, apiRemoveCart } from "~/apis";
import { getCurrentUser } from "~/redux/asyncActions";
import { checkouts as checkoutsSlice } from "~/redux/userSlice";
import Swal from "sweetalert2";
import moment from "moment";

const Checkout = ({ dispatch, navigate, location }) => {
	const { FaCheck, GiPositionMarker } = icons;
	const [productCheckout, setProductCheckout] = useState([]);
	const [methodPayment, setMeThodPayment] = useState(1);
	const [expectedDelivery, setExpectedDelivery] = useState({
		from: "",
		to: "",
	});
	const { checkouts, currentUser } = useSelector(userSelector);
	const [isSuccess, setIsSuccess] = useState(false);

	useEffect(() => {
		const listProductCheckout = [];
		currentUser?.cart.forEach((item) => {
			checkouts.forEach((el) => {
				if (el.cid === item._id) {
					listProductCheckout.push(item);
				}
			});
		});

		setProductCheckout(listProductCheckout);

		const date = new Date();

		setExpectedDelivery({
			from: `${date.getDay() + 2} Tháng ${date.getMonth() + 1}`,
			to: `${date.getDay() + 4} Tháng ${date.getMonth() + 1}`,
		});

		window.scrollTo(0, 0);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkouts]);

	const totalPayment = useMemo(() => {
		return productCheckout.reduce(
			(total, item) =>
				total +
				item.price *
					((100 - item.product.discount) / 100) *
					item.quantity,
			0
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productCheckout]);

	const handleCreateOrder = async () => {
		const date = new Date();
		const payload = {
			code: `${Math.floor(Math.random() * 10)}${moment(date).format(
				"YYYYMMDDHHmmss"
			)}`,
			products: productCheckout,
			total: totalPayment,
			address: currentUser.address?.detail,
			orderBy: currentUser._id,
			method: "Thanh toán khi nhận hàng",
		};
		const response = await apiCreateOrder(payload);
		if (response?.success) {
			const response = await apiRemoveCart({
				arrProduct: productCheckout.map((item) => item._id),
			});

			if (response?.success) {
				setIsSuccess(true);
				dispatch(checkoutsSlice([]));
				dispatch(getCurrentUser());
				setTimeout(() => {
					Swal.fire(
						"Hệ thống thông báo",
						"Đặt hàng thành công!",
						"success"
					).then(() => {
						setIsSuccess(false);
						navigate("/");
					});
				}, 500);
			}
		}
	};

	const handleCheckoutOnline = async () => {
		const response = await apiCheckoutOnline({ amount: totalPayment });

		if (response) {
			window.location = response.url;
		}
	};

	const fetchCreateCheckoutOnline = async (data) => {
		const response = await apiCreateOrder(data);
		if (response?.success) {
			const response = await apiRemoveCart({
				arrProduct: productCheckout.map((item) => item._id),
			});
			if (response?.success) {
				setIsSuccess(true);
				dispatch(checkoutsSlice([]));
				dispatch(getCurrentUser());
				setTimeout(() => {
					Swal.fire(
						"Hệ thống thông báo",
						"Đặt hàng thành công!",
						"success"
					).then(() => {
						setIsSuccess(false);
						navigate("/");
					});
				}, 500);
			}
		}
	};

	useEffect(() => {
		if (location?.search.length > 0 && productCheckout.length > 0) {
			const filterInfoParam = location.search.split("?")[1].split("&");

			const objectConvert = {};
			filterInfoParam.forEach((item) => {
				objectConvert[item.split("=")[0]] = item.split("=")[1];
			});
			console.log(Object.keys(objectConvert).length > 0);

			if (Object.keys(objectConvert).length > 0) {
				if (objectConvert.vnp_TransactionStatus === "00") {
					fetchCreateCheckoutOnline({
						products: productCheckout,
						code: objectConvert.vnp_BankTranNo,
						total: objectConvert.vnp_Amount,
						address: currentUser.address.detail,
						orderBy: currentUser._id,
						isPayed: true,
						method: "Thanh toán online",
					});
				}
			} else {
				Swal.fire(
					"Hệ thống thông báo",
					"Thanh toán không thành công! Vui lòng thử lại",
					"error"
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location?.search.length > 0, productCheckout]);

	console.log(productCheckout);

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
								Thông tin về địa chỉ giao hàng
							</span>
						</div>
						<div className="flex items-center text-[16px] gap-2">
							<h3 className="font-semibold">
								{`${currentUser?.fullName} (${currentUser?.phone})`}
							</h3>
							<span>{currentUser?.address?.detail}</span>
						</div>
					</div>
					<div className="grid wide">
						<div className="row no-gutters bg-white text-[#888] h-[55px] text-[14px] items-center mt-[24px] shadow-sm border-b">
							<div className=" col g-l-6 text-[#000c] text-[18px]">
								<h3 className="ml-[20px]">Sản phẩm</h3>
							</div>
							<div className="text-center col g-l-2">Đơn giá</div>
							<div className="text-center col g-l-2">
								Số lượng
							</div>
							<div className="text-center col g-l-2">
								Tổng tiền
							</div>
						</div>
						<div className="bg-white py-5">
							{productCheckout?.map((product, index) => (
								<div
									key={index}
									className="row no-gutters text-[#888] text-[14px] items-center mt-4 px-5"
								>
									<div className="col g-l-6 g-m-6 g-c-12">
										<div className="flex gap-2 items-center">
											<div className="flex items-center gap-2">
												<img
													loading="lazy"
													className="w-[80px] h-[80x] object-cover"
													src={
														product?.thumbnail ||
														images.defaultProduct
													}
													alt=""
												/>
												<div className="flex flex-col justify-center">
													<span className="text-[#000D] line-clamp-2">
														{product?.product.name}
													</span>
													<span>
														Ram: {product?.ram}
													</span>
													<span>
														Bộ nhớ:{" "}
														{
															product?.internalMemory
														}
													</span>
													<span>
														Màu sắc:{" "}
														{product?.color}
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className=" text-center col g-l-2 g-m-2 g-c-12">
										<span>
											{formatMoney(
												product?.price *
													((100 -
														product.product
															?.discount) /
														100)
											)}
										</span>
									</div>
									<div className=" text-center col g-l-2 g-m-2 g-c-12">
										{product.quantity}
									</div>
									<div className="text-center col g-l-2 g-m-2 g-c-12">
										{formatMoney(
											product?.price *
												((100 -
													product.product?.discount) /
													100) *
												product.quantity
										)}
									</div>
								</div>
							))}
							<div className="flex gap-5 items-center border-t-[1px] border-dashed py-4 px-5 bg-[#fafdff]">
								<span>Giao hàng nhanh:</span>
								<span className="flex items-center text-[#26aa99] text-[12px] gap-2">
									<img
										loading="lazy"
										src={images.iconShip}
										alt=""
									/>
									<p>{`Dự kiến nhận hàng vào: ${expectedDelivery?.from} - ${expectedDelivery?.to}`}</p>
								</span>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-end  mt-4 bg-white shadow-md">
						<div className="flex items-center w-full h-[60px] bg-white border-b px-5 gap-5">
							<h3>Phương thức thanh toán</h3>
							<ul className="flex items-center gap-3">
								<li
									onClick={() =>
										methodPayment !== 1 &&
										setMeThodPayment(1)
									}
									className={`${
										methodPayment === 1
											? "border-main "
											: "bg-white"
									} cursor-pointer  py-2 px-4 relative  border rounded-md shadow-custom_1`}
								>
									<h3>Thanh toán khi nhận hàng</h3>
									{methodPayment === 1 && (
										<i className="absolute bottom-0 right-[2px] ">
											<FaCheck size={16} color="red" />
										</i>
									)}
								</li>
								<li
									onClick={() =>
										methodPayment !== 2 &&
										setMeThodPayment(2)
									}
									className={`${
										methodPayment === 2
											? "border-main "
											: "bg-white"
									} cursor-pointer  py-2 px-4 relative  border rounded-md shadow-custom_1`}
								>
									<h3>Thanh toán online</h3>
									{methodPayment === 2 && (
										<i className="absolute bottom-0 right-[2px] ">
											<FaCheck size={16} color="red" />
										</i>
									)}
								</li>
							</ul>
						</div>
						<div className="flex flex-col gap-4 bg-[#fffefb] p-4 w-full">
							<div className="text-[14px] border-b-[2px] border-dashed text-[rgba(0,0,0,.54)]">
								<h3>
									Số lượng sản phẩm: {productCheckout.length}
								</h3>
								<h3>
									Tổng thanh toán:
									<span className="text-[18px] text-main ml-3">
										{formatMoney(totalPayment)}
									</span>
								</h3>
							</div>
							{methodPayment === 1 ? (
								<Button
									styleCustom="bg-red-500 text-[14px] rounded-md w-full hover:opacity-90 py-2 text-white"
									title="Thanh toán khi nhận hàng"
									handleClick={() => {
										handleCreateOrder();
									}}
								/>
							) : (
								<Button
									handleClick={handleCheckoutOnline}
									title="Thanh toán online qua VNpay"
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default withBaseComponent(Checkout);
