import DailySale from "../../components/DailySale";
import Banner from "../../components/Banner";
import Sidebar from "../../layouts/components/Sidebar";
import BestSeller from "../../components/BestSeller";
import FeaturedProduct from "../../components/FeaturedProduct";

function Home() {
	return (
		<div className="w-full flex flex-col gap-6">
			<div className="flex h-[486px]">
				<div className="flex flex-col gap-5 max-w-[24%] w-full">
					<Sidebar />
				</div>
				<div className="flex flex-col gap-5 max-w-[76%] w-full h-full pl-5">
					<Banner />
				</div>
			</div>
			<div className="flex">
				<div className="flex flex-col gap-5 max-w-[24%] w-full">
					<DailySale />
				</div>
				<div className="flex flex-col gap-5 max-w-[76%] w-full pl-5">
					<BestSeller />
				</div>
			</div>
			<div>
				<FeaturedProduct />
			</div>
		</div>
	);
}

export default Home;
