import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { apiGetBlog } from "~/apis";
import routes from "~/config/routes";
import icons from "~/utils/icons";

const DetailBlog = () => {
	const { IoIosArrowForward } = icons;
	const { bid } = useParams();
	const [blog, setBlog] = useState({});

	const fetchDetailBlog = async () => {
		const response = await apiGetBlog(bid);
		if (response?.success) {
			setBlog(response?.blog);
		}
	};
	useEffect(() => {
		fetchDetailBlog();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bid]);
	return (
		<div>
			<div className="bg-[#f5f5f5]">
				<div className="max-w-main w-full mx-auto py-[20px]">
					<h3 className="text-[24px] font-semibold">{blog.title}</h3>
					<div className="flex items-center gap-1 text-[14px] font-[400] ">
						<NavLink
							to={routes.home}
							className="cursor-pointer opacity-80 hover:opacity-100"
						>
							Home
						</NavLink>
						<IoIosArrowForward />
						<NavLink to={routes.blogs} className="opacity-80">
							Blogs
						</NavLink>
					</div>
				</div>
			</div>
			<div className="max-w-main w-full mx-auto my-7">
				<div className="my-[24px] flex flex-col gap-6">
					<img
						loading="lazy"
						src={blog.image}
						alt=""
						className="w-[500px] object-cover"
					/>
					<div
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(blog?.description),
						}}
					></div>
				</div>
			</div>
		</div>
	);
};

export default DetailBlog;
