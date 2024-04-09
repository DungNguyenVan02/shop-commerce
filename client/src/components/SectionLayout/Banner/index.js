import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";
import { slider } from "~/utils/contains";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
function Banner() {
	const [widthScreen, setWidthScreen] = useState(window.innerWidth);

	const setWidth = (e) => {
		setWidthScreen(e.target.innerWidth);
	};

	useEffect(() => {
		window.addEventListener("resize", setWidth);
		return (e) => {
			window.removeEventListener("resize", setWidth);
		};
	}, [widthScreen]);
	return (
		<div
			className={`${
				widthScreen > 640 ? "max-w-[600px]" : " max-w-[428px] "
			} `}
		>
			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				loop={true}
				autoplay={{
					delay: 3500,
					disableOnInteraction: false,
				}}
				pagination={{
					dynamicBullets: true,
				}}
				speed={600}
				allowTouchMove={false}
				scrollbar={{ draggable: false }}
				navigation={true}
				slidesPerView={1}
				className="mySwiper"
			>
				{slider.map((item) => (
					<SwiperSlide key={item.id}>
						<div className="rounded-lg overflow-hidden">
							<img
								loading="lazy"
								src={item.src}
								alt=""
								className="w-full h-full object-contain"
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
			<img
				loading="lazy"
				className="rounded-md mt-2"
				src="https://clickbuy.com.vn/uploads/media/612-lhAyF.png"
				alt=""
			/>
		</div>
	);
}

export default Banner;
