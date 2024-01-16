import { useEffect, useState } from "react";
import { apiDeleteUser, apiGetAllUser } from "~/apis/user";
import moment from "moment";
import icons from "~/utils/icons";
import { useDebounce } from "~/components/hooks";
import Pagination from "~/components/Pagination";
import {
	useSearchParams,
	createSearchParams,
	useLocation,
	useNavigate,
} from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "~/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { appSelector } from "~/redux/selector";
import { showModal } from "~/redux/appSlice";
import { FormUpdate } from "~/components/Admin/ManageUser";

function ManageUsers() {
	const [params] = useSearchParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isShowModal } = useSelector(appSelector);

	const { TbUserEdit, TbUserX, CiSearch } = icons;

	const [editEl, setEditEl] = useState(null);
	const [isRerender, setIsRender] = useState(false);
	const [users, setUsers] = useState([]);
	const [queries, setQueries] = useState({ q: "" });

	const handleDeleteUser = (uid) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Are you really want remove this user?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel!",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Deleted!",
					text: "Your file has been deleted.",
					icon: "success",
				}).then(async () => {
					await apiDeleteUser(uid);
					setIsRender(!isRerender);
					navigate({
						pathname: location.pathname,
						search: createSearchParams("").toString(),
					});
				});
			}
		});
	};

	const debouncedValue = useDebounce(queries.q, 500);
	useEffect(() => {
		fetchAllUsers();
	}, [isShowModal]);

	const fetchAllUsers = async (params) => {
		const response = await apiGetAllUser({
			...params,
			limit: process.env.REACT_APP_LIMIT,
		});
		if (response.success) {
			setUsers(response);
		}
	};

	useEffect(() => {
		const queries = Object.fromEntries([...params]);
		fetchAllUsers(queries);
		window.scrollTo(0, 0);
	}, [params]);

	const handleSearchText = (e) => {
		let valueSearch = e.target.value;
		if (!valueSearch.startsWith(" ")) {
			setQueries({ q: valueSearch });
		}
	};
	useEffect(() => {
		const queries = Object.fromEntries([...params]);
		if (debouncedValue) {
			queries.q = debouncedValue;
			queries.page = 1;
			navigate({
				pathname: location.pathname,
				search: createSearchParams(queries).toString(),
			});
		}
		if (debouncedValue === "") {
			params.get("q") &&
				navigate({
					pathname: location.pathname,
					search: createSearchParams("").toString(),
				});
		}

		fetchAllUsers(queries);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue, params, isRerender]);

	return (
		<p>
			{isShowModal && (
				<Modal>
					<FormUpdate useEdit={editEl} />
				</Modal>
			)}
			<div className="flex items-center h-[40px] bg-gray-600 text-white px-3">
				Manage user
			</div>
			<div className="px-3 bg-gray-100 h-screen">
				<div className="flex h-[60px] items-center py-3 gap-5">
					<div className="h-full flex items-center border rounded-md ">
						<input
							type="text"
							value={queries.q}
							onChange={handleSearchText}
							placeholder="Enter search user by name or email"
							className="w-[300px] pl-3 h-full outline-none rounded-md placeholder:text-[14px]"
						/>
						<CiSearch
							size={20}
							className="mx-3 cursor-pointer opacity-80 hover:opacity-100"
						/>
					</div>
				</div>
				<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-white uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									#
								</th>
								<th scope="col" className="px-6 py-3">
									First name
								</th>
								<th scope="col" className="px-6 py-3">
									Last name
								</th>
								<th scope="col" className="px-6 py-3">
									Email
								</th>
								<th scope="col" className="px-6 py-3">
									Phone number
								</th>

								<th scope="col" className="px-6 py-3">
									Role
								</th>
								<th scope="col" className="px-6 py-3">
									Status
								</th>
								<th scope="col" className="px-6 py-3">
									createdAt
								</th>
								<th scope="col" className="px-6 py-3">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{users?.users?.map((user, index) => {
								return (
									<tr
										key={user._id}
										className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
									>
										<td className="px-6 py-3">
											{index + 1}
										</td>
										<td className="px-6 py-3">
											{user?.firstName}
										</td>
										<td className="px-6 py-3">
											{user?.lastName}
										</td>
										<td className="px-6 py-3">
											{user?.email}
										</td>
										<td className="px-6 py-3">
											{user?.phone}
										</td>

										<td className="px-6 py-3">
											{user?.role === 1974
												? "Admin"
												: "User"}
										</td>
										<td className="px-6 py-3">
											{user?.isBlocked
												? "Blocked"
												: "Active"}
										</td>
										<td className="px-6 py-3">
											{moment(user?.createdAt).format(
												"DD-MM-YYYY"
											)}
										</td>
										<td className="px-6 py-3">
											<div className="flex items-center gap-3">
												<i
													className="cursor-pointer opacity-75 hover:opacity-100"
													onClick={() => {
														setEditEl(user);
														dispatch(
															showModal({
																isShowModal: true,
															})
														);
													}}
												>
													<TbUserEdit
														size={20}
														color="blue"
													/>
												</i>
												<i
													className="cursor-pointer opacity-75 hover:opacity-100"
													onClick={() =>
														handleDeleteUser(
															user._id
														)
													}
												>
													<TbUserX
														size={20}
														color="red"
													/>
												</i>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<div className="mt-4 flex justify-end">
					<Pagination totalCount={users.counts} />
				</div>
			</div>
		</p>
	);
}
export default ManageUsers;
