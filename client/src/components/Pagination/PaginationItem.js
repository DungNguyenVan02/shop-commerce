import {
	createSearchParams,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import icons from "../../utils/icons";
import Button from "../Button";
function PaginationItem({ children }) {
	const { HiOutlineDotsHorizontal } = icons;
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const { category } = useParams();

	const handleChangePage = (page) => {
		const param = [];
		for (let i of params.entries()) {
			param.push(i);
		}
		const queries = {};
		for (let i of params) queries[i[0]] = i[1];
		if (Number(page)) queries.page = page;
		navigate({
			pathname: `/${category}`,
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
