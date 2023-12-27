import BreadcrumbHeader from "../../components/BreadcrumbHeader";
import { useParams } from "react-router-dom";

function Products() {
	const { category } = useParams();
	return (
		<>
			<BreadcrumbHeader category={category} />
			<div className="max-w-main w-full mx-auto"></div>
		</>
	);
}

export default Products;
