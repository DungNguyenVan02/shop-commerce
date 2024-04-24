import { memo, useEffect, useState } from "react";
import { apiGetProducts } from "~/apis/products";
import CardProduct from "./CardProduct";

function FeaturedProduct() {
	const [products, setProducts] = useState(null);

	const fetchFeaturedProducts = async () => {
		const response = await apiGetProducts({
			limit: 9,
			sort: "-totalRatings",
		});
		if (response?.success) {
			setProducts(response.products);
		}
	};
	useEffect(() => {
		fetchFeaturedProducts();
	}, []);

	return (
		<div className="shadow-custom_1 border p-4 rounded-lg">
			<h3 className="text-[28px] mb-4 text-gradient uppercase font-semibold border-b-2 border-main">
				Sản phẩm nổi bật
			</h3>
			<div className="grid wide">
				<div className="row">
					{products?.map((item) => {
						return <CardProduct key={item?._id} data={item} />;
					})}
				</div>
			</div>
		</div>
	);
}

export default memo(FeaturedProduct);
