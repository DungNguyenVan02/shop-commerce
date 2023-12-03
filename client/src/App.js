import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { getCategories } from "./redux/asyncActions";
import { useDispatch } from "react-redux";

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
									<DefaultLayout>
										<Page />
									</DefaultLayout>
								}
							/>
						);
					})}
				</Routes>
			</div>
		</Router>
	);
}

export default App;
