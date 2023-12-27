import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import images from "../../assets/images";
function SliderSubProduct({ dataSrc, show }) {
	return (
		<div className="flex mt-3 justify-between w-[458px]">
			<Swiper
				modules={[Navigation, Pagination]}
				spaceBetween={15}
				loop={true}
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
						slidesPerView: 3,
					},
				}}
				className="mySwiper"
			>
				{dataSrc?.map((link) => (
					<SwiperSlide key={link}>
						<img
							className=" w-[143px] h-[143px] object-contain border p-3"
							src={link || images.defaultImage}
							alt="sub-product"
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}

export default SliderSubProduct;
