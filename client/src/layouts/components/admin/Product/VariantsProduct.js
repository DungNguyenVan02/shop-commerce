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
	});

	const [preview, setPreview] = useState({
		thumb: "",
	});
	// Thể hiện trạng thái validate form
	const [invalidField, setInvalidField] = useState({
		thumb: false,
	});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [variantsProduct]);

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
	}, [files]);

	useEffect(() => {
		return () => preview.thumb && URL.revokeObjectURL(preview.thumb);
	}, [preview.thumb]);

	const initialValues = {
		price: variantsProduct.price || "",
		color: variantsProduct.color || "",
		quantity: variantsProduct.quantity || "",
	};
	const onSubmit = async (data, actions) => {
		if (files.thumb === "") {
			setInvalidField({
				thumb: true,
			});
		}

		if (files.thumb === "") {
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

		setIsUploading(true);
		const response = await apiVariantsProduct(
			formData,
			variantsProduct._id
		);
		if (response.success) {
			setIsUploading(false);
			toast.success("Created variants product successfully!");
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
										<div className="col g-l-4">
											<CustomInput
												name="quantity"
												type="number"
												label="Quantity product"
												placeholder="Enter quantity product"
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
