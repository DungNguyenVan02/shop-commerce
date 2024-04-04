import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { apiGetBlogs } from "~/apis";
import { BlogItem } from "~/components/Blog";
import routes from "~/config/routes";
import icons from "~/utils/icons";

function Blogs() {
	const { IoIosArrowForward } = icons;
	const [blogs, setBlogs] = useState();
	const fetchBlogs = async () => {
		const response = await apiGetBlogs({
			sort: "-createdAt",
		});
		if (response?.success) {
			setBlogs(response.blogs);
		}
	};

	useEffect(() => {
		fetchBlogs();
		window.scrollTo(0, 0);
	}, []);
	return (
		<div className="px-[24px]">
			<div className="bg-[#f5f5f5] mx-[-24px]">
				<div className="max-w-main w-full mx-auto py-[20px] ">
					<div className="flex items-center gap-1 text-[14px] font-[400] ">
						<NavLink
							to={routes.home}
							className="cursor-pointer opacity-80 hover:opacity-100"
						>
							Home
						</NavLink>
						<IoIosArrowForward />
						<span className="opacity-80">Blogs</span>
					</div>
				</div>
			</div>
			<div className="max-w-main w-full mx-auto my-7">
				<div className="my-[24px] flex flex-col gap-6">
					{blogs?.map((blog) => {
						return <BlogItem key={blog._id} data={blog} />;
					})}
				</div>
			</div>
		</div>
	);
}

export default Blogs;
