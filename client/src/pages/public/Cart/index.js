/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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

const Cart = ({ dispatch }) => {
	const { currentUser } = useSelector(userSelector);
	const [checkAll, setCheckAll] = useState(false);
	const [checkedList, setCheckList] = useState([]);
	const [itemUpdateCart, setItemUpdateCart] = useState(null);

	const fetchUpdateCart = async (data) => {
		const response = await apiUpdateQuantityCart(data?.pid, data);
		if (response.success) {
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

	const handleUpdateCart = useCallback((dataChange) => {
		setItemUpdateCart(dataChange);
	});

	useEffect(() => {
		document.title = "Shopping Cart";

		return () => {
			document.title = "Digital World";
		};
	}, []);

	const handleCheckedAll = () => {
		setCheckAll(!checkAll);
		if (!checkAll) {
			setCheckList(
				currentUser?.cart?.map((item) => ({
					pid: item.product._id,
					color: item.color,
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

	const handleCheckedItem = useCallback((cid, pid, color) => {
		const isAlready = checkedList?.some(
			(item) => item.pid === pid && item.color === color
		);
		if (isAlready) {
			setCheckList((prev) =>
				prev.filter(
					(item) => !(item.pid === pid && item.color === color)
				)
			);
		} else {
			setCheckList((prev) => [
				...prev,
				{ cid: cid, pid: pid, color: color },
			]);
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
		if (response.success) {
			dispatch(getCurrentUser());
			setCheckList([]);
		} else {
			toast.error("Something went wrong, please try again!");
		}
	};

	const calcPrice = () => {
		const arrCalc = [];
		currentUser?.cart.forEach((item) => {
			checkedList.forEach((el) => {
				if (el.color === item.color && el.pid === item.product._id) {
					arrCalc.push(item);
				}
			});
		});

		return arrCalc.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0);
	};

	return (
		<div className="bg-[#f5f5f5]">
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
						<div className="text-center col g-l-2">Unit Price</div>
						<div className="text-center col g-l-2">Quantity</div>
						<div className="text-center col g-l-2">Total Price</div>
						<div className="text-center col g-l-1">Actions</div>
					</div>

					{currentUser?.cart.map((item, index) => (
						<ItemCartDetail
							key={index}
							data={item}
							checkedList={checkedList}
							onChangeChecked={handleCheckedItem}
							onRemoveCart={handleRemoveCart}
							onUpdateCart={handleUpdateCart}
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
										Select all({currentUser?.cart.length})
									</span>
									<span
										className="cursor-pointer hover:underline hover:text-main"
										onClick={handleRemoveCart}
									>
										Delete
									</span>
								</div>
							</div>
						</div>
						<div className="col g-l-6">
							<div className="flex h-full items-center justify-end gap-4">
								<h3 className="w-2/3">
									Total ({checkedList.length || 0}):{" "}
									<strong className="text-main">
										{formatMoney(calcPrice())}
									</strong>
								</h3>

								<Link
									to={
										checkedList.length > 0 &&
										routes.checkout
									}
									className="w-full"
								>
									<Button
										isDisabled={
											checkedList.length === 0
												? true
												: false
										}
										handleClick={() =>
											dispatch(checkouts(checkedList))
										}
										title="Check out"
										styleCustom={`px-4 py-2 text-white bg-red-500 text-[14px] rounded-md w-full w-1/3 ${
											checkedList.length === 0
												? "opacity-60"
												: " hover:opacity-90"
										}`}
									/>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBaseComponent(Cart);
