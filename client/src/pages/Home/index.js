import Banner from "../../layouts/components/Banner";
import Sidebar from "../../layouts/components/Sidebar";

function Home() {
	return (
		<div className="w-full">
			<div className="flex">
				<div className="flex flex-col gap-5 max-w-[25%] w-full">
					<Sidebar />
					<h2>Best sale</h2>
				</div>
				<div className="flex flex-col gap-5 max-w-[75%] w-full pl-5">
					<Banner />
					<h2>Best sale</h2>
				</div>
			</div>
		</div>
	);
}

export default Home;
