import Footer from "../components/user/Footer";
import Header from "../components/user/Header";
import { SidebarProfile } from "../components/user/Sidebar";

function MemberLayout({ children }) {
	return (
		<div className="bg-[#f5f5f5] h-full">
			<Header />
			<div className="mt-4">
				<div className="grid wide">
					<div className="row no-gutters">
						<div className=" col g-l-3">
							<SidebarProfile />
						</div>
						<div className=" col g-l-9">{children}</div>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}

export default MemberLayout;
