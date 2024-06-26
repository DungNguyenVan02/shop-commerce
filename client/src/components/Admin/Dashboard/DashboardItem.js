import React, { memo, useState } from "react";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import routes from "~/config/routes";
import icons from "~/utils/icons";
const DashboardItem = ({ data, navigate }) => {
	const { BsCart3, MdOutlineLocalShipping, TbTruckReturn, GrMoney } = icons;
	const [isHover, setIsHover] = useState(false);

	const handleClick = () => {
		if (data?.title === "Hoàn trả đơn hàng") {
			navigate(routes.admin_manage_return);
		} else if (data?.title === "Earning") {
			navigate(routes.admin_manage_orders);
		} else {
			navigate(routes.admin_manage_orders);
		}
	};

	return (
		<div
			onClick={handleClick}
			className={` flex flex-col justify-between border-l-[5px] hover:text-white  h-[124px] p-5 rounded-md bg-white shadow-custom cursor-pointer ${
				data?.title === "Giao hàng thành công"
					? "border-green-600 hover:bg-green-600"
					: data?.title === "Hoàn trả đơn hàng"
					? "border-red-600 hover:bg-red-600"
					: data?.title === "Earning"
					? "border-[#f5ad42] hover:bg-[#f5ad42]"
					: "border-blue-600 hover:bg-blue-600"
			} `}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			<div className="flex justify-between items-center">
				<h3 className="text-[20px] font-semibold">{data?.title}</h3>
				{data?.title === "Giao hàng thành công" ? (
					<BsCart3 size={28} color={isHover ? "#fff" : "#07bc0c"} />
				) : data?.title === "Hoàn trả đơn hàng" ? (
					<TbTruckReturn
						size={28}
						color={isHover ? "#fff" : "#e74c3c"}
					/>
				) : data?.title === "Đang xử lý" ? (
					<MdOutlineLocalShipping
						size={28}
						color={isHover ? "#fff" : "#3498db"}
					/>
				) : (
					<GrMoney size={28} color={isHover ? "#fff" : "#f5ad42"} />
				)}
			</div>
			<span className="text-[26px]">{data?.total}</span>
		</div>
	);
};

export default withBaseComponent(memo(DashboardItem));
