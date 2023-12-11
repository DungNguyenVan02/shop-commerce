import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Product from "../Products";
import { memo } from "react";

function Slider({ products, active, show }) {
	const handleShowSlider = () => {
		return products?.map((item) => (
			<SwiperSlide key={item._id}>
				<Product data={item} pid={item._id} active={active} />
			</SwiperSlide>
		));
	};
	return (
		<div>
			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				slidesPerView={show || 3}
				spaceBetween={20}
				centeredSlides={true}
				loop={true}
				autoplay={{
					delay: 3500,
					disableOnInteraction: false,
				}}
				pagination={{
					dynamicBullets: true,
				}}
				speed={600}
				navigation={true}
				breakpoints={{
					0: {
						slidesPerView: 1,
						allowTouchMove: true,
						navigation: false,
						autoplay: {
							delay: 4000,
							disableOnInteraction: false,
						},
					},
					500: {
						slidesPerView: 2,
						allowTouchMove: true,
					},

					1040: {
						slidesPerView: 3,
						allowTouchMove: true,
					},
				}}
				className="mySwiper"
			>
				{handleShowSlider()}
			</Swiper>
		</div>
	);
}

export default memo(Slider);
