import { useParams } from "react-router-dom";
function DetailProduct() {
	const { pid } = useParams();
	console.log(pid);
	return <h1>DetailProduct pages</h1>;
}

export default DetailProduct;
