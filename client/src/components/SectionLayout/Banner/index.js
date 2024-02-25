import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";
import { slider } from "~/utils/contains";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
function Banner() {
	return (
		<div className="max-w-[600px]">
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
					<SwiperSlide key={item._id}>
						<div className="rounded-lg overflow-hidden">
							<img
								src={item.src}
								alt=""
								className="w-full h-full object-contain"
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}

export default Banner;
