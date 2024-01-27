// import DailySale from "~/components/public/DailySale";
import { Sidebar } from "~/layouts/components/user/Sidebar";
import {
	HotCollection,
	NewArrivals,
	FeaturedProduct,
	Blog,
	Banner,
	BestSeller,
} from "~/components/SectionLayout";

function Home() {
	return (
		<div className="max-w-main w-full my-7 mx-auto flex flex-col gap-6">
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
					{/* <DailySale /> */}
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
