import DOMPurify from "dompurify";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import routes from "~/config/routes";
import icons from "~/utils/icons";

const BlogItem = ({ data }) => {
	const { IoIosArrowForward, GoClock } = icons;
	return (
		<div className="p-5 shadow-custom">
			<div className="grid wide">
				<div className="row">
					<div className="col g-l-5 g-c-5 g-m-12">
						<div className="max-w-full rounded-xl overflow-hidden">
							<img
								className="w-full object-cover "
								src={data?.image}
								alt=""
							/>
						</div>
					</div>
					<div className="col g-l-7 g-c-5 g-m-12">
						<div className="flex h-full flex-col gap-5">
							<div>
								<h3 className="text-[18px] text-[#1c1d1d] font-semibold line-clamp-2">
									{data?.title}
								</h3>
								<p className="text-[13px] text-[#999] flex items-center gap-2">
									<GoClock />
									{moment(data.createdAt).format(
										"DD/MM/YYYY"
									)}
								</p>
							</div>
							<div
								className="text-[14px] line-clamp-[10]"
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(
										data?.description
									),
								}}
							></div>
							<Link
								to={`${routes.blogs}/detail/${data?._id}`}
								className="flex items-center gap-1 text-[14px] underline cursor-pointer hover:text-main"
							>
								<span>Read more</span> <IoIosArrowForward />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogItem;
