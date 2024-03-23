import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChooseImages } from "~/components/Admin/ManageProducts";
import { CustomInput, MarkdownEditor } from "~/components/common";
import { schemasValidBlog } from "~/utils/schemasValid";
import { DotsAnimation } from "~/components/Animation";
import Swal from "sweetalert2";
import { apiUpdateBlog } from "~/apis";

const UpdateBlog = ({ dataUpdate, onHandleHide }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [contentBlog, setContentBlog] = useState({ description: "" });
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
		setContentBlog({
			description:
				typeof dataUpdate?.description === "object"
					? dataUpdate?.description?.join("")
					: dataUpdate?.description,
		});
	}, [dataUpdate]);

	// get data từ MarkDown
	const onChangeValue = useCallback(
		(value) => {
			setContentBlog(value);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[contentBlog]
	);

	const handleUploadThumb = useCallback(
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
		if (contentBlog === "") {
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

		if (contentBlog === "" || preview.thumb === "") return;

		const mergeObjects = {
			...data,
			description: contentBlog?.description
				? contentBlog.description
				: contentBlog,
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
			toast.success("Update blog successfully!");
			setPreview({ thumb: null });
			setFiles({ thumb: "" });
			setContentBlog("");
			onHandleHide({
				isUpdate: false,
				data: null,
			});
		} else {
			setIsUploading(false);
			Swal.fire(
				"Notifications",
				"Something went wrong, please try again",
				"error"
			);
		}
	};

	return (
		<div onClick={(e) => e.stopPropagation()}>
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
			<div className="flex items-center min-h-[40px] bg-gray-600 text-white px-5">
				Update products
			</div>
			<div className="px-5 py-3 bg-slate-100 flex-1">
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
											<ChooseImages
												title="blog"
												invalidField={invalidField}
												id="thumb"
												files={files}
												onUpload={handleUploadThumb}
												selected={preview.thumb ? 1 : 0}
											/>
											{preview.thumb && (
												<img
													className="w-[140px] my-3 rounded-sm object-cover"
													src={preview.thumb}
													alt="previewThumb"
													accept="image/jpeg, image/png"
												/>
											)}
										</div>
									</div>
								</div>

								<MarkdownEditor
									label="Description product"
									value={contentBlog}
									onChangeValue={onChangeValue}
									invalidField={invalidField}
									setInvalidField={setInvalidField}
									contentBlog={contentBlog}
								/>

								<div className="flex gap-3 my-6">
									<button
										className="px-7 py-2 bg-green-500 text-white rounded hover:opacity-80"
										type="submit"
									>
										Save
									</button>
									<label
										htmlFor="btnBack"
										className="px-7 py-2 bg-red-400 text-white rounded hover:opacity-80 cursor-pointer"
									>
										Back
									</label>
								</div>
							</Form>
						);
					}}
				</Formik>
				<button
					className="hidden"
					id="btnBack"
					onClick={() =>
						onHandleHide({
							isUpdate: false,
							data: null,
						})
					}
				/>
			</div>
		</div>
	);
};

export default UpdateBlog;
