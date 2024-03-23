import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Product } from "~/components/Product";
import { apiGetProducts } from "~/apis/products";
import Pagination from "~/components/Pagination";
import FilterProduct from "~/components/FilterProduct";
function Products() {
	const [products, setProducts] = useState([]);
	const [searchParams] = useSearchParams();
	const { slug, brand } = useParams();

	const fetchProducts = async (queries) => {
		let q = queries;
		if (slug === "tablet" && !brand) {
			q = {
				category:
					slug?.slice(0, 1)?.toLocaleUpperCase() + slug?.slice(1),
			};
		} else {
			q = {
				brand,
			};
		}
		const response = await apiGetProducts(q);
		if (response?.success) setProducts(response);
	};

	useEffect(() => {
		const queries = Object.fromEntries([...searchParams]);
		fetchProducts(queries);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<div className="px-[14px] bg-gray-100">
			<div className="max-w-main w-full mx-auto my-7">
				<div className="grid wide">
					<div className="row">
						<div className="col g-l-3">
							<FilterProduct />
						</div>
						<div className="col g-l-9">
							<div className=" p-2">
								<div className="grid wide">
									<div className="row">
										{products?.products?.map((product) => (
											<div
												key={product?._id}
												className="col g-l-3 g-m-3 g-c-6 mb-3 hover:translate-y-[-1px] transition-all"
											>
												<div className="w-full">
													<Product
														data={product}
														pid={product?._id}
														productPage
													/>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Pagination totalCount={products?.counts} />
			</div>
		</div>
	);
}

export default Products;
