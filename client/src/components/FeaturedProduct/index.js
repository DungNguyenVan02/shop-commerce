import { memo, useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/products";
import CardProduct from "./CardProduct";
import images from "../../assets/images";

function FeaturedProduct() {
	const [products, setProducts] = useState(null);

	const fetchFeaturedProducts = async () => {
		const response = await apiGetProducts({
			limit: 9,
			totalRatings: 3,
		});
		if (response.success) {
			setProducts(response.products);
		}
	};
	useEffect(() => {
		fetchFeaturedProducts();
	}, []);

	return (
		<>
			<h3 className="text-[20px] mb-4 text-[#151515] uppercase font-bold border-b-2 border-main pb-[15px]">
				Featured Product
			</h3>
			<div className="grid wide">
				<div className="row">
					{products?.map((item) => {
						return <CardProduct key={item._id} data={item} />;
					})}
				</div>
			</div>
			<div className="flex justify-between">
				<img src={images.banner1Home} alt="banner" />
				<div className="flex flex-col justify-between">
					<img src={images.banner2Home} alt="banner" />
					<h3
						className="text-center
					 text-[30px] font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-textGradient"
					>
						Sale Hot
					</h3>
					<img src={images.banner3Home} alt="banner" />
				</div>
				<img src={images.banner4Home} alt="banner" />
			</div>
		</>
	);
}

export default memo(FeaturedProduct);
