import icons from '~/utils/icons';
import images from '~/assets/images';
import { SelectOptions } from '~/components/common';
import { formatMoney, renderStar } from '~/utils/helper';
import { memo } from 'react';
import withBaseComponent from '../hocs/withBaseComponent';
import { useSelector } from 'react-redux';
import { userSelector } from '~/redux/selector';
import Swal from 'sweetalert2';
import routes from '~/config/routes';
import { apiAddAccessoryCart, apiAddCart, apiUpdateWishlist } from '~/apis';
import { getCurrentUser } from '~/redux/asyncActions';
import { toast } from 'react-toastify';
import { Link, createSearchParams } from 'react-router-dom';

function Product({ data, active, navigate, location, dispatch, border }) {
	const { FaHeart, CiHeart, FaCartPlus } = icons;

	const { currentUser } = useSelector(userSelector);

	const handleClickOptions = async (e, click) => {
		e.stopPropagation();
		switch (click) {
			case 'heart':
				if (!currentUser) {
					Swal.fire({
						title: 'Hệ thống thông báo!',
						text: 'Bạn cần đăng nhập vào hệ thống trước khi thêm sản phẩm vào giỏ hàng',
						icon: 'warning',
						showCancelButton: true,
						confirmButtonText: 'Đăng nhập',
						cancelButtonText: 'Thoát',
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
					const response = await apiUpdateWishlist(data._id);
					if (response?.success) {
						toast.success(response.mes);
						dispatch(getCurrentUser());
					} else {
						toast.error(response.mes);
					}
				}
				break;
			case 'addCart':
				if (!currentUser) {
					Swal.fire({
						title: 'Hệ thống thông báo!',
						text: 'Bạn cần đăng nhập vào hệ thống trước khi thêm sản phẩm vào giỏ hàng',
						icon: 'warning',
						showCancelButton: true,
						confirmButtonText: 'Đăng nhập',
						cancelButtonText: 'Thoát',
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
					if (data?.ram && data?.internalMemory) {
						const response = await apiAddCart({
							pid: data._id,
							sku: data._id,
							color: data?.color || 'Unknown',
							price: data?.price,
							quantity: 1,
							thumbnail: data.thumb,
							ram: data?.ram,
							internalMemory: data?.internalMemory,
						});
						if (response?.success) {
							toast.success('Sản phẩm đã được thêm vào giỏ hàng');
							dispatch(getCurrentUser());
						} else {
							toast.error(response.mes);
						}
					} else {
						const response = await apiAddAccessoryCart({
							pid: data._id,
							sku: data._id,
							color: data?.color || 'Unknown',
							price: data?.price,
							quantity: 1,
							thumbnail: data.thumb,
						});
						if (response?.success) {
							toast.success('Sản phẩm đã được thêm vào giỏ hàng');
							dispatch(getCurrentUser());
						} else {
							toast.error(response.mes);
						}
					}
				}
				break;

			default:
				console.log('Invalid click action');
		}
	};

	return (
		<div
			className={`relative p-3 w-full rounded-lg cursor-pointer ${
				border ? 'border' : 'shadow-custom'
			} bg-white`}
		>
			{data?.discount > 0 && (
				<span className='tagDiscount'>{data?.discount} %</span>
			)}
			<div className='w-full h-full product-parent'>
				<div className='product-child  animate-slideTop'>
					<span
						title='Add your cart'
						onClick={(e) => {
							e.stopPropagation();
							handleClickOptions(e, 'addCart');
						}}
					>
						<SelectOptions icon={<FaCartPlus />} />
					</span>
				</div>
				<Link
					to={`/${routes.detailProduct}/${data?.category}/${data?._id}/${data?.name}`}
				>
					<img
						loading='lazy'
						className='max-w-[230px] w-full object-cover mx-auto'
						src={data?.thumb || images.noProductImage}
						alt=''
					/>
				</Link>
				{active === 0 ? (
					<span className='tagTrending'>Trending</span>
				) : active === 1 ? (
					<span className='tagNew'>New</span>
				) : (
					''
				)}
			</div>
			<div className='py-2'>
				<div>
					<h3 className='line-clamp-1 text-[16px] font-semibold'>
						{data?.name}
					</h3>
					<p className='opacity-80 font-light text-[12px]'>{data?.brand}</p>
				</div>

				<div className='text-[13px] h-[34px] flex items-center flex-wrap'>
					<span className='text-[14px] text-main font-bold '>
						{formatMoney(data?.price * ((100 - data?.discount) / 100))}
					</span>
					{data?.discount > 0 && (
						<span className=' ml-1 line-through text-[14px] opacity-60 font-bold'>
							{formatMoney(data?.price)}
						</span>
					)}
				</div>

				<div className='flex justify-between items-center'>
					<div className='flex items-center gap-1'>
						{renderStar(data?.totalRatings)?.map((item, i) => (
							<i key={i}>{item}</i>
						))}
					</div>
					<span
						title='Add wishlist'
						onClick={(e) => {
							e.stopPropagation();
							handleClickOptions(e, 'heart');
						}}
					>
						<SelectOptions
							customStyle='inline-block  hover:text-main  cursor-pointer'
							icon={
								currentUser?.wishlist?.find((item) => item._id === data._id) ? (
									<FaHeart size={24} color='red' />
								) : (
									<CiHeart size={22} color='red' />
								)
							}
						/>
					</span>
				</div>
			</div>
		</div>
	);
}

export default withBaseComponent(memo(Product));
