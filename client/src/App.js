import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "~/routes";
import DefaultLayout from "~/layouts/DefaultLayout";
import AdminLayout from "~/layouts/AdminLayout";
import { getCategories, getSlide } from "~/redux/asyncActions";
import { useDispatch } from "react-redux";
import Footer from "~/layouts/components/user/Footer";
import MemberLayout from "./layouts/MemberLayout";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getCategories());
		dispatch(getSlide());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Router>
			<div className="App">
				<Routes>
					{publicRoutes.map((route, index) => {
						const Page = route.component;
						let ParentWrap;
						if (route.isAdminRoutes) {
							ParentWrap = AdminLayout;
						} else if (route.isMemberRoutes) {
							ParentWrap = MemberLayout;
						} else {
							ParentWrap = DefaultLayout;
						}

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
										<ParentWrap>
											<Page />
										</ParentWrap>
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
