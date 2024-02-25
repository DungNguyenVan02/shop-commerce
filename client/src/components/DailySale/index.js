import { useEffect, useState, memo, useRef } from "react";
import icons from "~/utils/icons";
import { apiGetProducts } from "~/apis/products";
import { renderStar, formatMoney } from "~/utils/helper";
import images from "~/assets/images";
import CountDown from "./CountDown";
import moment from "moment";
import { formatTimes } from "~/utils/helper";
import { useSelector } from "react-redux";
import { newProductSelector } from "~/redux/selector";
import withBaseComponent from "../hocs/withBaseComponent";
import { getDeadDaily } from "~/redux/productSlice";
import { checkouts } from "~/redux/userSlice";
import routes from "~/config/routes";

function DailySale({ dispatch, navigate }) {
	const { FaStar } = icons;
	const idInterval = useRef();

	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);
	const [expired, setExpired] = useState(false);
	const { deadDaily } = useSelector(newProductSelector);

	const fetchDeadDaily = async () => {
		const response = await apiGetProducts({
			limit: 1,
			page: Math.floor(Math.random() * 5),
			sort: "-totalRatings",
		});
		if (response.success) {
			dispatch(
				getDeadDaily({
					data: response.products[0],
					time: Date.now() + 24 * 60 * 60 * 1000,
				})
			);
		}
	};

	useEffect(() => {
		if (deadDaily?.time) {
			const deltaTime = deadDaily.time - Date.now();
			const times = formatTimes(deltaTime);
			setSeconds(times.s);
			setMinutes(times.m);
			setHours(times.h);
		}
	}, [deadDaily]);

	useEffect(() => {
		idInterval.current && clearInterval(idInterval.current);
		if (
			moment(moment(deadDaily?.time).format("MM/DD/YYYY")).isBefore(
				moment()
			)
		) {
			fetchDeadDaily();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [expired]);

	useEffect(() => {
		idInterval.current = setInterval(() => {
			if (seconds > 0) {
				setSeconds((prev) => prev - 1);
			} else {
				if (minutes > 0) {
					setMinutes((prev) => prev - 1);
					setSeconds(59);
				} else {
					if (hours > 0) {
						setHours((prev) => prev - 1);
						setMinutes(59);
						setSeconds(59);
					} else {
						setExpired(!expired);
					}
				}
			}
		}, 1000);

		return () => clearInterval(idInterval.current);
	}, [seconds, minutes, hours, expired]);

	const handleBuyNow = () => {
		dispatch(
			checkouts([
				{
					pid: deadDaily?.data?._id,
					color: deadDaily?.data?.color || "Unknown",
				},
			])
		);
		navigate(routes.checkout);
	};

	return (
		<div className="border p-5 h-full">
			<div className="relative flex items-center justify-center text-[20px] font-semibold text-[#505050]">
				<FaStar color="#d11" className="absolute left-0" />
				<h3>DAILY DEALS</h3>
			</div>
			<img
				className="mx-auto mt-8 w-[120px]"
				src={deadDaily?.data?.thumb || images.defaultProduct}
				alt={deadDaily?.data?.name}
			/>
			<div className="flex flex-col items-center text-[16px]">
				<h3 className="line-clamp-1">{deadDaily?.data?.name}</h3>
				<div className="flex gap-1 mt-1">
					{renderStar(deadDaily?.data?.totalRatings)?.map(
						(star, i) => (
							<i key={i}>{star}</i>
						)
					)}
				</div>
				<span className="my-2">
					{formatMoney(deadDaily?.data?.price)}
				</span>
			</div>
			<div className="flex justify-center items-center gap-4">
				<CountDown unit="Hours" number={hours} />
				<CountDown unit="Minutes" number={minutes} />
				<CountDown unit="Seconds" number={seconds} />
			</div>
			<button
				onClick={handleBuyNow}
				className="mt-4 bg-main w-full py-2 px-3 text-white text-[14px] rounded hover:bg-gray-500"
			>
				Buy Now
			</button>
		</div>
	);
}

export default withBaseComponent(memo(DailySale));
