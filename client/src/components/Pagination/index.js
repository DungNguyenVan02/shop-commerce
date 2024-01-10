import usePagination from "../../components/hooks";
import PaginationItem from "./PaginationItem";
import { useSearchParams } from "react-router-dom";
function Pagination({ totalProducts }) {
	const [params] = useSearchParams();
	console.log(params);
	const pagination = usePagination(totalProducts, +params.get("page") || 1);
	return (
		<div className="flex justify-center">
			{pagination?.map((pages, i) => (
				<PaginationItem key={i}>{pages}</PaginationItem>
			))}
		</div>
	);
}

export default Pagination;
