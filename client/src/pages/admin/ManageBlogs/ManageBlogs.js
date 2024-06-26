import moment from "moment";
import { useEffect, useState } from "react";
import { apiDeleteBlog, apiGetBlogs } from "~/apis";
import icons from "~/utils/icons";
import Pagination from "~/components/Pagination";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "~/components/hooks";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import UpdateBlog from "~/layouts/components/admin/Blog";

function ManageBlogs({ location, navigate }) {
	const [searchQueries] = useSearchParams();
	const { CiSearch, IoTrashBinOutline, FaRegEdit } = icons;
	const [searchText, setSearchText] = useState({ q: "" });
	const [blogs, setBlogs] = useState([]);
	const [isRerender, setIsRerender] = useState(false);
	const [updateBlog, setUpdateBlog] = useState({
		isUpdate: false,
		data: [],
	});

	const fetchGetBlogs = async (params) => {
		const response = await apiGetBlogs({
			...params,
			sort: "-createdAt",
			limit: process.env.REACT_APP_LIMIT,
		});
		if (response?.success) {
			setBlogs(response);
		}
	};

	const debouncedValue = useDebounce(searchText.q, 500);

	const handleSearchText = (e) => {
		let valueSearch = e.target.value;
		if (!valueSearch.startsWith(" ")) {
			setSearchText({ q: valueSearch });
		}
	};

	useEffect(() => {
		const queries = Object.fromEntries([...searchQueries]);
		if (debouncedValue) {
			queries.q = debouncedValue;
			navigate({
				pathname: location.pathname,
				search: createSearchParams(queries).toString(),
			});
		} else {
			navigate({
				pathname: location.pathname,
				search: createSearchParams("").toString(),
			});
		}

		fetchGetBlogs(queries);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue, searchQueries, isRerender, updateBlog]);

	const handleDeleteBlog = (bid) => {
		Swal.fire({
			title: "Bạn có chắc chắn?",
			text: "Delete blog from this list!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Đồng ý",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Đã xóa",
					text: "Blog has been deleted.",
					icon: "success",
				}).then(async () => {
					const response = await apiDeleteBlog(bid);
					if (response?.success) {
						setIsRerender(!isRerender);
					} else {
						toast.warning(response.message);
					}
				});
			}
		});
	};

	return (
		<div
			className="p-5 bg-[#f6f8fb] min-h-screen"
			onClick={() => setUpdateBlog({ isUpdate: false, data: [] })}
		>
			{updateBlog.isUpdate && (
				<div className="absolute top-0 right-0 bottom-0 left-0 z-40 flex flex-col">
					<UpdateBlog
						dataUpdate={updateBlog?.data}
						onHandleHide={setUpdateBlog}
					/>
				</div>
			)}
			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center text-black font-semibold text-[24px]">
					Danh sách bài viết
				</h3>
				<div className="flex h-[60px] items-center py-3 gap-5">
					<div className="h-full flex items-center border rounded-md shadow-custom ">
						<input
							type="text"
							value={searchText.q}
							onChange={handleSearchText}
							placeholder="Tìm kiếm theo tiêu đề bài viết"
							className="min-w-[360px] pl-3 h-full outline-none bg-transparent placeholder:text-[14px]"
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
									Tiêu đề
								</th>
								<th scope="col" className="px-6 py-3">
									Like
								</th>
								<th scope="col" className="px-6 py-3">
									Dislike
								</th>

								<th scope="col" className="px-6 py-3">
									Lượt xem
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
							{blogs?.blogs?.map((blog, index) => {
								return (
									<tr
										key={blog._id}
										className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 bblog-b dark:bblog-gray-700"
									>
										<td className="px-6 py-3">
											{((+searchQueries.get("page") ||
												1) -
												1) *
												process.env.REACT_APP_LIMIT +
												index +
												1}
										</td>
										<td className="px-6 py-3">
											{blog?.title}
										</td>
										<td className="px-6 py-3">
											{blog?.like?.length || 0}
										</td>
										<td className="px-6 py-3">
											{blog?.dislike?.length || 0}
										</td>

										<td className="px-6 py-3">
											{blog?.views}
										</td>

										<td className="px-6 py-3">
											{moment(blog?.createdAt).format(
												"DD-MM-YYYY"
											)}
										</td>
										<td className="px-6 py-3">
											<div className="flex items-center  gap-3">
												<span
													className="cursor-pointer opacity-75 hover:opacity-100"
													onClick={(e) => {
														e.stopPropagation();
														setUpdateBlog({
															isUpdate: true,
															data: blog,
														});
													}}
												>
													<FaRegEdit
														size={19}
														color="#43a87b"
													/>
												</span>
												<span
													className="cursor-pointer opacity-75 hover:opacity-100"
													onClick={() =>
														handleDeleteBlog(
															blog._id
														)
													}
												>
													<IoTrashBinOutline
														size={19}
														color="red"
													/>
												</span>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<div className="mt-4 flex justify-end">
					<Pagination totalCount={blogs.counts} />
				</div>
			</div>
		</div>
	);
}

export default withBaseComponent(ManageBlogs);
