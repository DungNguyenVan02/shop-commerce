import usePagination from "../../components/hooks";
import PaginationItem from "./PaginationItem";
function Pagination({ totalProducts }) {
	const pagination = usePagination(totalProducts, 1);
	return (
		<div className="flex justify-center gap-1">
			{pagination?.map((page, i) => (
				<PaginationItem key={i} current={+1}>
					{page}
				</PaginationItem>
			))}
		</div>
	);
}

export default Pagination;
