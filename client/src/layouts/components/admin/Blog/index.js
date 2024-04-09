import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CustomInput, MarkdownEditor } from "~/components/common";
import { schemasValidBlog } from "~/utils/schemasValid";
import { DotsAnimation } from "~/components/Animation";
import Swal from "sweetalert2";
import { apiUpdateBlog } from "~/apis";
import icons from "~/utils/icons";

const UpdateBlog = ({ dataUpdate, onHandleHide }) => {
	const { FaUpload } = icons;
	const [isUploading, setIsUploading] = useState(false);
	const [description, setDescription] = useState(dataUpdate?.description);

	const [files, setFiles] = useState({
		thumb: "",
	});

	const [preview, setPreview] = useState({
		thumb: dataUpdate.image || "",
	});
	// Thể hiện trạng thái validate form
	const [invalidField, setInvalidField] = useState({
		description: false,
		thumb: false,
	});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [dataUpdate]);

	// get data từ MarkDown
	const onChangeValue = useCallback(
		(value) => {
			setDescription(value);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[description]
	);

	const handleChooseThumb = useCallback(
		(event) => {
			const checkInvalidFiles = Array.from(event.target.files).some(
				(file) => {
					return (
						file.type === "image/jpeg" ||
						file.type === "image/png" ||
						file.type === "image/jpg"
					);
				}
			);
			if (checkInvalidFiles) {
				setFiles({
					thumb: event.target.files[0],
				});
			} else {
				toast.warning("File not supported");
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[files.thumb]
	);

	useEffect(() => {
		if (files.thumb !== "") {
			setPreview({
				thumb: URL.createObjectURL(files.thumb),
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files]);

	useEffect(() => {
		return () => preview.thumb && URL.revokeObjectURL(preview.thumb);
	}, [preview.thumb]);

	const initialValues = {
		title: dataUpdate?.title,
	};
	const onSubmit = async (data, actions) => {
		if (description === "") {
			setInvalidField((prev) => ({
				...prev,
				description: true,
			}));
		}
		if (preview.thumb === "") {
			setInvalidField((prev) => ({
				...prev,
				thumb: true,
			}));
		}

		if (description === "" || preview.thumb === "") return;

		const mergeObjects = {
			...data,
			description: description?.description
				? description.description
				: description,
			image: files.thumb !== "" ? files.thumb : preview.thumb,
		};

		const formData = new FormData();
		for (let i of Object.entries(mergeObjects)) {
			formData.append(i[0], i[1]);
		}

		setIsUploading(true);
		const response = await apiUpdateBlog(dataUpdate._id, formData);
		if (response?.success) {
			actions.resetForm();
			setIsUploading(false);
			toast.success("Cập nhật bài viết thành công");
			setPreview({ thumb: null });
			setFiles({ thumb: "" });
			setDescription("");
			onHandleHide({
				isUpdate: false,
				data: null,
			});
		} else {
			setIsUploading(false);
			Swal.fire(
				"Hệ thống thông báo",
				"Có lỗi xảy ra, vui lòng thử lại sau",
				"error"
			);
		}
	};

	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className="p-5 bg-[#f6f8fb] min-h-screen"
		>
			{isUploading && (
				<div className="fixed top-0 right-0 bottom-0 left-[0] bg-overlay z-[99999999] flex items-center justify-center">
					<h3 className="text-[20px] text-white">
						Uploading, please wait a moment!
					</h3>{" "}
					<i className="mt-[10px] ml-[-8px]">
						<DotsAnimation height={57} width={57} />
					</i>
				</div>
			)}
			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center text-black font-semibold text-[24px]">
					Chỉnh sửa bài viết
				</h3>
				<div className="p-3  min-h-screen w-full">
					<Formik
						initialValues={initialValues}
						validationSchema={schemasValidBlog}
						onSubmit={onSubmit}
					>
						{({ handleSubmit }) => {
							return (
								<Form onSubmit={handleSubmit}>
									<div className="grid wide">
										<div className="row">
											<div className="col g-l-12">
												<CustomInput
													name="title"
													label="Title order"
													placeholder="Enter title order"
												/>
											</div>
											<div className="col g-l-12">
												<h4 className=" font-medium px-3 text-[16px]">
													Ảnh bìa
												</h4>
												<label
													htmlFor="selectThumb"
													className={`cursor-pointer border h-[40px] flex items-center ${
														invalidField.thumb
															? "bg-red-100 border-main"
															: "bg-white"
													} px-5 rounded-md`}
												>
													<FaUpload />
													<span className="ml-2">{`Đã chọn ${
														preview.thumb ? 1 : 0
													}`}</span>
													<input
														id="selectThumb"
														type="file"
														onChange={
															handleChooseThumb
														}
														className="hidden"
													/>
												</label>
												{invalidField.thumb && (
													<p className="ml-1 mt-[2px] text-[14px] text-red-600">
														Vui lòng nhập trường
														này!
													</p>
												)}
												<div className="mt-5">
													{preview?.thumb && (
														<img
															loading="lazy"
															className="w-[140px] object-cover"
															src={preview?.thumb}
															alt=""
														/>
													)}
												</div>
											</div>
										</div>
									</div>

									<MarkdownEditor
										label="Description product"
										value={description}
										onChangeValue={onChangeValue}
										invalidField={invalidField}
										setInvalidField={setInvalidField}
										description={description}
									/>

									<div className="flex gap-2 my-3">
										<button
											className="px-3 py-1 bg-green-500 text-white rounded hover:opacity-80 my-[24px]"
											type="submit"
										>
											Cập nhật
										</button>
										<span
											onClick={() =>
												onHandleHide({
													isUpdate: false,
													data: null,
												})
											}
											className="cursor-pointer ml-4 px-3 py-1 bg-red-500 text-white rounded hover:opacity-80 my-[24px]"
										>
											Trở lại
										</span>
									</div>
								</Form>
							);
						}}
					</Formik>
				</div>
			</div>
		</div>
	);
};

export default UpdateBlog;
