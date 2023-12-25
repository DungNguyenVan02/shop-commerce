import { memo } from "react";
import { RotatingLines } from "react-loader-spinner";
function SpinnerAnimation() {
	return (
		<RotatingLines
			visible={true}
			height="21"
			width="21"
			color="#9ca3b7"
			strokeColor="#9ca3b7"
			strokeWidth="5"
			animationDuration="0.80"
			ariaLabel="rotating-lines-loading"
			wrapperStyle={{}}
			wrapperClass=""
		/>
	);
}

export default memo(SpinnerAnimation);
