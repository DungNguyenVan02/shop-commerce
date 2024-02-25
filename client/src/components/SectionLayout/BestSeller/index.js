import { useEffect, useState } from "react";
import { apiGetProducts } from "~/apis/products";
import { Slider } from "~/components/Slider";
import { useDispatch } from "react-redux";
import { getNewProducts } from "~/redux/asyncActions";
import { useSelector } from "react-redux";
import { newProductSelector } from "~/redux/selector";

function BestSeller() {
	const dispatch = useDispatch();
	const [bestSeller, setBestSeller] = useState(null);
	const [products, setProducts] = useState(null);
	const [active, setActive] = useState(0);

	const fetchProducts = async () => {
		const response = await apiGetProducts({ sort: "-sold" });
		if (response.success) {
			setBestSeller(response.products);
			setProducts(response.products);
		}
	};

	const { newProduct } = useSelector(newProductSelector);

	useEffect(() => {
		fetchProducts();
		dispatch(getNewProducts());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (active === 0) setProducts(bestSeller);
		if (active === 1) setProducts(newProduct);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	const section = [
		{
			id: 0,
			title: "BEST SELLER",
		},
		{
			id: 1,
			title: "NEW ARRIVALS",
		},
	];

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
				<Slider
					products={products}
					active={active}
					defaultViewShow={3}
				/>
			</div>
		</div>
	);
}

export default BestSeller;
