import { memo } from "react";
import { Oval } from "react-loader-spinner";

function OvalAnimation({ height = 80, width = 80 }) {
	return (
		<Oval
			visible={true}
			height={height}
			width={width}
			color="#e1e4e8"
			secondaryColor="#e1e3e6"
			ariaLabel="oval-loading"
			strokeWidthSecondary={4}
			strokeWidth={4}
		/>
	);
}

export default memo(OvalAnimation);
