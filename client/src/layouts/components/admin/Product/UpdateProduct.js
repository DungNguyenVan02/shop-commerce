import { useCallback, useEffect, useRef, useState } from "react";
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
import { apiUpdateProduct } from "~/apis";
import { DotsAnimation } from "~/components/Animation";
import Swal from "sweetalert2";
import { optionsInternalMemory, optionsRam } from "~/utils/contains";

function UpdateProduct({ dataUpdate, onHandleHide }) {
	const { IoCloseOutline, FaUpload } = icons;
	const { categories } = useSelector(appSelector);
	const [isLoading, setIsLoading] = useState(false);
	const [color, setColor] = useState(dataUpdate?.color);
	const [brands, setBrands] = useState([]);

	const inputFileRef = useRef();

	const [description, setDescription] = useState(dataUpdate?.description);

	const [resetImages, setResetImages] = useState(false);

	const [previewImagesNew, setPreviewImagesNew] = useState([]);
	const [defaultImages, setDefaultImages] = useState({
		thumb: dataUpdate?.thumb,
		images: dataUpdate?.images,
	});

	const [images, setImages] = useState({
		thumb: null,
		images: [],
	});

	const [preview, setPreview] = useState({
		thumb: dataUpdate.thumb || "",
		images: dataUpdate.images || [],
	});

	// Thể hiện trạng thái validate form
	const [invalidField, setInvalidField] = useState({
		description: false,
		thumb: false,
		images: false,
		color: false,
	});

	// get data từ MarkDown
	const onChangeValue = useCallback(
		(value) => {
			setDescription(value);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[description]
	);

	const initialValues = {
		name: dataUpdate?.name || "",
		price: dataUpdate?.price || "",
		quantity: dataUpdate?.quantity || "",
		category: dataUpdate?.category || "",
		brand: dataUpdate?.brand || "",
		ram: dataUpdate?.ram || "",
		internalMemory: dataUpdate?.internalMemory || "",
		discount: dataUpdate?.discount === 0 ? 0 : dataUpdate?.discount,
	};

	const handleValidateFrom = () => {
		let result = true;
		if (!color) {
			result = false;
			setInvalidField((prev) => ({ ...prev, color: true }));
		}
		if (!description) {
			result = false;
			setInvalidField((prev) => ({ ...prev, description: true }));
		}
		if (!preview.thumb) {
			result = false;
			setInvalidField((prev) => ({ ...prev, thumb: true }));
		}
		if (!preview.images.length === 0) {
			result = false;
			setInvalidField((prev) => ({ ...prev, images: true }));
		}
		return result;
	};

	const onSubmit = async (data, actions) => {
		const invalidFields = handleValidateFrom();
		if (invalidFields) {
			const payload = {
				...data,
				description: description,
				color: color,
			};

			const formData = new FormData();
			for (let i of Object.entries(payload)) {
				formData.append(i[0], i[1]);
			}
			if (images?.thumb) {
				formData.append("thumb", images.thumb);
			} else {
				formData.append("defaultThumb", defaultImages.thumb);
			}

			if (images.images.length > 0 && defaultImages.images.length === 0) {
				for (let i of images.images) {
					formData.append("images", i);
				}
			}

			if (images.images.length > 0 && defaultImages.images.length > 0) {
				for (let i of images.images) {
					formData.append("images", i);
				}
				for (let i of defaultImages.images) {
					formData.append("defaultImages", i);
				}
			}

			if (images.images.length === 0 && defaultImages.images.length > 0) {
				for (let i of defaultImages.images) {
					formData.append("defaultImages", i);
				}
			}

			setIsLoading(true);
			const response = await apiUpdateProduct(formData, dataUpdate?._id);

			if (response?.success) {
				setIsLoading(false);
				onHandleHide({
					isUpdate: false,
					data: null,
				});
				toast.success("Sản phẩm đã được cập nhật");
			} else {
				setIsLoading(false);
				Swal.fire({
					title: "Hệ thống thông báo",
					text: "Có lỗi sảy ra, vui lòng thử lại sau",
					icon: "error",
				});
			}
		}
	};

	const getIdChoose = (name) => {
		const result = categories?.filter((cate) => {
			return cate.name === name;
		});
		if (result) setBrands(result[0]?.brand);
	};

	const handleChooseThumb = (e) => {
		const checkInvalidFiles = Array.from(e.target.files).some((file) => {
			return (
				file.type === "image/jpeg" ||
				file.type === "image/png" ||
				file.type === "image/jpg"
			);
		});
		if (checkInvalidFiles) {
			setImages((prev) => ({ ...prev, thumb: e.target.files[0] }));
			setPreview((prev) => ({
				...prev,
				thumb: URL.createObjectURL(e.target.files[0]),
			}));
		} else {
			toast.warning("Định dạng file chưa được hỗ trợ, vui lòng chọn lại");
		}
	};
	const handleChooseImages = (e) => {
		const checkInvalidFiles = Array.from(e.target.files).some((file) => {
			return (
				file.type === "image/jpeg" ||
				file.type === "image/png" ||
				file.type === "image/jpg"
			);
		});

		if (checkInvalidFiles) {
			setResetImages(!resetImages);

			setImages((prev) => ({
				...prev,
				images: [...e.target.files],
			}));

			const previewImg = [];
			for (let i of e.target.files) {
				const createLink = URL.createObjectURL(i);
				previewImg.push({ name: i.name, path: createLink });
			}

			setPreviewImagesNew(previewImg);
		} else {
			toast.warning("Định dạng file chưa được hỗ trợ, vui lòng chọn lại");
		}
	};

	useEffect(() => {
		images.thumb && setInvalidField((prev) => ({ ...prev, thumb: false }));
		images.images.length > 0 &&
			setInvalidField((prev) => ({ ...prev, images: false }));
		color && setInvalidField((prev) => ({ ...prev, color: false }));
		description &&
			setInvalidField((prev) => ({ ...prev, description: false }));
	}, [description, images, color]);

	useEffect(() => {
		setPreview((prev) => ({
			...prev,
			images: [...previewImagesNew, ...defaultImages.images],
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images.images, defaultImages.images]);

	useEffect(() => {
		return () => preview.thumb && URL.revokeObjectURL(preview.thumb);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images.thumb]);

	useEffect(() => {
		return () => {
			if (images.images?.length > 0) {
				for (let i of preview.images) {
					URL.revokeObjectURL(i.path);
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetImages]);

	const handleRemoveFile = (file) => {
		if (images.images.length > 0 && typeof file === "object") {
			inputFileRef.current.value = "";

			const filterPreviewNewImg = previewImagesNew.filter(
				(image) => image !== file
			);

			const filterCreateNewImg = images.images.filter(
				(image) => image.name !== file.name
			);

			setPreviewImagesNew(filterPreviewNewImg);

			setImages((prev) => ({
				...prev,
				images: filterCreateNewImg,
			}));

			URL.revokeObjectURL(file.path);
		} else {
			const finalImages = defaultImages.images.filter(
				(item) => item !== file
			);
			setDefaultImages((prev) => ({ ...prev, images: finalImages }));
		}
	};
	const handleCheckedColor = (e) => {
		const colorChecked = e.target.value;
		setColor(colorChecked);
	};

	return (
		<div className="p-5 ">
			{isLoading && (
				<div className="fixed top-0 right-0 bottom-0 left-0 bg-overlay z-[99999999] flex items-center justify-center">
					<h3 className="text-[20px] text-white">
						Đang cập nhật sản phẩm
					</h3>{" "}
					<i className="mt-[10px] ml-[-8px]">
						<DotsAnimation height={57} width={57} />
					</i>
				</div>
			)}
			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center text-black font-semibold text-[24px]">
					Cập nhật sản phẩm
				</h3>
				<div className="p-3  min-h-screen w-full">
					<Formik
						initialValues={initialValues}
						validationSchema={schemasValidProduct}
						onSubmit={onSubmit}
					>
						{({ handleSubmit }) => (
							<Form onSubmit={handleSubmit}>
								<div className="grid wide">
									<div className="row">
										<div className="col g-l-4">
											<CustomInput
												name="name"
												label="Tên sản phẩm"
												placeholder="Nhập tên sản phẩm"
											/>
										</div>
										<div className="col g-l-4">
											<CustomInput
												name="price"
												type="number"
												label="Giá sản phẩm"
												placeholder="Nhập giá sản phẩm"
											/>
										</div>
										<div className="col g-l-4">
											<CustomInput
												name="quantity"
												type="number"
												label="Số lượng"
												placeholder="Nhập số lượng"
											/>
										</div>
										<div className="col g-l-6">
											<label className="text-[16px] font-medium ml-2">
												Màu sắc
											</label>
											<div
												className={`flex items-center h-[34px] border gap-2 px-2  rounded-md ${
													invalidField.color
														? "bg-red-100 border-main"
														: "bg-white"
												}`}
											>
												<div className="flex items-center gap-1">
													<input
														onChange={(e) =>
															handleCheckedColor(
																e
															)
														}
														checked={
															color === "Đen"
														}
														value="Đen"
														id="black-checkbox"
														className="w-[20px] h-[20px]  rounded-full  bg-black  accent-black"
														type="radio"
													/>
													<label htmlFor="black-checkbox">
														Black
													</label>
												</div>
												<div className="flex items-center gap-1">
													<input
														onChange={(e) =>
															handleCheckedColor(
																e
															)
														}
														checked={
															color ===
															"Xanh dương"
														}
														value="Xanh dương"
														id="blue-checkbox"
														className="w-[20px] h-[20px]  rounded-full  bg-blue-700  accent-bg-blue-700"
														type="radio"
													/>
													<label htmlFor="blue-checkbox">
														Blue
													</label>
												</div>
												<div className="flex items-center gap-1">
													<input
														onChange={(e) =>
															handleCheckedColor(
																e
															)
														}
														checked={
															color === "Xanh lam"
														}
														value="Xanh lam"
														id="green-checkbox"
														className="w-[20px] h-[20px]   bg-green-700  accent-green-700"
														type="radio"
													/>
													<label htmlFor="green-checkbox">
														Green
													</label>
												</div>
												<div className="flex items-center gap-1">
													<input
														onChange={(e) =>
															handleCheckedColor(
																e
															)
														}
														checked={
															color === "Xám"
														}
														value="Xám"
														id="gray-checkbox"
														className="w-[20px] h-[20px]  rounded-full  bg-gray-700  accent-gray-700"
														type="radio"
													/>
													<label htmlFor="gray-checkbox">
														Gray
													</label>
												</div>
												<div className="flex items-center gap-1">
													<input
														onChange={(e) =>
															handleCheckedColor(
																e
															)
														}
														checked={color === "Đỏ"}
														value="Đỏ"
														id="red-checkbox"
														className="w-[20px] h-[20px]  rounded-full  bg-red-700  accent-red-700"
														type="radio"
													/>
													<label htmlFor="red-checkbox">
														Red
													</label>
												</div>
												<div className="flex items-center gap-1">
													<input
														onChange={(e) =>
															handleCheckedColor(
																e
															)
														}
														checked={
															color === "Hồng"
														}
														value="Hồng"
														id="pink-checkbox"
														className="w-[20px] h-[20px] border  rounded-full  bg-pink-500  accent-pink-500"
														type="radio"
													/>
													<label htmlFor="pink-checkbox">
														Pink
													</label>
												</div>
												<div className="flex items-center gap-1">
													<input
														onChange={(e) =>
															handleCheckedColor(
																e
															)
														}
														checked={
															color === "Vàng"
														}
														value="Vàng"
														id="yellow-checkbox"
														className="w-[20px] h-[20px] border  rounded-full  bg-yellow-300  accent-yellow-300"
														type="radio"
													/>
													<label htmlFor="yellow-checkbox">
														Yellow
													</label>
												</div>
												<div className="flex items-center gap-1">
													<input
														onChange={(e) =>
															handleCheckedColor(
																e
															)
														}
														checked={
															color === "Trắng"
														}
														value="Trắng"
														id="white-checkbox"
														className="w-[20px] h-[20px] border   rounded-full  bg-white  accent-white"
														type="radio"
													/>
													<label htmlFor="white-checkbox">
														White
													</label>
												</div>
											</div>
											{invalidField.color && (
												<p className="ml-1 mt-[2px] text-[14px] text-red-600">
													Vui lòng chọn trường này!
												</p>
											)}
										</div>
										<div className="col g-l-3">
											<CustomSelect
												name="category"
												label="Danh mục sản phẩm"
												getIdChoose={getIdChoose}
											>
												<option value="">
													--Chọn danh mục sản phẩm--
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
												label="Thương hiệu sản phẩm"
											>
												<option>
													--Chọn thương hiệu sản
													phẩm--
												</option>

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

										<div className="col g-l-3">
											<CustomSelect
												name="ram"
												label="Dung lượng RAM"
											>
												<option>
													--Chọn dung lượng RAM--
												</option>
												{optionsRam?.map((brand) => (
													<option
														key={brand}
														value={brand}
													>
														{brand}
													</option>
												))}
											</CustomSelect>
										</div>
										<div className="col g-l-3">
											<CustomSelect
												name="internalMemory"
												label="Dung lượng bộ nhớ trong"
											>
												<option>
													--Chọn dung lượng bộ nhớ
													trong--
												</option>
												{optionsInternalMemory?.map(
													(internalMemory) => (
														<option
															key={internalMemory}
															value={
																internalMemory
															}
														>
															{internalMemory}
														</option>
													)
												)}
											</CustomSelect>
										</div>
										<div className="col g-l-3">
											<CustomInput
												name="discount"
												type="number"
												label="Giảm giá"
												placeholder="Nhập giảm giá sản phẩm"
											/>
										</div>
									</div>
								</div>

								<div className="row">
									<div className="col g-l-4">
										<h4 className=" font-medium px-3 text-[16px]">
											Thumbnail
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
									<div className="col g-l-8">
										<h4 className=" font-medium px-3 text-[16px]">
											Hình ảnh sản phẩm
										</h4>
										<label
											htmlFor="selectImages"
											className={`cursor-pointer border h-[40px] flex items-center ${
												invalidField.images
													? "bg-red-100 border-main"
													: "bg-white"
											} px-5 rounded-md`}
										>
											<FaUpload />
											<span className=" ml-2">{`Đã chọn ${preview.images.length}`}</span>
											<input
												ref={inputFileRef}
												id="selectImages"
												className="hidden"
												type="file"
												multiple
												onChange={handleChooseImages}
											/>
										</label>
										{invalidField.images && (
											<p className="ml-1 mt-[2px] text-[14px] text-red-600">
												Vui lòng nhập trường này!
											</p>
										)}
										<div className="mt-5 flex gap-3 overflow-x-auto w-full">
											{preview.images.length > 0 &&
												preview.images.map(
													(image, i) => {
														return (
															<div
																key={i}
																className="relative min-w-[140px]"
															>
																<img
																	loading="lazy"
																	className="w-[140px] object-cover"
																	src={
																		image.path ||
																		image
																	}
																	alt=""
																/>
																<i
																	className="absolute top-0 right-[10px] cursor-pointer hover:opacity-90"
																	onClick={() =>
																		handleRemoveFile(
																			image
																		)
																	}
																>
																	<IoCloseOutline
																		size={
																			20
																		}
																	/>
																</i>
															</div>
														);
													}
												)}
										</div>
									</div>
								</div>
								<MarkdownEditor
									label="Mô tả sản phẩm"
									value={description}
									onChangeValue={onChangeValue}
									invalidField={invalidField}
									setInvalidField={setInvalidField}
								/>
								<Button
									styleCustom="px-3 py-1 bg-green-500 text-white rounded hover:opacity-80 my-[24px]"
									type="submit"
									title="Cập nhật sản phẩm"
									handleClick={handleValidateFrom}
								/>
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
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
}

export default UpdateProduct;
