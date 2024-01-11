import { useEffect, useState, memo, useRef } from "react";
import icons from "~/utils/icons";
import { apiGetProducts } from "~/apis/products";
import { renderStar, formatMoney } from "~/utils/helper";
import images from "~/assets/images";
import CountDown from "./CountDown";
import moment from "moment";
import { formatTimes } from "~/utils/helper";

function DailySale() {
	const { FaStar } = icons;
	const idInterval = useRef();

	const [dealDaily, setDealDaily] = useState(null);

	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);
	const [expired, setExpired] = useState(false);

	const fetchDeadDaily = async () => {
		const response = await apiGetProducts({
			limit: 1,
			page: Math.floor(Math.random() * 5),
			totalRatings: 5,
		});
		if (response.success) {
			setDealDaily(response.products[0]);
			const today = `${moment().format("MM/DD/YYYY")} 00:00:00`;
			const seconds =
				new Date(today).getTime() -
				new Date().getTime() +
				24 * 3600 * 1000;
			const times = formatTimes(seconds);

			setSeconds(times.s);
			setMinutes(times.m);
			setHours(times.h);
		} else {
			setSeconds(0);
			setMinutes(30);
			setHours(59);
		}
	};

	useEffect(() => {
		idInterval.current && clearInterval(idInterval.current);
		fetchDeadDaily();
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

	return (
		<div className="border p-5 h-full">
			<div className="relative flex items-center justify-center text-[20px] font-semibold text-[#505050]">
				<FaStar color="#d11" className="absolute left-0" />
				<h3>DAILY DEALS</h3>
			</div>
			<img
				className="mx-auto mt-8"
				src={dealDaily?.thumb || images.defaultProduct}
				alt={dealDaily?.name}
			/>
			<div className="flex flex-col items-center text-[16px]">
				<h3 className="line-clamp-1">{dealDaily?.name}</h3>
				<div className="flex gap-1 mt-1">
					{renderStar(dealDaily?.totalRatings)?.map((star, i) => (
						<i key={i}>{star}</i>
					))}
				</div>
				<span className="my-2">{formatMoney(dealDaily?.price)}</span>
			</div>
			<div className="flex justify-center items-center gap-4">
				<CountDown unit="Hours" number={hours} />
				<CountDown unit="Minutes" number={minutes} />
				<CountDown unit="Seconds" number={seconds} />
			</div>
			<button className="mt-4 bg-main w-full py-2 px-3 text-white text-[14px] rounded hover:bg-gray-500">
				Buy Now
			</button>
		</div>
	);
}

export default memo(DailySale);
