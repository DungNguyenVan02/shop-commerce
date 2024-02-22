import { NavLink } from "react-router-dom";
import routes from "~/config/routes";
import icons from "~/utils/icons";

function Blogs() {
	const { IoIosArrowForward } = icons;
	return (
		<div>
			<div className="bg-[#f5f5f5]">
				<div className="max-w-main w-full mx-auto py-[20px]">
					<div className="flex items-center gap-1 text-[14px] font-[400] ">
						<NavLink
							to={routes.home}
							className="cursor-pointer opacity-80 hover:opacity-100"
						>
							Home
						</NavLink>
						<IoIosArrowForward />
						<span className="opacity-80">Blog</span>
					</div>
				</div>
			</div>
			<div className="max-w-main w-full mx-auto my-7">
				<div className="my-[24px]">
					<div className="grid wide">
						<div className="row">content</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Blogs;
