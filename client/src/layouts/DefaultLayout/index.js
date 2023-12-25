import Header from "../components/Header";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

function DefaultLayout({ children }) {
	return (
		<div className="w-full flex items-center flex-col">
			<Header />
			<Navigation />
			<div className="w-full">{children}</div>
			<Footer />
		</div>
	);
}

export default DefaultLayout;
