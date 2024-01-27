import { renderStar } from "../../utils/helper";
import images from "../../assets/images";
import icons from "~/utils/icons";
function Comment({ data }) {
	const { GoClock, BiUser } = icons;

	return (
		<div className=" gap-3 bg-gray-200 shadow-lg px-[20px] py-[16px] rounded-sm">
			<div className="flex gap-3">
				<img
					className="w-[40px] h-[40px] object-cover rounded-full"
					src={data?.image || images.avatarDefault}
					alt="user"
				/>
				<div className="flex justify-between w-full">
					<div>
						<h3 className="text-[18px] font-semibold text-gray-900">
							{`${data?.postedBy?.firstName} ${data?.postedBy?.lastName}`}
						</h3>

						<div className="flex items-center gap-2">
							<span className="font-semibold text-[14px] text-gray-800">
								Reviews:
							</span>
							<span className="flex">
								{renderStar(data?.star)?.map((el, i) => (
									<i key={i}>{el}</i>
								))}
							</span>
						</div>
					</div>
					<div className="flex items-center">
						<i className="mr-1">
							<GoClock />
						</i>
						<div className="flex gap-2">
							<span className="">{data?.date}</span>
							<span className="w-[30px]">{data?.time}</span>
						</div>
					</div>
				</div>
			</div>
			<div className="flex gap-2">
				<span className="font-semibold text-[14px] text-gray-800 ml-[52px]">
					Comment:
				</span>
				<span className="text-gray-700">{data?.comment}</span>
			</div>
		</div>
	);
}

export default Comment;
