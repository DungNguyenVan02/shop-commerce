import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { apiGetProducts } from '~/apis/products';
import { Product } from '~/components/Product';
import routes from '~/config/routes';
import { appSelector } from '~/redux/selector';

const BrandProduct = ({ category }) => {
	const { categories } = useSelector(appSelector);
	const [products, setProducts] = useState([]);
	const [brandShow, setBrandShow] = useState(null);
	const [navMenu, setNavMenu] = useState([]);

	const fetchProducts = async () => {
		let q = { category: category };
		if (brandShow) {
			q = {
				brand_category: `${brandShow},${category}`,
			};
		}
		const response = await apiGetProducts(q);

		if (response?.success) {
			setProducts(response.products);
		}
	};

	useEffect(() => {
		fetchProducts();
		if (categories) {
			setNavMenu(categories[0]?.brand);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [brandShow, categories]);

	return (
		<div className='max-w-main w-full mx-auto'>
			<div className='flex justify-between underline-heading border-b-2 border-main'>
				<h3 className='text-[28px] mb-4 text-gradient uppercase font-semibold'>
					{brandShow || category}
				</h3>
				<div className='flex items-center gap-3'>
					<ul className='flex items-center gap-2'>
						<li
							className={`py-1 px-3 border cursor-pointer hover:bg-none hover:text-blue-500 rounded-lg bg-gradient-custom-2 ${
								brandShow === null ? 'border-main' : ''
							}`}
							onClick={() => setBrandShow(null)}
						>
							{category}
						</li>
						{navMenu?.map((item, i) => {
							return (
								<li
									key={i}
									className={`py-1 px-3 border cursor-pointer hover:bg-none hover:text-blue-500 rounded-lg bg-gradient-custom-2 ${
										brandShow === item ? 'border-main' : ''
									}`}
									onClick={() => setBrandShow(item)}
								>
									{item}
								</li>
							);
						})}
					</ul>

					<Link
						to={`${routes.products}`}
						className='hover:underline hover:text-blue-500'
					>
						Tất cả
					</Link>
				</div>
			</div>
			<div>
				<div className='mt-5 grid wide'>
					<div className='row'>
						{products.map((item) => {
							return (
								<div
									key={item._id}
									className='col g-l-2-4 mt-3 transitionAll hover:translate-y-[-3px]'
								>
									<Product data={item} />
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(BrandProduct);
