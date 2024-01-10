import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VoteBar from "./VoteBar";
import { renderStar } from "../../utils/helper";
import Swal from "sweetalert2";
import Button from "~/components/Button";
import Comment from "./Comment";
import { showModal } from "~/redux/appSlice";
import { appSelector } from "~/redux/selector";
import { userSelector } from "~/redux/selector";
import routes from "~/config/routes";

function Ratings({ data }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isLogin } = useSelector(userSelector);
	const { isShowModal } = useSelector(appSelector);

	const handleReview = useCallback(() => {
		if (isLogin) {
			dispatch(showModal({ isShowModal: true }));
		} else {
			Swal.fire({
				title: "Notification",
				cancelButtonText: "Cancel",
				confirmButtonText: "Go to login or register",
				text: "Please log in to your account to rate.",
				showCancelButton: true,
			}).then((rs) => {
				if (rs.isConfirmed) {
					navigate(routes.login);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isShowModal]);

	return (
		<div className="border p-3 rounded-md shadow-md">
			<h3 className="font-semibold mb-3">
				Reviews & comments of {data?.name}
			</h3>
			<div className="">
				<div className="grid">
					<div className="row">
						<div className="col g-l-4 g-m-6 g-c-12">
							<div className="flex justify-center flex-col items-center gap-2 h-full border-r-[2px] border-gray-300">
								<span className="text-[24px] font-semibold">
									{`${data?.totalRatings}/5`}
								</span>
								<span className="flex">
									{renderStar(data?.totalRatings)?.map(
										(el, i) => (
											<i key={i}>{el}</i>
										)
									)}
								</span>
								<span className="text-blue-500">
									{`${data?.ratings.length} reviewers`}
								</span>
							</div>
						</div>
						<div className="col g-l-8 g-m-6 g-c-12">
							<div className="flex flex-col-reverse justify-center gap-3">
								{Array.from(Array(5).keys()).map((el) => (
									<VoteBar
										key={el}
										number={el + 1}
										ratingCount={data?.ratings.length}
										ratingTotal={
											data?.ratings.filter(
												(item) => item.star === el + 1
											)?.length
										}
									/>
								))}
							</div>
						</div>
						<div className="col g-l-12 g-m-12 g-c-12 border-b">
							<div className="flex flex-col items-center p-[20px] gap-2">
								<h3 className="text-gray-400">
									How do you rate this product?
								</h3>
								<Button
									title="Reviews"
									handleClick={handleReview}
									styleCustom="px-4 py-2 text-white bg-red-500 text-[14px] rounded-md w-[200px] hover:opacity-90 "
								/>
							</div>
						</div>
						<div className="col g-l-12 g-m-12 g-c-12">
							<div className="flex flex-col gap-3 mt-2">
								{data?.ratings.map((item) => {
									return (
										<Comment key={item._id} data={item} />
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo(Ratings);
