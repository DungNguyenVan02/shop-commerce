import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import Navigation from "../components/user/Navigation";

function DefaultLayout({ children }) {
	return (
		<div className=" w-full flex items-center flex-col relative">
			<Header />
			<Navigation />
			<div className="w-full">{children}</div>
			<Footer />
		</div>
	);
}

export default DefaultLayout;
