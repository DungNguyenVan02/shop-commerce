import React, { memo } from "react";
import withBaseComponent from "../hocs/withBaseComponent";
import moment from "moment";
import DOMPurify from "dompurify";
import routes from "~/config/routes";
import { Link } from "react-router-dom";

const BlogCard = ({ data, navigate }) => {
	return (
		<article className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
			<img
				loading="lazy"
				alt=""
				src={data?.image}
				className=" w-full object-cover"
			/>

			<div className="px-4 py-2">
				<span className="text-[12px] opacity-60">
					{moment(data?.createdAt).format("MM/DD/YYYY")}
				</span>
				<Link to={`${routes.blogs}/detail/${data?._id}`}>
					<h3 className="text-lg font-medium text-gray-900 line-clamp-2 hover:underline">
						{data?.title}
					</h3>
				</Link>

				<p
					className="text-[14px] line-clamp-[5]"
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(data?.description),
					}}
				></p>

				<Link
					to={`${routes.blogs}/detail/${data?._id}`}
					className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600"
				>
					Xem thêm
					<span
						aria-hidden="true"
						className="block transition-all group-hover:ms-0.5 rtl:rotate-180"
					>
						&rarr;
					</span>
				</Link>
			</div>
		</article>
	);
};

export default withBaseComponent(memo(BlogCard));
