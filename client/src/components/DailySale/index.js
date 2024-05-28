import { useEffect, useState, memo, useRef } from 'react';
import icons from '~/utils/icons';
import { apiGetProducts } from '~/apis/products';
import { renderStar, formatMoney } from '~/utils/helper';
import images from '~/assets/images';
import CountDown from './CountDown';
import moment from 'moment';
import { formatTimes } from '~/utils/helper';
import { useSelector } from 'react-redux';
import { newProductSelector, userSelector } from '~/redux/selector';
import withBaseComponent from '../hocs/withBaseComponent';
import { getDeadDaily } from '~/redux/productSlice';
import { checkouts } from '~/redux/userSlice';
import routes from '~/config/routes';
import Swal from 'sweetalert2';
import { createSearchParams } from 'react-router-dom';

function DailySale({ dispatch, navigate, location }) {
	const { currentUser } = useSelector(userSelector);

	const { FaStar } = icons;
	const idInterval = useRef();

	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);
	const [expired, setExpired] = useState(false);
	const { deadDaily } = useSelector(newProductSelector);

	const fetchDeadDaily = async () => {
		const response = await apiGetProducts({
			limit: 1,
			page: Math.floor(Math.random() * 5),
			sort: '-totalRatings',
		});
		if (response?.success) {
			dispatch(
				getDeadDaily({
					data: response.products[0],
					time: Date.now() + 24 * 60 * 60 * 1000,
				})
			);
		}
	};

	useEffect(() => {
		if (deadDaily?.time) {
			const deltaTime = deadDaily.time - Date.now();
			const times = formatTimes(deltaTime);
			setSeconds(times.s);
			setMinutes(times.m);
			setHours(times.h);
		}
	}, [deadDaily]);

	useEffect(() => {
		idInterval.current && clearInterval(idInterval.current);
		if (
			moment(moment(deadDaily?.time).format('MM/DD/YYYY')).isBefore(moment())
		) {
			fetchDeadDaily();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [expired]);

	useEffect(() => {
		idInterval.current = setInterval(() => {
			if (seconds > 0) {
				setSeconds((prev) => prev - 1);
			} else {
				if (minutes > 0) {
					setMinutes((prev) => prev - 1);
					setSeconds(59);
				} else {
					if (hours > 0) {
						setHours((prev) => prev - 1);
						setMinutes(59);
						setSeconds(59);
					} else {
						setExpired(!expired);
					}
				}
			}
		}, 1000);

		return () => clearInterval(idInterval.current);
	}, [seconds, minutes, hours, expired]);

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
						product: deadDaily?.data,
						color: deadDaily?.data.color,
						internalMemory: deadDaily?.data.internalMemory,
						ram: deadDaily?.data.ram,
						price: deadDaily?.data.price,
						sku: deadDaily?.data._id,
						thumbnail: deadDaily?.data.thumb,
						quantity: 1,
					},
				])
			);
			navigate(routes.checkout);
		}
	};

	return (
		<div className='border p-5 h-full shadow-custom_1 rounded-lg'>
			<div className='relative flex items-center justify-center text-[20px] font-semibold text-[#505050]'>
				<FaStar color='#d11' className='absolute left-0' />
				<h3>Sale mỗi ngày</h3>
			</div>
			<img
				loading='lazy'
				className='mx-auto mt-8 w-[120px]'
				src={deadDaily?.data?.thumb || images.defaultProduct}
				alt={deadDaily?.data?.name}
			/>
			<div className='flex flex-col items-center text-[16px]'>
				<h3 className='line-clamp-1'>{deadDaily?.data?.name}</h3>
				<div className='flex gap-1 mt-1'>
					{renderStar(deadDaily?.data?.totalRatings)?.map((star, i) => (
						<i key={i}>{star}</i>
					))}
				</div>
				<span className='my-2'>{formatMoney(deadDaily?.data?.price)}</span>
			</div>
			<div className='flex justify-center items-center gap-4'>
				<CountDown unit='Giờ' number={hours} />
				<CountDown unit='Phút' number={minutes} />
				<CountDown unit='Giây' number={seconds} />
			</div>
			<button
				onClick={handleBuyNow}
				className='mt-4 bg-main w-full py-2 px-3 text-white text-[14px] rounded hover:bg-gray-500'
			>
				Mua ngay
			</button>
		</div>
	);
}

export default withBaseComponent(memo(DailySale));
