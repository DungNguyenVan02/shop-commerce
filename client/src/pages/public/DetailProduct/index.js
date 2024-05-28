import { Link, createSearchParams, useParams } from 'react-router-dom';
import {
	apiAddAccessoryCart,
	apiAddCart,
	apiGetProduct,
	apiGetProducts,
	apiRatings,
} from '~/apis';
import { useCallback, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

import icons from '~/utils/icons';
import { createSlug, formatMoney, renderStar } from '~/utils/helper';
import { extraInfo } from '~/utils/contains';
import images from '~/assets/images';
import { SelectQuantity, ExtraInfo, Button } from '~/components/common';
import {
	ProInforMation,
	Product,
	VariantsColor,
	VariantsVersion,
} from '~/components/Product';
import { SliderSubProduct } from '~/components/Slider';
import { BreadcrumbHeader } from '~/components/SectionLayout';
import Ratings from '~/components/Ratings';
import VoteForm from '~/components/Ratings/VoteForm';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { appSelector, userSelector } from '~/redux/selector';
import Swal from 'sweetalert2';
import routes from '~/config/routes';
import withBaseComponent from '~/components/hocs/withBaseComponent';
import { getCurrentUser } from '~/redux/asyncActions';
import { checkouts } from '~/redux/userSlice';
import { showModal } from '~/redux/appSlice';

function DetailProduct({ navigate, dispatch, location }) {
	const { currentUser } = useSelector(userSelector);
	const { pid, category, name } = useParams();
	const { isShowModal } = useSelector(appSelector);
	const { GoDotFill, FaCartPlus } = icons;

	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [relateProduct, setRelateProduct] = useState([]);
	const [thumbSrc, setThumbSrc] = useState('');
	const [updateRating, setUpdateRating] = useState(false);

	const [versionProduct, setVersionProduct] = useState([]);
	const [colorActive, setColorActive] = useState('');
	const [variantsSelected, setVariantsSelected] = useState({});

	useEffect(() => {
		const variants = [];
		if (product?.color === colorActive) {
			variants.push({
				sku: product._id,
				ram: product.ram,
				internalMemory: product.internalMemory,
				price: product.price,
				quantity: product.quantity,
				sold: product.sold,
				thumbnail: product.thumb,
			});
		}

		const filterProductByColor = product?.variants?.filter(
			(item) => item.color === colorActive
		);

		if (filterProductByColor) {
			filterProductByColor?.map((item) =>
				variants.push({
					sku: item.sku,
					ram: item.ram,
					internalMemory: item.internalMemory,
					price: item.price,
					quantity: item.quantity,
					sold: item.sold,
					thumbnail: item.thumbnail,
				})
			);
		}

		setVersionProduct(variants);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [colorActive, product]);

	useEffect(() => {
		if (versionProduct.length > 0) {
			setVariantsSelected({
				sku: versionProduct[0].sku,
				ram: versionProduct[0]?.ram,
				color: colorActive,
				internalMemory: versionProduct[0]?.internalMemory,
				price: versionProduct[0]?.price,
				quantity: versionProduct[0]?.quantity,
				sold: versionProduct[0]?.sold,
				thumbnail: versionProduct[0]?.thumb || versionProduct[0]?.thumbnail,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [versionProduct]);

	useEffect(() => {
		setQuantity(1);
	}, [variantsSelected]);

	const fetchProductData = async () => {
		const response = await apiGetProduct(pid);
		if (response?.success) {
			setColorActive(response?.getProduct?.color);
			setProduct(response?.getProduct);
			setThumbSrc(response?.getProduct?.thumb);
		}
	};

	const handleChangeThumb = (src) => {
		setThumbSrc(src);
	};

	const fetchRelateProductData = async () => {
		const response = await apiGetProducts({
			category: product?.category,
			brand: product?.brand,
		});
		if (response?.success) {
			setRelateProduct(response?.products);
		}
	};

	useEffect(() => {
		if (pid) {
			fetchProductData();
			fetchRelateProductData();
		}
		window.scrollTo(0, 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pid, name]);

	useEffect(() => {
		if (pid) {
			fetchProductData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updateRating]);

	// Enter quantity
	const handleQuantity = useCallback(
		(number) => {
			if (+number > variantsSelected?.quantity) {
				setQuantity(variantsSelected?.quantity);
			} else {
				setQuantity(+number);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[quantity, variantsSelected?.quantity]
	);

	// Handle up or down quantity
	const handleChangeQuantity = useCallback(
		(number) => {
			if (number < 1) {
				setQuantity(1);
			} else if (number > variantsSelected?.quantity) {
				setQuantity(variantsSelected?.quantity);
			} else {
				setQuantity(number);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[quantity, variantsSelected?.quantity]
	);

	const handleRating = useCallback(
		async (dataRating) => {
			const date = new Date();
			if (!product?._id || !dataRating.comment) {
				toast.warning('Có lỗi xảy ra, vui lòng thử lại sau', {
					position: 'top-center',
					theme: 'colored',
				});
				return;
			}
			const payload = {
				pid: product?._id,
				star: dataRating.starVote || 5,
				comment: dataRating.comment,
				date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
				time: `${date.getHours()}:${date.getMinutes()}`,
			};
			const response = await apiRatings(payload);
			if (response?.success) {
				setUpdateRating(!updateRating);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isShowModal]
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleAddCart = useCallback(async () => {
		if (!currentUser) {
			Swal.fire({
				title: 'Hệ thống thông báo!',
				text: 'Bạn cần đăng nhập vào hệ thống trước khi tiếp tục',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Đến trang đăng nhập',
				cancelButtonText: 'Hủy bỏ',
				reverseButtons: true,
			}).then((result) => {
				if (result.isConfirmed) {
					navigate({
						pathname: routes.login,
						search: createSearchParams({
							redirect: location.pathname,
						}).toString(),
					});
				}
			});
		} else {
			if (variantsSelected?.ram && variantsSelected.internalMemory) {
				const payload = {
					pid: pid,
					sku: variantsSelected?.sku,
					thumbnail: variantsSelected?.thumbnail,
					color: colorActive || 'Unknown',
					quantity,
					price: variantsSelected?.price,
					ram: variantsSelected?.ram,
					internalMemory: variantsSelected?.internalMemory,
				};
				const response = await apiAddCart(payload);
				if (response?.success) {
					toast.success('Sản phẩm đã được thêm vào giỏ hàng');
					dispatch(getCurrentUser());
				} else {
					toast.error(response.mes);
				}
			} else {
				const payload = {
					pid: pid,
					sku: variantsSelected?.sku,
					thumbnail: variantsSelected?.thumbnail,
					color: colorActive || 'Unknown',
					quantity,
					price: variantsSelected?.price,
				};
				const response = await apiAddAccessoryCart(payload);
				if (response?.success) {
					toast.success('Sản phẩm đã được thêm vào giỏ hàng');
					dispatch(getCurrentUser());
				} else {
					toast.error(response.mes);
				}
			}
		}
	});

	const handleBuyNow = () => {
		if (!currentUser) {
			Swal.fire({
				title: 'Hệ thống thông báo!',
				text: 'Bạn cần đăng nhập vào hệ thống trước khi tiếp tục',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Đến trang đăng nhập',
				cancelButtonText: 'Hủy bỏ',
				reverseButtons: true,
			}).then((result) => {
				if (result.isConfirmed) {
					navigate({
						pathname: routes.login,
						search: createSearchParams({
							redirect: location.pathname,
						}).toString(),
					});
				}
			});
		} else if (!currentUser.address || !currentUser.phone) {
			Swal.fire({
				title: 'Hệ thống thông báo',
				text: 'Vui lòng cập nhật đầy đủ thông tin trước khi thanh toán',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Cập nhật thông tin',
				cancelButtonText: 'Hủy bỏ',
			}).then((result) => {
				if (result.isConfirmed) {
					navigate(routes.member_personal);
				}
			});
		} else {
			dispatch(
				checkouts([
					{
						product: product,
						color: variantsSelected.color,
						internalMemory: variantsSelected.internalMemory,
						ram: variantsSelected.ram,
						price: variantsSelected.price,
						sku: variantsSelected.sku,
						thumbnail: variantsSelected.thumbnail,
						quantity: quantity,
					},
				])
			);
			navigate(routes.checkout);
		}
	};

	const flatColor = (arr) => {
		const rs = [];
		arr?.forEach((item) => {
			if (!rs.includes(item)) {
				rs.push(item);
			}
		});

		return rs;
	};

	return (
		<div className='w-full'>
			{isShowModal && (
				<div
					onClick={() => dispatch(showModal({ isShowModal: false }))}
					className='absolute top-0 left-0 bottom-0 right-0  z-[99999999]  bg-[rgba(10,10,10,0.5)]'
				>
					<VoteForm name={product?.name} onRating={handleRating} />
				</div>
			)}
			<BreadcrumbHeader
				category={category}
				slug={createSlug(category)}
				name={name}
			/>
			<div className='max-w-main w-full mx-auto my-[20px]'>
				<div className='grid wide'>
					<div className='row'>
						<div className='col g-l-5 g-m-5 g-c-12'>
							<div className='w-[458px] h-[458px] object-contain border'>
								<img
									loading='lazy'
									className='w-full h-full object-contain'
									src={thumbSrc || images?.defaultProduct}
									alt={product?.name}
								/>
							</div>
							<SliderSubProduct
								dataSrc={product?.images}
								handleClick={handleChangeThumb}
							/>
						</div>
						<div className='col g-l-4 g-m-4 g-c-12 text-[#505050] text-[14px] '>
							<div className='flex justify-between items-center bg-[#f2f2f2] h-[65px] px-5 rounded-lg'>
								<div>
									<h3 className='text-[30px] text-main font-semibold'>
										{formatMoney(
											variantsSelected?.price *
												((100 - product?.discount) / 100)
										)}
									</h3>
									{product?.discount > 0 && (
										<h3 className='text-[18px] text-[#333333] font-semibold opacity-70 line-through'>
											{formatMoney(variantsSelected?.price)}
										</h3>
									)}
								</div>
								{product?.discount > 0 && (
									<span className='px-4 py-2 rounded-md shadow-custom_1 bg-[#f8b500] text-white'>
										-{product?.discount}%
									</span>
								)}
							</div>
							<div className='flex items-center gap-5 my-5 mt-[10px]'>
								<span className='flex gap-1'>
									{renderStar(product?.totalRatings)?.map((star, i) => (
										<i key={i}>{star}</i>
									))}
								</span>
								<span className='w-[1px] h-full bg-red-300 text-transparent'>
									|
								</span>
								<span>{product?.ratings?.length} Đánh giá</span>
								<span className='w-[1px] h-full bg-red-300 text-transparent'>
									|
								</span>
								<span>{variantsSelected?.sold} Lượt bán</span>
							</div>
							<ul className='flex flex-col gap-[5px]'>
								{Array.isArray(product?.description) ? (
									product?.description?.map((item) => (
										<li key={item} className='flex items-center gap-2'>
											<GoDotFill />
											{item}
										</li>
									))
								) : (
									<div
										className='line-clamp-[15]'
										dangerouslySetInnerHTML={{
											__html: DOMPurify.sanitize(product?.description),
										}}
									></div>
								)}
							</ul>
							<div className='my-3'>
								<h3 className='text-[16px] font-semibold text-gray-800'>
									Phiên bản khác:
								</h3>
								<div className='grid wide'>
									<div className='row'>
										{versionProduct.length > 0 &&
											versionProduct?.map((item, i) => (
												<div key={i} className='col g-l-4'>
													<VariantsVersion
														key={item._id}
														data={item}
														onChangeVersion={setVariantsSelected}
														active={variantsSelected}
														color={colorActive}
													/>
												</div>
											))}
									</div>
								</div>
							</div>
							<div className='my-3'>
								{
									<h3 className='text-[16px] font-semibold text-gray-800'>
										Màu sắc:
									</h3>
								}
								<div className='grid wide'>
									<div className='row'>
										{(product?.variants?.length > 0
											? flatColor([
													...product?.variants?.map((el) => el.color),
													product?.color,
											  ])
											: [product?.color]
										).map((item, i) => (
											<div key={i} className='col g-l-4'>
												<VariantsColor
													color={item}
													thumb={
														product?.variants?.find((el) => el.color === item)
															?.thumbnail || product?.thumb
													}
													active={colorActive}
													onChangeActive={setColorActive}
												/>
											</div>
										))}
									</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<span>Số lượng</span>
								<SelectQuantity
									quantity={quantity}
									handleQuantity={handleQuantity}
									handleChangeQuantity={handleChangeQuantity}
								/>
								<span>{variantsSelected?.quantity} sản phẩm còn lại</span>
							</div>
							<div className='flex gap-4'>
								<Button
									isDisabled={variantsSelected?.quantity === 0}
									handleClick={handleAddCart}
									title='Thêm vào giỏ hàng'
									leftICon={<FaCartPlus />}
									styleCustom={`rounded-sm bg-red-300 border border-red-600 text-white  px-4 py-3 ${
										variantsSelected?.quantity === 0
											? 'opacity-70'
											: 'hover:opacity-80'
									}`}
								/>
								<Button
									isDisabled={variantsSelected?.quantity === 0}
									handleClick={handleBuyNow}
									title='Mua ngay'
									styleCustom={`rounded-sm bg-main text-white px-4 py-3 ${
										variantsSelected?.quantity === 0
											? 'opacity-70'
											: 'hover:opacity-80'
									}`}
								/>
							</div>
						</div>
						<div className='col g-l-3 g-m-3 g-c-12 flex flex-col gap-3'>
							{extraInfo.map((extra) => {
								return (
									<ExtraInfo
										key={extra.id}
										icon={extra.icon}
										title={extra.title}
										subTitle={extra.subTitle}
									/>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<div className='max-w-main w-full mx-auto my-[20px] mb-0'>
				<ProInforMation
					description={product?.description}
					blog={product?.blog}
				/>
			</div>
			<div className='max-w-main w-full mx-auto'>
				<Ratings data={product} />
			</div>
			<div className='max-w-main w-full mx-auto my-[20px]'>
				<div className='flex justify-between underline-heading border-b-2 border-main'>
					<h3 className='text-[28px] mb-4 text-gradient uppercase font-semibold'>
						Các sản phẩm tương tự
					</h3>
					<Link
						to={`${routes.products}/brand/${product?.brand}`}
						className='hover:underline hover:text-blue-500'
					>
						Tất cả
					</Link>
				</div>
				<div className='grid wide'>
					<div className='row'>
						{relateProduct?.map((pro) => {
							return (
								<div
									key={pro._id}
									className='col g-l-2-4 g-m-3 g-c-2 mt-3 hover:translate-y-[-2px] transitionAll'
								>
									<Product data={pro} />
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default withBaseComponent(DetailProduct);
