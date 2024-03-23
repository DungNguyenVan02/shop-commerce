import { Swiper } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { memo } from "react";

function Slider({ showLg, showMd, showSm, isLoop = true, children }) {
	return (
		<div>
			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				loop={true}
				autoplay={
					isLoop
						? {
								delay: 2000,
								disableOnInteraction: false,
						  }
						: false
				}
				pagination={{
					dynamicBullets: true,
				}}
				speed={600}
				allowTouchMove={false}
				scrollbar={{ draggable: false }}
				navigation={true}
				breakpoints={{
					0: {
						slidesPerView: showSm || 1,
						spaceBetween: 5,
					},
					// when window width is >= 480px
					480: {
						slidesPerView: showMd || 2,
						spaceBetween: 10,
					},
					// when window width is >= 640px
					1000: {
						slidesPerView: showLg || 4,
						spaceBetween: 15,
					},
				}}
				className="mySwiper"
			>
				{children}
			</Swiper>
		</div>
	);
}

export default memo(Slider);
