import { memo } from "react";
import { Comment } from "react-loader-spinner";

function DotsAnimation({ height = 80, width = 80 }) {
	return (
		<Comment
			visible={true}
			height={height}
			width={width}
			color="#fff"
			backgroundColor="transparent"
		/>
	);
}

export default memo(DotsAnimation);
