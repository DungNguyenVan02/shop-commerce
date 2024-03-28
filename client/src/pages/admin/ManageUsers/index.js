import { useEffect, useState } from "react";
import {
	apiDeleteUser,
	apiGetAllUser,
	apiUpdateUserByAdmin,
} from "~/apis/user";
import moment from "moment";
import icons from "~/utils/icons";
import { useDebounce } from "~/components/hooks";
import Pagination from "~/components/Pagination";
import { useSearchParams, createSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { appSelector } from "~/redux/selector";
import withBaseComponent from "~/components/hocs/withBaseComponent";

function ManageUsers({ location, navigate }) {
	const [params] = useSearchParams();

	const { isShowModal } = useSelector(appSelector);

	const { CiSearch, ImBin, LiaUserTimesSolid, LiaUserCheckSolid } = icons;

	const [isRerender, setIsRerender] = useState(false);

	const [users, setUsers] = useState([]);
	const [queries, setQueries] = useState({ q: "" });

	const debouncedValue = useDebounce(queries.q, 500);
	useEffect(() => {
		fetchAllUsers();
	}, [isShowModal]);

	const fetchAllUsers = async (params) => {
		const response = await apiGetAllUser({
			...params,
			limit: process.env.REACT_APP_LIMIT,
		});
		if (response?.success) {
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

	const handleRemove = (uid) => {
		Swal.fire({
			title: "Bạn có chắc chắn muốn xóa tài khoản này?",
			text: "Tài khoản này sẽ bị xóa khỏi hệ thống",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Xác nhận xóa",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response = await apiDeleteUser(uid);
				if (response.success) {
					setIsRerender((prev) => !prev);
					Swal.fire({
						title: "Xóa thành công!",
						text: "Tài khoản đã bị xóa",
						icon: "success",
					});
				} else {
					Swal.fire({
						title: "Hệ thống thông báo",
						text: "Có lỗi xảy ra, vui lòng thử lại sau",
						icon: "warning",
					});
				}
			}
		});
	};

	const handleToggleBlocked = (uid, isBlocked) => {
		Swal.fire({
			title: `${
				!isBlocked
					? "Bạn có chắc chắn muốn mở khóa tài khoản này?"
					: "Bạn có chắc chắn muốn khóa tài khoản này?"
			}`,
			text: `${
				!isBlocked
					? "Tài khoản sẽ được hoạt động bình thường"
					: "Tài khoản sẽ không sử dụng được tại hệ thống"
			}`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Xác nhận",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response = await apiUpdateUserByAdmin(uid, isBlocked);
				if (response.success) {
					setIsRerender((prev) => !prev);
					Swal.fire({
						title: "Cập nhật thành công!",
						text: `Tài khoản đã được ${isBlocked ? "khóa" : "mở"}`,
						icon: "success",
					});
				} else {
					Swal.fire({
						title: "Hệ thống thông báo",
						text: "Có lỗi xảy ra, vui lòng thử lại sau",
						icon: "warning",
					});
				}
			}
		});
	};

	return (
		<div className="p-5 bg-[#f6f8fb] min-h-screen">
			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center text-black font-semibold text-[24px]">
					Quản lý người dùng
				</h3>
				<div className="flex h-[60px] items-center py-3 gap-5">
					<div className="h-full flex items-center border rounded-md shadow-custom ">
						<input
							type="text"
							value={queries.q}
							onChange={handleSearchText}
							placeholder="Tìm kiếm theo tên hoặc số điện thoại"
							className="w-[300px] pl-3 h-full outline-none bg-transparent placeholder:text-[14px]"
						/>
						<CiSearch
							size={20}
							className="mx-3 cursor-pointer opacity-80 hover:opacity-100"
						/>
					</div>
				</div>
				<div className="overflow-x-auto shadow-md sm:rounded-lg">
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-white uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									#
								</th>

								<th scope="col" className="px-6 py-3">
									Họ tên
								</th>
								<th scope="col" className="px-6 py-3">
									Email
								</th>
								<th scope="col" className="px-6 py-3">
									Số điện thoại
								</th>

								<th scope="col" className="px-6 py-3">
									Quyền tài khoản
								</th>
								<th scope="col" className="px-6 py-3">
									Tình trạng
								</th>
								<th scope="col" className="px-6 py-3">
									Ngày tạo
								</th>
								<th scope="col" className="px-6 py-3">
									Tùy chọn
								</th>
							</tr>
						</thead>
						<tbody>
							{users?.data?.map((user, index) => {
								return (
									<tr
										key={user._id}
										className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
									>
										<td className="px-6 py-3">
											{((+params.get("page") || 1) - 1) *
												process.env.REACT_APP_LIMIT +
												index +
												1}
										</td>
										<td className="px-6 py-3">
											{user?.fullName}
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
											<div className="flex items-center justify-center gap-3">
												{user?.isBlocked ? (
													<i
														className="cursor-pointer opacity-80 hover:opacity-100"
														onClick={() =>
															handleToggleBlocked(
																user._id,
																{
																	isBlocked: false,
																}
															)
														}
													>
														<LiaUserCheckSolid
															size={22}
															color="#22ba40"
														/>
													</i>
												) : (
													<i
														className="cursor-pointer opacity-80 hover:opacity-100"
														onClick={() =>
															handleToggleBlocked(
																user._id,
																{
																	isBlocked: true,
																}
															)
														}
													>
														<LiaUserTimesSolid
															size={22}
															color="#ba8925"
														/>
													</i>
												)}
												<i
													className="cursor-pointer opacity-80 hover:opacity-100"
													onClick={() =>
														handleRemove(user._id)
													}
												>
													<ImBin
														size={20}
														color="#de3737"
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
		</div>
	);
}
export default withBaseComponent(ManageUsers);
