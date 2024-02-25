import { Sidebar } from "~/layouts/components/user/Sidebar";
import {
	HotCollection,
	NewArrivals,
	FeaturedProduct,
	Blog,
	Banner,
	BestSeller,
	SubBanner,
} from "~/components/SectionLayout";
import DailySale from "~/components/DailySale";

function Home() {
	return (
		<div className="max-w-main w-full h-full mt-7 mx-auto flex flex-col gap-6">
			<div className="grid wide">
				<div className="row">
					<div className="col g-l-3">
						<Sidebar />
					</div>
					<div className="col g-l-6">
						<Banner />
					</div>
					<div className="col g-l-3">
						<SubBanner />
					</div>
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
			<NewArrivals />
			<HotCollection />
			<Blog />
		</div>
	);
}

export default Home;
