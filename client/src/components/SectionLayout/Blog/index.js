import { useEffect, useState } from "react";
import { apiGetBlogs } from "~/apis";
import { BlogItem } from "~/components/Blog";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import routes from "~/config/routes";

function Blog({ navigate }) {
	const [blogs, setBlogs] = useState([]);

	const fetchBlog = async () => {
		const response = await apiGetBlogs();
		if (response.success) {
			setBlogs(response.blogs);
		}
	};

	useEffect(() => {
		fetchBlog();
	}, []);
	return (
		<div className="mb-5">
			<div className="flex justify-between items-center font-bold border-b-2 border-main pb-[15px] text-[20px] mb-4 text-[#151515]">
				<h3 className=" uppercase ">BLOG POSTS</h3>
				<button
					className="text-[14px] hover:underline text-main"
					onClick={() => navigate(routes?.blogs)}
				>
					Show all
				</button>
			</div>
			<div className="grid wide">
				<div className="row">
					{blogs?.map((blog, i) => {
						if (i <= 3) {
							return (
								<div
									key={blog._id}
									className="col g-l-4 g-m-3 g-c-12 "
								>
									<BlogItem data={blog} />
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
