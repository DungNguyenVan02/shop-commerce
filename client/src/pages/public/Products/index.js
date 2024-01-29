import { useEffect, useState } from "react";
import { BreadcrumbHeader } from "~/components/SectionLayout";
import { useParams, useSearchParams } from "react-router-dom";
import { Product } from "~/components/Product";
import { apiGetProducts } from "~/apis/products";
import { createSlug } from "~/utils/helper";
import { FilterProduct } from "~/components/Filter";
import Pagination from "~/components/Pagination";
function Products() {
	const { category } = useParams();
	const [products, setProducts] = useState([]);
	const [searchParams] = useSearchParams();

	const fetchProducts = async (queries) => {
		if (category !== "all-products") {
			queries.category =
				category.slice(0, 1).toUpperCase() + category.slice(1);
		}
		const response = await apiGetProducts(queries);
		if (response?.success) setProducts(response);
	};

	useEffect(() => {
		const queries = Object.fromEntries([...searchParams]);
		fetchProducts(queries);
		window.scrollTo(0, 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category, searchParams]);

	return (
		<div>
			<BreadcrumbHeader
				category={
					category.slice(0, 1).toUpperCase() + category.slice(1)
				}
				slug={createSlug(category)}
			/>
			<div className="max-w-main w-full mx-auto my-7">
				<FilterProduct />
				<div className="my-[24px]">
					<div className="grid wide">
						<div className="row">
							{products?.products?.map((product) => (
								<div
									key={product?._id}
									className="col g-l-2-4 g-m-2-4 g-c-6 mb-3 hover:translate-y-[-1px] transition-all"
								>
									<Product
										data={product}
										pid={product?._id}
										productPage
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<Pagination totalCount={products?.counts} />
			</div>
		</div>
	);
}

export default Products;
