import React from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const Congratulations = () => {
	const { width, height } = useWindowSize();
	return (
		<div className="absolute top-0 right-0 left-0 bottom-0">
			<Confetti width={width} height={height} />
		</div>
	);
};

export default Congratulations;
