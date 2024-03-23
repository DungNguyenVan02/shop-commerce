import { useCallback, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { CustomInput, Button, MarkdownEditor } from "~/components/common";
import { schemasValidBlog } from "~/utils/schemasValid";
import { toast } from "react-toastify";
import { apiCreateBlog, apiCreateProduct } from "~/apis";
import { ChooseImages } from "~/components/Admin/ManageProducts";
import { DotsAnimation } from "~/components/Animation";
import Swal from "sweetalert2";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import routes from "~/config/routes";

function CreateBlog({ navigate }) {
	const [isUploading, setIsUploading] = useState(false);
	const [descriptionProduct, setDescriptionProduct] = useState("");
	const [files, setFiles] = useState({
		thumb: "",
	});
	// Thể hiện trạng thái validate form
	const [invalidField, setInvalidField] = useState({
		description: false,
		thumb: false,
	});
	const [preview, setPreview] = useState({
		thumb: null,
	});

	// get data từ MarkDown
	const onChangeValue = useCallback(
		(value) => {
			setDescriptionProduct(value);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[descriptionProduct]
	);

	const initialValues = {
		title: "",
	};

	const onSubmit = async (data, actions) => {
		if (descriptionProduct === "") {
			setInvalidField((prev) => ({
				...prev,
				description: true,
			}));
		}
		if (files.thumb === "") {
			setInvalidField((prev) => ({
				...prev,
				thumb: true,
			}));
		}

		if (descriptionProduct === "" || files.thumb === "") return;
		const mergeObjects = { ...data, description: descriptionProduct };

		const formData = new FormData();
		for (let i of Object.entries(mergeObjects)) {
			formData.append(i[0], i[1]);
		}
		if (files.thumb) formData.append("image", files.thumb);

		setIsUploading(true);
		const response = await apiCreateBlog(formData);
		if (response?.success) {
			actions.resetForm();
			navigate(routes.admin_manage_blogs);
			setIsUploading(false);
			toast.success("Created blog successfully!");
			setPreview({ thumb: null });
			setFiles({ thumb: "" });
			setDescriptionProduct("");
		} else {
			setIsUploading(false);
			Swal.fire(
				"Notifications",
				"Something went wrong, please try again",
				"error"
			);
		}
	};

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
				setFiles((prev) => ({
					thumb: event.target.files[0],
				}));
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
	}, [files]);

	useEffect(() => {
		return () => preview.thumb && URL.revokeObjectURL(preview.thumb);
	}, [preview.thumb]);

	return (
		<div>
			{isUploading && (
				<div className="fixed top-0 right-0 bottom-0 left-0 bg-overlay z-[99999999] flex items-center justify-center">
					<h3 className="text-[20px] text-white">
						Uploading, please wait a moment!
					</h3>{" "}
					<i className="mt-[10px] ml-[-8px]">
						<DotsAnimation height={57} width={57} />
					</i>
				</div>
			)}
			<div className="flex items-center h-[40px] bg-gray-600 text-white px-3">
				Manage create new blog
			</div>
			<div className="p-3 bg-gray-100 min-h-screen w-full">
				<Formik
					initialValues={initialValues}
					validationSchema={schemasValidBlog}
					onSubmit={onSubmit}
				>
					{({ handleSubmit }) => (
						<Form onSubmit={handleSubmit}>
							<div className="grid wide">
								<div className="row">
									<div className="col g-l-12">
										<CustomInput
											textArea
											name="title"
											label="Title blog"
											placeholder="Enter title blog"
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
								label="Write content blog"
								value={{ description: "" }}
								onChangeValue={onChangeValue}
								invalidField={invalidField}
								setInvalidField={setInvalidField}
								descriptionProduct={descriptionProduct}
							/>
							<Button
								styleCustom="px-3 py-1 bg-green-500 text-white rounded hover:opacity-80 my-[24px]"
								type="submit"
								title="Create new blog"
							/>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default withBaseComponent(CreateBlog);
