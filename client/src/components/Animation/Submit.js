import { memo } from "react";
import { Hourglass } from "react-loader-spinner";
function Submit() {
	return (
		<Hourglass
			visible={true}
			height="80"
			width="80"
			ariaLabel="hourglass-loading"
			wrapperStyle={{}}
			wrapperClass=""
			colors={["#306cce", "#72a1ed"]}
		/>
	);
}

export default memo(Submit);
