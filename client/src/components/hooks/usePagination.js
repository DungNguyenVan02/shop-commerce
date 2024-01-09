import { useMemo } from "react";
import { generateRange } from "../../utils/helper";

// firstPage lastPage currentPage sibling dots * 2
// totalPages  =  totalProducts / limit (66 / 10 = 6.6 => ceil = 7)
// totalPaginationItem: sibling + 5
// [1,2,3,4,5,6]
// [1,...,6,7,8,9,10]
// [1,2,3,4,5,...,10]
// [1,...5,6,7,...10]

function usePagination(totalProduct, currentPage, sibling = 1) {
	const paginationArr = useMemo(() => {
		// Tổng sp hiển thị
		const limitProduct = process.env.REACT_APP_LIMIT_PRODUCT || 10;

		// Tổng số trang
		const totalPages = Math.ceil(totalProduct / limitProduct);

		const totalPaginationItem = sibling + 5;

		if (totalPages <= totalPaginationItem)
			return generateRange(1, totalPages);

		const isShowDotsLeft = currentPage - sibling > 3;
		const isShowDotsRight = currentPage + sibling < totalPages - 1;

		if (isShowDotsLeft && !isShowDotsRight) {
			let rightStart = currentPage - 1;
			if (currentPage === totalPages) {
				rightStart = currentPage - 2;
			}
			const rightRage = generateRange(rightStart, totalPages);
			return [1, "dots", ...rightRage];
		}

		if (isShowDotsRight && !isShowDotsLeft) {
			const leftRange = generateRange(1, 5);
			return [...leftRange, "dots", totalPages];
		}

		if (isShowDotsLeft && isShowDotsRight) {
			const siblingLeft = currentPage - sibling;
			const siblingRight = currentPage + sibling;

			const middleRange = generateRange(siblingLeft, siblingRight);
			return [1, "dots", ...middleRange, "dots", totalPages];
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalProduct, currentPage, sibling]);

	return paginationArr;
}

export default usePagination;
