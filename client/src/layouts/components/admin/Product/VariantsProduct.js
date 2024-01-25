import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChooseImages } from "~/components/Admin/ManageProducts";
import { CustomInput } from "~/components/common";
import { schemasValidVariants } from "~/utils/schemasValid";
import icons from "~/utils/icons";
import { DotsAnimation } from "~/components/Animation";
import Swal from "sweetalert2";
import { apiVariantsProduct } from "~/apis";

const VariantsProduct = ({ variantsProduct, onHandleHide }) => {
	const { IoCloseOutline } = icons;
	const [isUploading, setIsUploading] = useState(false);
	const [files, setFiles] = useState({
		thumb: "",
		images: [],
	});

	const [preview, setPreview] = useState({
		thumb: "",
		images: [],
	});
	// Thể hiện trạng thái validate form
	const [invalidField, setInvalidField] = useState({
		description: false,
		thumb: false,
		images: false,
	});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [variantsProduct]);

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

	const initialValues = {
		name: variantsProduct.name || "",
		price: variantsProduct.price || "",
		color: variantsProduct.color || "",
	};
	const onSubmit = async (data, actions) => {
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
		if (files.thumb === "" || files.images.length === 0) {
			return;
		}

		if (data.color === variantsProduct.color) {
			Swal.fire(
				"Oops!",
				"Color variants already, please choose a different color",
				"error"
			);
			return;
		}

		const formData = new FormData();
		for (let i of Object.entries(data)) {
			formData.append(i[0], i[1]);
		}
		if (files.thumb) formData.append("thumb", files.thumb);
		if (files.images) {
			for (let i of files.images) {
				formData.append("images", i);
			}
		}

		setIsUploading(true);
		const response = await apiVariantsProduct(
			formData,
			variantsProduct._id
		);
		if (response.success) {
			setIsUploading(false);
			toast.success("Created variants product successfully!");
			setPreview({ thumb: null, images: null });
			setFiles({ thumb: "", images: [] });
		} else {
			setIsUploading(false);
			Swal.fire(
				"Oops!",
				"Something went wrong, please try again",
				"error"
			);
		}
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
				Variants products
			</div>
			<div className="px-5 py-3 bg-slate-100 flex-1">
				<Formik
					initialValues={initialValues}
					validationSchema={schemasValidVariants}
					onSubmit={onSubmit}
				>
					{({ handleSubmit }) => {
						return (
							<Form onSubmit={handleSubmit}>
								<div className="grid wide">
									<div className="row">
										<div className="col g-l-4">
											<CustomInput
												name="name"
												label="Name product"
												placeholder="Enter name product"
											/>
										</div>
										<div className="col g-l-4">
											<CustomInput
												name="price"
												type="number"
												label="Price product"
												placeholder="Enter price product"
											/>
										</div>
										<div className="col g-l-4">
											<CustomInput
												name="color"
												label="Color product"
												placeholder="Enter color product"
											/>
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
												selected={
													preview.images?.length || 0
												}
											/>
											{preview.images && (
												<div className="flex items-center gap-3 w-[806px] overflow-x-scroll">
													{preview.images.map(
														(file) => (
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
																		size={
																			22
																		}
																		color="gray"
																	/>
																</i>
																<img
																	className="w-full h-full my-3 rounded-sm object-cover"
																	src={
																		file.path
																	}
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
							isVariants: false,
							data: null,
						})
					}
				/>
			</div>
		</>
	);
};

export default VariantsProduct;
