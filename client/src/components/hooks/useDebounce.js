import { useEffect, useState } from "react";

function useDebounce(value, delay) {
	const [result, setResult] = useState("");

	useEffect(() => {
		const idTimeout = setTimeout(() => {
			setResult(value);
		}, delay);
		return () => clearTimeout(idTimeout);
	}, [value, delay]);

	return result;
}

export default useDebounce;
