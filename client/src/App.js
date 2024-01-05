import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { getCategories } from "./redux/asyncActions";
import { useDispatch } from "react-redux";
import Footer from "./layouts/components/Footer";
import Modal from "./components/Modal";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getCategories());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Router>
			<div className="App">
				<Routes>
					{publicRoutes.map((route, index) => {
						const Page = route.component;
						return (
							<Route
								key={index}
								path={route.path}
								element={
									route.headerNone ? (
										<>
											<Page />
											<Footer />
										</>
									) : (
										<DefaultLayout>
											<Page />
										</DefaultLayout>
									)
								}
							/>
						);
					})}
				</Routes>
				<ToastContainer />
			</div>
		</Router>
	);
}

export default App;
