import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Product from "../Product";
import { memo } from "react";

function Slider({
	products,
	active,
	show,
	defaultViewShow,
	productPageDetail,
}) {
	const handleShowSlider = () => {
		return products?.map((item) => (
			<SwiperSlide key={item._id}>
				<Product
					data={item}
					active={active}
					productPageDetail={productPageDetail && productPageDetail}
				/>
			</SwiperSlide>
		));
	};
	return (
		<div>
			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				spaceBetween={15}
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
				breakpoints={{
					0: {
						slidesPerView: 1,
						allowTouchMove: true,
						navigation: false,
						autoplay: {
							delay: 3000,
							disableOnInteraction: false,
						},
					},
					600: {
						slidesPerView: 2,
						allowTouchMove: true,
					},
					1040: {
						slidesPerView: defaultViewShow || show,
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
