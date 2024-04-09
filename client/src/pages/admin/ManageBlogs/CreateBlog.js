import { useCallback, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { CustomInput, Button, MarkdownEditor } from "~/components/common";
import { schemasValidBlog } from "~/utils/schemasValid";
import { toast } from "react-toastify";
import { apiCreateBlog } from "~/apis";
import { DotsAnimation } from "~/components/Animation";
import Swal from "sweetalert2";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import routes from "~/config/routes";
import icons from "~/utils/icons";

function CreateBlog({ navigate }) {
	const { FaUpload } = icons;
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
			toast.success("Thêm bài viết thành công!");
			setPreview({ thumb: null });
			setFiles({ thumb: "" });
			setDescriptionProduct("");
		} else {
			setIsUploading(false);
			Swal.fire(
				"Hệ thống thông báo",
				"Có lỗi xảy ra, vui lòng thử lại sau",
				"error"
			);
		}
	};

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
		<div className="p-5 bg-[#f6f8fb] min-h-screen">
			{isUploading && (
				<div className="fixed top-0 right-0 bottom-0 left-0 bg-overlay z-[99999999] flex items-center justify-center">
					<h3 className="text-[20px] text-white">
						Đang trong quá trình đăng bài, vui lòng đợi!
					</h3>{" "}
					<i className="mt-[10px] ml-[-8px]">
						<DotsAnimation height={57} width={57} />
					</i>
				</div>
			)}

			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center text-black font-semibold text-[24px]">
					Thêm bài viết
				</h3>
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
											label="Tiêu đề bài viết"
											placeholder="Nhập tiêu đề bài viết"
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
												onChange={handleChooseThumb}
												className="hidden"
											/>
										</label>
										{invalidField.thumb && (
											<p className="ml-1 mt-[2px] text-[14px] text-red-600">
												Vui lòng nhập trường này!
											</p>
										)}
										<div className="my-5">
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
								label="Viết nội dung bài viết"
								value={{ description: "" }}
								onChangeValue={onChangeValue}
								invalidField={invalidField}
								setInvalidField={setInvalidField}
								descriptionProduct={descriptionProduct}
							/>
							<Button
								styleCustom="px-3 py-1 bg-green-500 text-white rounded hover:opacity-80 my-[24px]"
								type="submit"
								title="Đăng bài"
							/>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default withBaseComponent(CreateBlog);
