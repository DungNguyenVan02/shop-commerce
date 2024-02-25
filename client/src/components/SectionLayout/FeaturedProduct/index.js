import { memo, useEffect, useState } from "react";
import { apiGetProducts } from "~/apis/products";
import CardProduct from "./CardProduct";
import images from "~/assets/images";

function FeaturedProduct() {
	const [products, setProducts] = useState(null);

	const fetchFeaturedProducts = async () => {
		const response = await apiGetProducts({
			limit: 9,
			sort: "-totalRatings",
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
						return <CardProduct key={item?._id} data={item} />;
					})}
				</div>
			</div>
			<div className="grid grid-cols-4 grid-rows-2 gap-4">
				<img
					className="w-full h-full col-span-2 row-span-2"
					src={images.banner1Home}
					alt="banner"
				/>
				<img
					className="w-full h-full col-span-1 row-span-1"
					src={images.banner2Home}
					alt="banner"
				/>
				<img
					className="w-full h-full col-span-1 row-span-2"
					src={images.banner4Home}
					alt="banner"
				/>
				<img
					className="w-full h-full col-span-1 row-span-1"
					src={images.banner3Home}
					alt="banner"
				/>
			</div>
		</>
	);
}

export default memo(FeaturedProduct);
