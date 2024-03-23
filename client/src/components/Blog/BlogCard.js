import React, { memo } from "react";
import withBaseComponent from "../hocs/withBaseComponent";
import moment from "moment";
import DOMPurify from "dompurify";
import routes from "~/config/routes";

const BlogCard = ({ data, navigate }) => {
	return (
		<div
			onClick={() => navigate(`${routes.blogs}/detail/${data?._id}`)}
			className=" cursor-pointer hover:scale-[1.05] transitionAll relative px-4 py-2 mt-5 w-full border border-blue-500 rounded-tr-3xl rounded-bl-3xl overflow-hidden"
		>
			<div className="overflow-hidden">
				<img
					className="w-full object-cover "
					src={data?.image}
					alt=""
				/>
			</div>
			<div className="mt-3">
				<div
					className="text-[14px] line-clamp-[5]"
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(data?.description),
					}}
				></div>
				<p className="opacity-60">Tác giả: {data?.author}</p>
				<div className="flex justify-between items-center text-[14px] opacity-60">
					<span>{data?.views} lượt xem</span>
					<span>{moment(data?.createdAt).format("DD/MM/YYYY")}</span>
				</div>
			</div>
		</div>
	);
};

export default withBaseComponent(memo(BlogCard));
