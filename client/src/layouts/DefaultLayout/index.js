import Header from "../components/Header";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

function DefaultLayout({ children }) {
	return (
		<div className="w-full flex items-center flex-col">
			<div className="max-w-main w-full px-5">
				<Header />
				<Navigation />
			</div>
			<div className="max-w-main w-full my-7 px-5">{children}</div>
			<div className="w-full px-5">
				<Footer />
			</div>
		</div>
	);
}

export default DefaultLayout;
