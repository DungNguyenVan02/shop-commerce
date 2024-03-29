import { useRef, useEffect } from "react";
import icons from "~/utils/icons";
function VoteBar({ number, ratingCount, ratingTotal }) {
	const { FaStar } = icons;
	const innerPercent = useRef();

	useEffect(() => {
		const percent = (ratingCount / ratingTotal) * 100 + "%";
		innerPercent.current.style.width = percent;

		return () => {
			if (innerPercent.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				innerPercent.current.style.width = 0;
			}
		};
	}, [ratingTotal, ratingCount]);

	return (
		<div className="flex items-center gap-3 text-sm text-gray-700">
			<div className="flex items-center">
				<p className="w-4 text-center">{number}</p>
				<FaStar color="orange" />
			</div>
			<div className="flex-1">
				<div className="w-full h-2 bg-gray-300 rounded-xl overflow-hidden relative">
					<span
						ref={innerPercent}
						className="absolute left-0 h-full bg-main"
					></span>
				</div>
			</div>
			<div>{`${ratingTotal || 0} đánh giá`}</div>
		</div>
	);
}

export default VoteBar;
