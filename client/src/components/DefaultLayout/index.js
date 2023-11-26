import Header from "../../layouts/components/Header";
import Footer from "../../layouts/components/Footer";
import Navigation from "../../layouts/components/Navigation";

function DefaultLayout({ children }) {
	return (
		<div className="w-full flex items-center flex-col">
			<div className="max-w-main w-full px-5">
				<Header />
				<Navigation />
			</div>
			<div className="max-w-main w-full px-5">{children}</div>
			<div className="max-w-main w-full px-5">
				<Footer />
			</div>
		</div>
	);
}

export default DefaultLayout;
