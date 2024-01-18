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
import { schemasValidCreateProduct } from "~/utils/schemasValid";
import { toast } from "react-toastify";
import icons from "~/utils/icons";
import { apiCreateProduct } from "~/apis";

function CreateProduct() {
	const { IoCloseOutline, FaUpload } = icons;
	const { categories } = useSelector(appSelector);
	const [brands, setBrands] = useState([]);
	const [descriptionProduct, setDescriptionProduct] = useState({
		description: "",
	});
	const [files, setFiles] = useState({
		thumb: "",
		images: null,
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
		if (descriptionProduct.description === "") {
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
		// actions.resetForm();
		const mergeObjects = { ...data, ...descriptionProduct };
		console.log(mergeObjects);
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

		const response = await apiCreateProduct(formData);
		console.log(response);
	};

	const getIdChoose = (name) => {
		const result = categories?.filter((cate) => {
			return cate.name === name;
		});
		if (result) setBrands(result[0]?.brand);
	};

	const handleUploadImages = (event) => {
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
				images: prev.images
					? [...prev.images, ...event.target.files]
					: [...event.target.files],
			}));
		} else {
			toast.warning("File not supported");
		}
	};

	const handleUploadThumb = (event) => {
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
	};

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
					URL.revokeObjectURL(i);
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
		URL.revokeObjectURL(file);
	};

	return (
		<div>
			<div className="flex items-center h-[40px] bg-gray-600 text-white px-3">
				Manage create new product
			</div>
			<div className="p-3 bg-gray-100 min-h-screen w-full">
				<Formik
					initialValues={initialValues}
					validationSchema={schemasValidCreateProduct}
					onSubmit={onSubmit}
				>
					{({ handleSubmit }) => (
						<Form onSubmit={handleSubmit}>
							<div className="flex gap-5 items-center">
								<div className="w-1/4">
									<CustomInput
										name="name"
										label="Name product"
										placeholder="Enter name product"
									/>
								</div>
								<div className="w-1/4">
									<CustomInput
										name="price"
										type="number"
										label="Price product"
										placeholder="Enter price product"
									/>
								</div>
								<div className="w-1/4">
									<CustomInput
										name="quantity"
										type="number"
										label="Quantity product"
										placeholder="Enter quantity product"
									/>
								</div>
								<div className="w-1/4">
									<CustomInput
										name="color"
										label="Color product"
										placeholder="Enter color product"
									/>
								</div>
							</div>
							<div className="flex gap-10">
								<div className="w-1/4">
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
								<div className="w-1/4">
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
							<div className="flex flex-col gap-3 mb-4 w-full">
								<div className="w-1/4">
									<h3 className="text-[16px] font-medium ml-2">
										Choose thumb product
									</h3>
									<div className="p-1 bg-white rounded-md border">
										<label
											className="text-[16px] font-medium ml-2 flex items-center gap-2"
											htmlFor="thumb"
										>
											<FaUpload /> {files.thumb ? 1 : 0}{" "}
											file selected
										</label>
										<input
											id="thumb"
											name="thumb"
											type="file"
											accept="image/jpeg, image/png"
											onChange={handleUploadThumb}
											hidden
										/>
										{invalidField.thumb &&
											files.thumb === "" && (
												<div className="text-[12px] text-main">
													Invalid field
												</div>
											)}
									</div>
								</div>
								{preview.thumb && (
									<img
										className="w-[140px] my-3 rounded-sm object-cover"
										src={preview.thumb}
										alt="previewThumb"
										accept="image/jpeg, image/png"
									/>
								)}
								<div className="w-1/4">
									<h3 className="text-[16px] font-medium ml-2">
										Choose thumb product
									</h3>

									<div className="p-1 bg-white rounded-md border">
										<label
											className="text-[16px] font-medium ml-2 flex items-center gap-2"
											htmlFor="images"
										>
											<FaUpload />{" "}
											{files.images
												? files.images.length
												: 0}{" "}
											file selected
										</label>
										<input
											id="images"
											name="images"
											type="file"
											multiple={true}
											onChange={handleUploadImages}
											hidden
										/>
										{invalidField.images &&
											files.images.length === 0 && (
												<div className="text-[12px] text-main">
													Invalid field
												</div>
											)}
									</div>
								</div>
								{preview.images && (
									<div className="flex items-center gap-3 w-[770px] overflow-x-scroll">
										{preview.images.map((file) => (
											<div
												key={file.name}
												className="relative max-w-[140px] w-full"
											>
												<i
													className="absolute top-3 right-0 p-1 cursor-pointer hover:opacity-70"
													onClick={() =>
														handleRemoveFile(file)
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
							<MarkdownEditor
								label="Description product"
								name="description"
								onChangeValue={onChangeValue}
								invalidField={invalidField}
								setInvalidField={setInvalidField}
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
