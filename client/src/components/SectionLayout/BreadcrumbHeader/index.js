import { Link } from "react-router-dom";
import routes from "~/config/routes";
import icons from "~/utils/icons";
function BreadcrumbHeader({ name, slug, category }) {
	const { IoIosArrowForward } = icons;
	return (
		<header className="h-[81px] bg-[#f7f7f7] w-full flex justify-center">
			<div className="max-w-main w-full flex flex-col justify-center">
				<h3 className="text-[18px] font-semibold text-[#151515]">
					{name}
				</h3>
				<div className="flex gap-1 items-center text-[14px] font-[400] opacity-80">
					<Link
						to={routes.home}
						className="cursor-pointer hover:text-main text-[#1c1d1d]"
					>
						Home
					</Link>
					<IoIosArrowForward />
					<Link
						to={`/${slug}`}
						className="cursor-pointer hover:text-main text-[#1c1d1d]"
					>
						{category}
					</Link>
					<span className="text-[#505050]">{name}</span>
				</div>
			</div>
		</header>
	);
}

export default BreadcrumbHeader;
