import { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/products";
import CardProduct from "./CardProduct";

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
		<div>
			<h3 className="text-[20px] text-[#151515] uppercase font-bold border-b-2 border-main pb-[15px]">
				Featured Product
			</h3>
			<div className="flex flex-wrap w-full">
				{products?.map((item) => {
					return <CardProduct key={item._id} data={item} />;
				})}
			</div>
		</div>
	);
}

export default FeaturedProduct;
