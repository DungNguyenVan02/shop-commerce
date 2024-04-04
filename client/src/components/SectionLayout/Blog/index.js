import { useEffect, useState } from "react";
import { apiGetBlogs } from "~/apis";
import { BlogCard } from "~/components/Blog";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import routes from "~/config/routes";

function Blog({ navigate }) {
	const [blogs, setBlogs] = useState([]);

	const fetchBlog = async () => {
		const response = await apiGetBlogs({ sort: "-createdAt" });
		if (response?.success) {
			setBlogs(response.blogs);
		}
	};

	useEffect(() => {
		fetchBlog();
	}, []);
	return (
		<div className="mb-5">
			<div className="flex justify-between items-center font-bold border-b-2 border-main pb-[15px] text-[20px] mb-4 text-[#151515]">
				<h3 className="text-[28px] text-gradient uppercase font-semibold ">
					Bài viết
				</h3>
				<button
					className=" text-[16px] hover:underline hover:text-blue-500 "
					onClick={() => navigate(routes?.blogs)}
				>
					Tất cả
				</button>
			</div>
			<div className="grid wide">
				<div className="row">
					{blogs?.map((blog, i) => {
						if (i <= 2) {
							return (
								<div
									key={blog._id}
									className="col g-l-3 g-m-6 g-c-12"
								>
									<BlogCard data={blog} />
								</div>
							);
						}
						return 0;
					})}
				</div>
			</div>
		</div>
	);
}

export default withBaseComponent(Blog);
