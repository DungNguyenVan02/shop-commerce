import { memo, useEffect, useRef, useState } from "react";
import images from "~/assets/images";
import icons from "~/utils/icons";
import { useDispatch } from "react-redux";
import { voteOptions } from "~/utils/contains";
import { Button } from "~/components/common";
import { showModal } from "~/redux/appSlice";

function VoteForm({ name, onRating }) {
	const dispatch = useDispatch();
	const formModalRef = useRef();
	const { FaStar, IoCloseOutline } = icons;
	const [starHover, setStarHover] = useState(5);
	const [starVote, setStarVote] = useState(null);
	const [comment, setComment] = useState("");

	useEffect(() => {
		formModalRef.current.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center",
		});
	}, []);

	return (
		<div
			ref={formModalRef}
			className="relative bg-white shadow-lg w-[600px] px-[20px] py-[10px] rounded-xl flex flex-col gap-4"
			onClick={(e) => e.stopPropagation()}
		>
			<div className=" flex justify-between items-center">
				<h3 className="font-semibold text-[20px]">
					Reviews & comments
				</h3>
				<i
					className="p-1 hover:opacity-75 cursor-pointer"
					onClick={() => dispatch(showModal({ isShowModal: false }))}
				>
					<IoCloseOutline size={24} />
				</i>
			</div>
			<div className="flex gap-4 items-center">
				<div className="shadow-2xl w-[120px] h-[120px] rounded-full overflow-hidden">
					<img
						className="w-full h-full object-cover "
						src={images.reviewProduct}
						alt={name}
					/>
				</div>
				<h3 className="text-[16px] font-medium opacity-80">
					{name} - Only available at digital world
				</h3>
			</div>
			<div>
				<h3 className="font-semibold text-[18px] mb-3">
					General assessment
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
										el.id <= starVote ? "orange" : "gray"
									}
								/>
							) : (
								<FaStar
									size={20}
									color={
										el.id <= starHover ? "orange" : "gray"
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
				placeholder="Enter your review about product"
				className="border rounded-md p-2 placeholder:text-sm placeholder:text-gray-400 outline-none"
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			/>
			<Button
				title="Submit"
				styleCustom=" px-4 py-2 text-white bg-red-500 text-[14px] rounded-md w-full hover:opacity-90"
				handleClick={() => {
					dispatch(showModal({ isShowModal: false }));
					onRating({ starVote, comment });
				}}
			/>
		</div>
	);
}

export default memo(VoteForm);
