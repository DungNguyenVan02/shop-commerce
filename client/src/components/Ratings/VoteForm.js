import { useEffect, useRef, useState } from "react";
import images from "../../assets/images";
import icons from "../../utils/icons";
import { useDispatch } from "react-redux";
import { voteOptions } from "../../utils/contains";

function VoteForm({ name }) {
	const dispatch = useDispatch();
	const { IoCloseOutline, IoStar } = icons;
	const [starHover, setStarHover] = useState(5);
	const formModalRef = useRef();

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
			className="bg-white shadow-lg w-[700px] px-[40px] py-[20px] rounded-xl flex flex-col gap-4"
			onClick={(e) => e.preventDefault()}
		>
			<div className=" flex justify-between items-center">
				<h3 className="font-semibold text-[20px]">
					Reviews & comments
				</h3>
				<i className="p-1 hover:opacity-75 cursor-pointer">
					<IoCloseOutline size={24} />
				</i>
			</div>
			<div className="flex gap-4 items-center">
				<img
					className="w-[120px] h-[120px] object-cover rounded-full"
					src={images.reviewProduct}
					alt={name}
				/>
				<h3 className="text-[16px] font-medium opacity-80">
					{name} - Only available at digital world
				</h3>
			</div>
			<div>
				<h3 className="font-semibold text-[18px] mb-3">
					General assessment
				</h3>
				<div className="flex justify-around border-b pb-4">
					{voteOptions?.map((el) => (
						<div
							key={el.id}
							className="cursor-pointer"
							onMouseEnter={() => setStarHover(el.id)}
							onMouseLeave={() => setStarHover(5)}
						>
							{el.id <= starHover ? (
								<IoStar
									size={20}
									color="orange"
									className="mx-auto"
								/>
							) : (
								<IoStar
									size={20}
									color="gray"
									className="mx-auto"
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
				className="border rounded-md p-2"
			/>
		</div>
	);
}

export default VoteForm;
