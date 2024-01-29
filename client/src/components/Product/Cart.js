import { memo } from "react";
import ItemCart from "./ItemCart";
import { Button } from "../common";
import { useSelector } from "react-redux";
import { userSelector } from "~/redux/selector";
import images from "~/assets/images";

const Cart = () => {
	const { currentUser } = useSelector(userSelector);
	return (
		<div className="cart">
			<div className="absolute top-[34px] right-[-26px] w-[380px] rounded-md border bg-white shadow-md animate-scaleUpTopRight">
				{currentUser?.cart?.length > 0 ? (
					<>
						<h3 className="my-2 mx-3 mb-0 text-[14px] text-[#999] font-[400]">
							Products added
						</h3>
						<div className="max-h-[56vh] overflow-y-auto">
							{currentUser?.cart.map((item, index) => {
								return <ItemCart key={index} data={item} />;
							})}
						</div>
						<Button
							styleCustom="float-right mr-3 my-3 px-4 py-2 text-white bg-red-500 text-[14px] rounded hover:opacity-90"
							title="View my shopping cart"
						/>
					</>
				) : (
					<div className=" h-[300px] flex items-center justify-center flex-col">
						<img
							className="w-[250px]"
							src={images.noCart}
							alt="Empty cart"
						/>
						<h3>Empty cart</h3>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(Cart);
