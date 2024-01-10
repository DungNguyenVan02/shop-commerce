import Slider from "../Slider";
import { useSelector } from "react-redux";
import { newProductSelector } from "~/redux/selector";

function NewArrivals() {
	const { newProduct } = useSelector(newProductSelector);
	return (
		<div>
			<h3 className="text-[20px] mb-4 text-[#151515] uppercase font-bold border-b-2 border-main pb-[15px]">
				NEW ARRIVALS
			</h3>
			<Slider products={newProduct} show={5} />
		</div>
	);
}

export default NewArrivals;
