import { useCallback, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import {
	CustomInput,
	CustomSelect,
	Button,
	MarkdownEditor,
} from "~/components/common";
import { appSelector } from "~/redux/selector";
import { schemasValidProduct } from "~/utils/schemasValid";
import { toast } from "react-toastify";
import icons from "~/utils/icons";
import { apiCreateProduct } from "~/apis";
import { ChooseImages } from "~/components/Admin/ManageProducts";
import { DotsAnimation } from "~/components/Animation";
import Swal from "sweetalert2";

function CreateProduct() {
	const { IoCloseOutline } = icons;
	const { categories } = useSelector(appSelector);
	const [isUploading, setIsUploading] = useState(false);
	const [brands, setBrands] = useState([]);
	const [descriptionProduct, setDescriptionProduct] = useState("");
	const [files, setFiles] = useState({
		thumb: "",
		images: [],
	});
	// Thể hiện trạng thái validate form
	const [invalidField, setInvalidField] = useState({
		description: false,
		thumb: false,
		images: false,
	});
	const [preview, setPreview] = useState({
		thumb: null,
		images: null,
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
		name: "",
		price: "",
		color: "",
		quantity: "",
		category: "",
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
		if (files.images.length === 0) {
			setInvalidField((prev) => ({
				...prev,
				images: true,
			}));
		}
		if (
			descriptionProduct === "" ||
			files.thumb === "" ||
			files.images.length === 0
		)
			return;
		const mergeObjects = { ...data, description: descriptionProduct };

		const formData = new FormData();
		for (let i of Object.entries(mergeObjects)) {
			formData.append(i[0], i[1]);
		}
		if (files.thumb) formData.append("thumb", files.thumb);
		if (files.images) {
			for (let i of files.images) {
				formData.append("images", i);
			}
		}

		setIsUploading(true);
		const response = await apiCreateProduct(formData);
		if (response.success) {
			actions.resetForm();
			setIsUploading(false);
			toast.success("Created product successfully!");
			setPreview({ thumb: null, images: null });
			setFiles({ thumb: "", images: [] });
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

	const getIdChoose = (name) => {
		const result = categories?.filter((cate) => {
			return cate.name === name;
		});
		if (result) setBrands(result[0]?.brand);
	};

	const handleUploadImages = useCallback(
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
					...prev,
					images: [...prev.images, ...event.target.files],
				}));
			} else {
				toast.warning("File not supported");
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[files.images]
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
				setFiles((prev) => ({
					...prev,
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
			setPreview((prev) => ({
				...prev,
				thumb: URL.createObjectURL(files.thumb),
			}));
		}
		if (files.images) {
			const arr = [];
			for (let i of files.images) {
				const createSrcImg = URL.createObjectURL(i);
				arr.push({ name: i.name, path: createSrcImg });
			}
			setPreview((prev) => ({
				...prev,
				images: arr,
			}));
		}
	}, [files]);

	useEffect(() => {
		return () => preview.thumb && URL.revokeObjectURL(preview.thumb);
	}, [preview.thumb]);

	useEffect(() => {
		return () => {
			if (preview.images?.length > 0) {
				for (let i of preview.images) {
					URL.revokeObjectURL(i.path);
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preview.images]);

	const handleRemoveFile = (file) => {
		setFiles((prev) => ({
			...prev,
			images: prev.images.filter((item) => item.name !== file.name),
		}));

		const finalPreview = preview.images.filter(
			(files) => files !== file.path
		);
		setPreview((prev) => ({
			...prev,
			images: finalPreview,
		}));
		URL.revokeObjectURL(file.path);
	};

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
				Manage create new product
			</div>
			<div className="p-3 bg-gray-100 min-h-screen w-full">
				<Formik
					initialValues={initialValues}
					validationSchema={schemasValidProduct}
					onSubmit={onSubmit}
				>
					{({ handleSubmit }) => (
						<Form onSubmit={handleSubmit}>
							<div className="grid wide">
								<div className="row">
									<div className="col g-l-3">
										<CustomInput
											name="name"
											label="Name product"
											placeholder="Enter name product"
										/>
									</div>
									<div className="col g-l-3">
										<CustomInput
											name="price"
											type="number"
											label="Price product"
											placeholder="Enter price product"
										/>
									</div>
									<div className="col g-l-3">
										<CustomInput
											name="quantity"
											type="number"
											label="Quantity product"
											placeholder="Enter quantity product"
										/>
									</div>
									<div className="col g-l-3">
										<CustomInput
											name="color"
											label="Color product"
											placeholder="Enter color product"
										/>
									</div>
									<div className="col g-l-3">
										<CustomSelect
											name="category"
											label="Category product"
											getIdChoose={getIdChoose}
										>
											<option value="">
												--Choose category for product--
											</option>
											{categories?.map((cate) => (
												<option
													key={cate._id}
													value={cate.name}
												>
													{cate.name}
												</option>
											))}
										</CustomSelect>
									</div>
									<div className="col g-l-3">
										<CustomSelect
											name="brand"
											label="Brand product (optional)"
										>
											<option>
												--Choose brand for product--
											</option>
											{brands?.length > 0 &&
												brands?.map((brand) => (
													<option
														key={brand}
														value={brand}
													>
														{brand}
													</option>
												))}
										</CustomSelect>
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col g-l-4">
									<ChooseImages
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
								<div className="col g-l-8">
									<ChooseImages
										invalidField={invalidField}
										id="images"
										files={files}
										onUpload={handleUploadImages}
										multiple
										selected={preview.images?.length || 0}
									/>
									{preview.images && (
										<div className="flex items-center gap-3 w-[806px] overflow-x-scroll">
											{preview.images.map((file) => (
												<div
													key={file.name}
													className="relative min-w-[140px] max-w-[140px]"
												>
													<i
														className="absolute top-3 right-0 p-1 cursor-pointer hover:opacity-70"
														onClick={() =>
															handleRemoveFile(
																file
															)
														}
													>
														<IoCloseOutline
															size={22}
															color="gray"
														/>
													</i>
													<img
														className="w-full h-full my-3 rounded-sm object-cover"
														src={file.path}
														alt="previewImages"
													/>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
							<MarkdownEditor
								label="Description product"
								value={{ description: "" }}
								onChangeValue={onChangeValue}
								invalidField={invalidField}
								setInvalidField={setInvalidField}
								descriptionProduct={descriptionProduct}
							/>
							<Button
								styleCustom="px-3 py-1 bg-green-500 text-white rounded hover:opacity-80 my-[24px]"
								type="submit"
								title="Create new product"
							/>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default CreateProduct;
