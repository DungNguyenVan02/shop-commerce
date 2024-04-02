import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import Navigation from "../components/user/Navigation";

function DefaultLayout({ children }) {
	return (
		<div className=" relative w-full flex items-center flex-col">
			<Header />
			<Navigation />
			<div className="w-full">{children}</div>
			<Footer />
		</div>
	);
}

export default DefaultLayout;
