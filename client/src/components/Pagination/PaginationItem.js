import {
	createSearchParams,
	useNavigate,
	useSearchParams,
	useLocation,
} from "react-router-dom";
import icons from "../../utils/icons";
import { Button } from "~/components/common";
function PaginationItem({ children }) {
	const { HiOutlineDotsHorizontal } = icons;
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const location = useLocation();

	const handleChangePage = (page) => {
		const queries = Object.fromEntries([...params]);
		if (Number(page)) queries.page = page;
		navigate({
			pathname: location.pathname,
			search: createSearchParams(queries).toString(),
		});
	};
	return (
		<Button
			styleCustom={`${
				(+params.get("page") || 1) === children
					? "bg-main text-white hover:bg-main"
					: "text-gray-800"
			} px-4 py-2 flex justify-center rounded-md cursor-pointer hover:bg-gray-300 ${
				typeof children === "string"
					? "hover:bg-transparent items-end"
					: " items-center"
			}`}
			handleClick={() => handleChangePage(children)}
			isDisabled={typeof children !== "number"}
			title={
				typeof children === "number" ? (
					children
				) : (
					<HiOutlineDotsHorizontal size={20} />
				)
			}
		/>
	);
}

export default PaginationItem;
