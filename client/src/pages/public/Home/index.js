import { Sidebar } from "~/layouts/components/user/Sidebar";
import {
	FeaturedProduct,
	Blog,
	Banner,
	BestSeller,
	SubBanner,
	BrandProduct,
	AboutShop,
} from "~/components/SectionLayout";
import DailySale from "~/components/DailySale";

function Home() {
	return (
		<>
			<div className="max-w-main w-full h-full mt-7 mx-auto flex flex-col gap-6">
				<div className="grid wide">
					<div className="row">
						<div className="col g-l-3 g-m-3 g-c-0">
							<Sidebar />
						</div>
						<div className="col g-l-6 g-m-6 g-c-12">
							<Banner />
						</div>
						<div className="col g-l-3 g-m-3 g-c-0">
							<SubBanner />
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col g-l-3 g-m-3 g-c-12">
						<DailySale />
					</div>
					<div className="col g-l-9 g-m-9 g-c-12 ">
						<BestSeller />
					</div>
				</div>
				<div>
					<FeaturedProduct />
				</div>
				<BrandProduct category="Điện thoại" />
				<BrandProduct category="Tablet" />
				<BrandProduct category="Phụ kiện" />

				<Blog />
			</div>
			<AboutShop />
		</>
	);
}

export default Home;
