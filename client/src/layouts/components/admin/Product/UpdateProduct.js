import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChooseImages } from "~/components/Admin/ManageProducts";
import { CustomInput, CustomSelect, MarkdownEditor } from "~/components/common";
import { appSelector } from "~/redux/selector";
import { schemasValidProduct } from "~/utils/schemasValid";
import icons from "~/utils/icons";
import { DotsAnimation } from "~/components/Animation";
import Swal from "sweetalert2";
import { apiUpdateProduct } from "~/apis";

const UpdateProduct = ({ dataUpdate, onHandleHide }) => {
	const { categories } = useSelector(appSelector);
	const { IoCloseOutline } = icons;

	const [isUploading, setIsUploading] = useState(false);
	const [brands, setBrands] = useState([]);
	const [descriptionProduct, setDescriptionProduct] = useState("");
	const [files, setFiles] = useState({
		thumb: "",
		images: [],
	});
	const [imagesInit, setImagesInit] = useState(dataUpdate.images || []);
	const [imagesNewCreate, setImagesNewCreate] = useState([]);

	const [previewCreate, setPreviewCreate] = useState([]);

	const [preview, setPreview] = useState({
		thumb: dataUpdate.thumb || "",
		images: imagesInit || [],
	});
	// Thể hiện trạng thái validate form
	const [invalidField, setInvalidField] = useState({
		description: false,
		thumb: false,
		images: false,
	});

	useEffect(() => {
		window.scrollTo(0, 0);
		setDescriptionProduct({
			description:
				typeof dataUpdate?.description === "object"
					? dataUpdate?.description?.join("")
					: dataUpdate?.description,
		});
	}, [dataUpdate]);

	// get data từ MarkDown
	const onChangeValue = useCallback(
		(value) => {
			setDescriptionProduct(value);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[descriptionProduct]
	);

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
		if (files.images.length > 0) {
			const arrPath = [];
			const arrCreateNewPreviewImg = [];
			for (let i of files.images) {
				const createSrcImg = URL.createObjectURL(i);
				arrPath.push(createSrcImg);
				arrCreateNewPreviewImg.push({
					name: i.name,
					path: createSrcImg,
				});
			}
			setImagesNewCreate(arrPath);

			setPreviewCreate((prev) => [...prev, ...arrCreateNewPreviewImg]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files]);

	useEffect(() => {
		return () => preview.thumb && URL.revokeObjectURL(preview.thumb);
	}, [preview.thumb]);

	useEffect(() => {
		return () => {
			if (previewCreate?.length > 0) {
				for (let i of previewCreate) {
					URL.revokeObjectURL(i.path);
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [previewCreate]);

	const handleRemoveFile = (file) => {
		if (files.images.length > 0 && !file.startsWith("https")) {
			console.log("remove file have path");

			const getNameByFile = previewCreate.find(
				(item) => item.path === file
			);

			setFiles((prev) => ({
				...prev,
				images: prev.images.filter(
					(item) => item.name !== getNameByFile?.name
				),
			}));

			const previewHandle = imagesNewCreate.filter(
				(files) => files !== file
			);

			setImagesNewCreate(previewHandle);

			URL.revokeObjectURL(file);
		} else {
			console.log("remove file not path");
			const finalImages = imagesInit.filter((item) => item !== file);
			setImagesInit(finalImages);
		}
	};

	useEffect(() => {
		setPreview((prev) => ({
			...prev,
			images: [...imagesInit, ...imagesNewCreate],
		}));
	}, [imagesInit, imagesNewCreate]);

	const initialValues = {
		name: dataUpdate.name,
		price: dataUpdate.price,
		color: dataUpdate.color,
		quantity: dataUpdate.quantity,
		category: dataUpdate.category,
	};
	const onSubmit = async (data, actions) => {
		if (descriptionProduct === "") {
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
		if (preview.images.length === 0) {
			setInvalidField((prev) => ({
				...prev,
				images: true,
			}));
		}
		if (
			descriptionProduct === "" ||
			preview.thumb === "" ||
			preview.images.length === 0
		)
			return;
		if (!data.brand) data.brand = dataUpdate.brand;

		const mergeObjects = {
			...data,
			description: descriptionProduct?.description
				? descriptionProduct.description
				: descriptionProduct,
			thumb: files.thumb !== "" ? files.thumb : preview.thumb,
		};

		console.log(mergeObjects);

		const formData = new FormData();
		for (let i of Object.entries(mergeObjects)) {
			formData.append(i[0], i[1]);
		}

		if (imagesInit.length > 0) {
			for (let i of imagesInit) {
				formData.append("initImages", i);
			}
		}

		if (files.images.length > 0) {
			const images = files.images;
			for (let i of images) {
				formData.append("images", i);
			}
		}

		setIsUploading(true);
		const response = await apiUpdateProduct(formData, dataUpdate._id);
		if (response.success) {
			actions.resetForm();
			setIsUploading(false);
			toast.success("Update product successfully!");
			setPreview({ thumb: null, images: null });
			setFiles({ thumb: "", images: [] });
			setImagesInit([]);
			setImagesNewCreate([]);
			setPreviewCreate([]);
			setDescriptionProduct("");
			onHandleHide({
				isShowLayout: false,
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

	const getIdChoose = (name) => {
		const result = categories?.filter((cate) => {
			return cate.name === name;
		});
		if (result) setBrands(result[0]?.brand);
	};

	return (
		<>
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
			<div className="flex items-center h-[40px] bg-gray-600 text-white px-5">
				Update products
			</div>
			<div className="px-5 py-3 bg-slate-100 flex-1">
				<Formik
					initialValues={initialValues}
					validationSchema={schemasValidProduct}
					onSubmit={onSubmit}
				>
					{({ handleSubmit }) => {
						return (
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
												{brands?.length > 0 &&
													Array.from([
														dataUpdate.brand,
														...brands?.filter(
															(brand) =>
																brand !==
																dataUpdate.brand
														),
													]).map((brand) => (
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
									<div className="row">
										<div className="col g-l-4 mb-2">
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
												selected={
													preview.images?.length || 0
												}
											/>
											{preview.images && (
												<div className="flex items-center gap-3 w-[806px] overflow-x-scroll">
													{preview.images?.map(
														(file) => (
															<div
																key={file}
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
																		size={
																			22
																		}
																		color="gray"
																	/>
																</i>
																<img
																	className="w-full h-full my-3 rounded-sm object-cover"
																	src={file}
																	alt="previewImages"
																/>
															</div>
														)
													)}
												</div>
											)}
										</div>
									</div>
								</div>

								<MarkdownEditor
									label="Description product"
									value={descriptionProduct}
									onChangeValue={onChangeValue}
									invalidField={invalidField}
									setInvalidField={setInvalidField}
									descriptionProduct={descriptionProduct}
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
		</>
	);
};

export default UpdateProduct;
