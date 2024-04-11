/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiRemoveCart, apiUpdateQuantityCart } from "~/apis";
import { ItemCartDetail } from "~/components/Product";
import { Button } from "~/components/common";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import { useDebounce } from "~/components/hooks";
import routes from "~/config/routes";
import { getCurrentUser } from "~/redux/asyncActions";
import { userSelector } from "~/redux/selector";
import { checkouts } from "~/redux/userSlice";
import { formatMoney } from "~/utils/helper";

const Cart = ({ dispatch, navigate }) => {
	const { currentUser } = useSelector(userSelector);

	const [checkAll, setCheckAll] = useState(false);

	const [checkedList, setCheckList] = useState([]);

	const [itemUpdateCart, setItemUpdateCart] = useState(null);

	const fetchUpdateCart = async (data) => {
		const response = await apiUpdateQuantityCart(data);
		if (response?.success) {
			dispatch(getCurrentUser());
		} else {
			toast.error(response.mes);
		}
	};

	const debounceQuantity = useDebounce(itemUpdateCart, 500);

	useEffect(() => {
		debounceQuantity && fetchUpdateCart(debounceQuantity);
		// eslint-disable-next-line no-use-before-define
	}, [debounceQuantity]);

	const handleUpdateQuantityCart = useCallback((dataChange) => {
		setItemUpdateCart(dataChange);
	});

	useEffect(() => {
		document.title = "Giỏ hàng";

		return () => {
			document.title = "LEO phone";
		};
	}, []);

	const handleCheckedAll = () => {
		setCheckAll(!checkAll);
		if (!checkAll) {
			setCheckList(
				currentUser?.cart?.map((item) => ({
					cid: item._id,
					pid: item?.product._id,
					sku: item?.sku,
				}))
			);
		} else {
			setCheckList([]);
		}
	};

	useEffect(() => {
		if (checkedList.length === currentUser?.cart.length) {
			setCheckAll(true);
		} else {
			setCheckAll(false);
		}
	}, [checkedList]);

	const handleCheckedItem = useCallback((cid, pid, sku) => {
		const isAlready = checkedList?.some((item) => item.sku === sku);

		if (isAlready) {
			setCheckList((prev) => prev.filter((item) => item.sku !== sku));
		} else {
			setCheckList((prev) => [...prev, { cid: cid, pid: pid, sku: sku }]);
		}
	});
	const handleRemoveCart = async (cid) => {
		let payload = {};
		if (checkedList.length > 0) {
			payload.arrProduct = checkedList.map((item) => item.cid);
		} else {
			payload.arrProduct = [cid];
		}

		const response = await apiRemoveCart(payload);
		if (response?.success) {
			dispatch(getCurrentUser());
			setCheckList([]);
		} else {
			toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
		}
	};

	const calcPrice = () => {
		const arrCalc = [];
		currentUser?.cart.forEach((item) => {
			checkedList.forEach((el) => {
				if (item._id === el.cid) {
					arrCalc.push(item);
				}
			});
		});

		return arrCalc.reduce((total, item) => {
			return (
				total +
				item.price *
					((100 - item?.product?.discount) / 100) *
					item.quantity
			);
		}, 0);
	};

	const handleCheckout = () => {
		if (!currentUser.address || !currentUser.phone) {
			Swal.fire({
				title: "Hệ thống thông báo",
				text: "Vui lòng cập nhật đầy đủ thông tin trước khi thanh toán",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Cập nhật thông tin",
				cancelButtonText: "Hủy bỏ",
			}).then((result) => {
				if (result.isConfirmed) {
					navigate(routes.member_personal);
				}
			});
		} else {
			dispatch(checkouts(checkedList));
			navigate(routes.checkout);
		}
	};

	return (
		<div className="bg-[#f5f5f5] w-full">
			<div className="max-w-main w-full mx-auto py-[20px]">
				<div className="grid wide">
					<div className="row bg-white text-[#888] h-[55px] text-[14px] items-center  px-3 mb-[20px] shadow-sm">
						<div className=" col g-l-5 text-[#000c]">
							<div className="flex items-center gap-2">
								<input
									className="w-[18px] h-[18px]"
									type="checkbox"
									checked={checkAll}
									onChange={handleCheckedAll}
								/>
								<h3 className="ml-[20px]">Product</h3>
							</div>
						</div>
						<div className="text-center col g-l-2">Đơn giá</div>
						<div className="text-center col g-l-2">Số lượng</div>
						<div className="text-center col g-l-2">Tổng tiền</div>
						<div className="text-center col g-l-1">Tùy chọn</div>
					</div>

					{currentUser?.cart.map((item, index) => (
						<ItemCartDetail
							key={index}
							data={item}
							checkedList={checkedList}
							onChangeChecked={handleCheckedItem}
							onRemoveCart={handleRemoveCart}
							onUpdateQuantityCart={handleUpdateQuantityCart}
						/>
					))}

					<div className="row bg-white shadow-sm h-[100px]">
						<div className="col g-l-6">
							<div className="flex items-center h-full">
								<div className="flex items-center gap-3 pl-[13px]">
									<input
										onChange={handleCheckedAll}
										checked={checkAll}
										type="checkbox"
										className="w-[18px] h-[18px]"
									/>{" "}
									<span>
										Tất cả ({currentUser?.cart.length})
									</span>
									<span
										className="cursor-pointer hover:underline hover:text-main"
										onClick={handleRemoveCart}
									>
										Xóa
									</span>
								</div>
							</div>
						</div>
						<div className="col g-l-6">
							<div className="flex h-full items-center justify-end gap-4">
								<h3 className="w-2/3">
									Tổng thanh toán ({checkedList.length || 0}):{" "}
									<strong className="text-main">
										{formatMoney(calcPrice())}
									</strong>
								</h3>

								<Button
									isDisabled={
										checkedList.length === 0 ? true : false
									}
									handleClick={handleCheckout}
									title="Thanh toán"
									styleCustom={`px-4 py-2 text-white bg-red-500 text-[14px] rounded-md w-full w-1/3 ${
										checkedList.length === 0
											? "opacity-60"
											: " hover:opacity-90"
									}`}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBaseComponent(Cart);
