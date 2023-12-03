import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/products";
import Product from "../Products";

function BestSeller() {
	const [bestSeller, setBestSeller] = useState(null);
	const [newProduct, setNewProduct] = useState(null);
	const [active, setActive] = useState(0);

	const fetchProducts = async () => {
		const response = await Promise.all([
			apiGetProducts({ sort: "-sold" }),
			apiGetProducts({ sort: "-createdAt" }),
		]);
		if (response[0]?.success) setBestSeller(response[0]?.products);
		if (response[1]?.success) setNewProduct(response[1]?.products);
	};
	useEffect(() => {
		fetchProducts();
	}, []);

	const section = [
		{
			id: 0,
			title: "BEST SELLER",
			data: bestSeller,
		},
		{
			id: 1,
			title: "NEW ARRIVALS",
			data: newProduct,
		},
	];
	const handleShowSlider = (id) => {
		const rs = section.find((el) => el.id === id);
		return rs?.data?.map((item) => (
			<SwiperSlide key={item._id}>
				<Product data={item} active={active} />
			</SwiperSlide>
		));
	};

	return (
		<div>
			<ul className="m-0 pb-2 flex gap-6 border-b-2 border-main">
				{section.map((el, i) => {
					return (
						<li
							key={el.id}
							onClick={() => setActive(el.id)}
							className={`text-[20px] pr-5 leading-none font-semibold text-black hover:text-main cursor-pointer 
							${active === el.id ? "text-main" : "text-gray-800"}

							${i === section.length - 1 ? "" : "border-r"}`}
						>
							{el.title}
						</li>
					);
				})}
			</ul>
			<div className="mt-4">
				<Swiper
					modules={[Navigation, Pagination, Autoplay]}
					slidesPerView={3}
					spaceBetween={20}
					centeredSlides={true}
					loop={true}
					autoplay={{
						delay: 1500,
						disableOnInteraction: false,
					}}
					pagination={{
						dynamicBullets: true,
					}}
					speed={600}
					navigation={true}
					className="mySwiper"
				>
					{handleShowSlider(active)}
				</Swiper>
			</div>
		</div>
	);
}

export default BestSeller;
