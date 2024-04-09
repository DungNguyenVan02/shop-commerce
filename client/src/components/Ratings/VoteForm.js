import { memo, useEffect, useRef, useState } from "react";
import images from "~/assets/images";
import icons from "~/utils/icons";
import { useDispatch } from "react-redux";
import { voteOptions } from "~/utils/contains";
import { Button } from "~/components/common";
import { showModal } from "~/redux/appSlice";

function VoteForm({ name, onRating }) {
	const dispatch = useDispatch();
	const { FaStar, IoCloseOutline } = icons;
	const [starHover, setStarHover] = useState(5);
	const [starVote, setStarVote] = useState(null);
	const [comment, setComment] = useState("");
	const [heightScroll, setHeightScroll] = useState(window.scrollY);

	const containerRef = useRef();

	const getScroll = () => {
		window.addEventListener("scroll", () => {
			setHeightScroll(window.scrollY);
		});
	};

	useEffect(() => {
		getScroll();
	}, []);

	useEffect(() => {
		containerRef.current.style.marginTop = heightScroll + 220 + "px";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="w-full flex justify-center">
			<div
				ref={containerRef}
				className="relative bg-white shadow-lg w-[600px] min-h-[300px] px-[20px] py-[10px] rounded-xl flex flex-col gap-4 animate-slideTopForm"
				onClick={(e) => e.stopPropagation()}
			>
				<div className=" flex justify-between items-center">
					<h3 className="font-semibold text-[20px]">
						Nhận xét & đánh giá
					</h3>
					<i
						className="p-1 hover:opacity-75 cursor-pointer"
						onClick={() =>
							dispatch(showModal({ isShowModal: false }))
						}
					>
						<IoCloseOutline size={24} />
					</i>
				</div>
				<div className="flex gap-4 items-center">
					<div className="shadow-2xl w-[120px] h-[120px] rounded-full overflow-hidden">
						<img
							loading="lazy"
							className="w-full h-full object-cover "
							src={images.reviewProduct}
							alt={name}
						/>
					</div>
					<h3 className="text-[16px] font-medium opacity-80">
						{name} - tại LEO phone
					</h3>
				</div>
				<div>
					<h3 className="font-semibold text-[18px] mb-3">
						Đánh giá chung
					</h3>
					<div className="flex border-b pb-4 gap-4">
						{voteOptions?.map((el) => (
							<div
								key={el.id}
								className="cursor-pointer w-1/5 h-[70px] rounded-md flex justify-center items-center flex-col bg-gray-300 gap-1"
								onMouseEnter={() => setStarHover(el.id)}
								onMouseLeave={() => setStarHover(5)}
								onClick={() => {
									if (el.id === starVote) {
										setStarVote(null);
									} else {
										setStarVote(el.id);
									}
								}}
							>
								{starVote ? (
									<FaStar
										size={20}
										color={
											el.id <= starVote
												? "orange"
												: "gray"
										}
									/>
								) : (
									<FaStar
										size={20}
										color={
											el.id <= starHover
												? "orange"
												: "gray"
										}
										onClick={() => setStarVote(el.id)}
									/>
								)}

								<span className="text-[13px] font-medium text-gray-700">
									{el.vote}
								</span>
							</div>
						))}
					</div>
				</div>
				<textarea
					placeholder="Viết đánh giá của bạn về sản phẩm này"
					className="border rounded-md p-2 placeholder:text-sm placeholder:text-gray-400 outline-none"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				<Button
					title="Gửi"
					styleCustom=" px-4 py-2 text-white bg-red-500 text-[14px] rounded-md w-full hover:opacity-90"
					handleClick={() => {
						dispatch(showModal({ isShowModal: false }));
						onRating({ starVote, comment });
					}}
				/>
			</div>
		</div>
	);
}

export default memo(VoteForm);
