import DailySale from "../../components/DailySale";
import Banner from "../../components/Banner";
import Sidebar from "../../layouts/components/Sidebar";
import BestSeller from "../../components/BestSeller";

function Home() {
	return (
		<div className="w-full">
			<div className="flex h-[484px]">
				<div className="flex flex-col gap-5 max-w-[20%] w-full">
					<Sidebar />
				</div>
				<div className="flex flex-col gap-5 max-w-[80%] w-full h-full pl-5">
					<Banner />
				</div>
			</div>
			<div className="flex mt-6 h-[484px]">
				<div className="flex flex-col gap-5 max-w-[20%] w-full">
					<DailySale />
				</div>
				<div className="flex flex-col gap-5 max-w-[80%] w-full pl-5">
					<BestSeller />
				</div>
			</div>
		</div>
	);
}

export default Home;
