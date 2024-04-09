import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, CustomInput, CustomSelect } from "~/components/common";
import { schemasValidVariants } from "~/utils/schemasValid";
import { DotsAnimation } from "~/components/Animation";
import Swal from "sweetalert2";
import { apiAddVariants } from "~/apis";
import icons from "~/utils/icons";
import { optionsInternalMemory, optionsRam } from "~/utils/contains";

const CreateVariants = ({ variantsProduct, onHandleHide }) => {
	const { FaUpload } = icons;
	const [isUploading, setIsUploading] = useState(false);
	const [color, setColor] = useState("");
	const [thumb, setThumb] = useState("");
	const [preview, setPreview] = useState("");
	const [heightScroll, setHeightScroll] = useState(window.scrollY);

	const [invalidField, setInvalidField] = useState({
		thumb: false,
		color: false,
	});

	const getScroll = () => {
		window.addEventListener("scroll", () => {
			setHeightScroll(window.scrollY);
		});
	};

	useEffect(() => {
		getScroll();
	}, []);

	useEffect(() => {
		containerRef.current.style.marginTop = heightScroll + 120 + "px";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const containerRef = useRef();

	const initialValues = {
		price: "",
		quantity: "",
		ram: "",
		internalMemory: "",
	};

	const handleChooseThumb = (e) => {
		preview && URL.revokeObjectURL(preview);
		const checkInvalidFiles = Array.from(e.target.files).some((file) => {
			return (
				file.type === "image/jpeg" ||
				file.type === "image/png" ||
				file.type === "image/jpg"
			);
		});
		if (checkInvalidFiles) {
			setThumb(e.target.files[0]);
			setPreview(URL.createObjectURL(e.target.files[0]));
		} else {
			toast.warning("Định dạng file chưa được hỗ trợ, vui lòng chọn lại");
		}
	};

	const handleValidateFrom = () => {
		let result = true;
		if (!color) {
			result = false;
			setInvalidField((prev) => ({ ...prev, color: true }));
		}

		if (!thumb) {
			result = false;
			setInvalidField((prev) => ({ ...prev, thumb: true }));
		}
		return result;
	};

	const onSubmit = async (data, actions) => {
		const invalidFields = handleValidateFrom();
		if (invalidFields) {
			const payload = {
				...data,
				color,
			};

			const formData = new FormData();

			for (let i of Object.entries(payload)) {
				formData.append(i[0], i[1]);
			}

			if (thumb) {
				formData.append("thumb", thumb);
			}

			setIsUploading(true);
			const response = await apiAddVariants(
				formData,
				variantsProduct._id
			);

			if (response?.success) {
				setIsUploading(false);
				onHandleHide({
					isVariants: false,
					data: null,
				});
				toast.success("Thêm biến thể sản phẩm thành công");
			} else {
				setIsUploading(false);
				Swal.fire({
					title: "Hệ thống thông báo",
					text: "Có lỗi sảy ra, vui lòng thử lại sau",
					icon: "error",
				});
			}
		}
	};

	useEffect(() => {
		thumb && setInvalidField((prev) => ({ ...prev, thumb: false }));
		color && setInvalidField((prev) => ({ ...prev, color: false }));
	}, [thumb, color]);

	const handleCheckedColor = (e) => {
		const colorChecked = e.target.value;
		setColor(colorChecked);
	};

	return (
		<>
			{isUploading && (
				<div className="fixed top-0 right-0 bottom-0 left-[240px] bg-overlay z-[99999999] flex items-center justify-center">
					<h3 className="text-[20px] text-white">
						Đang thêm biến thể sản phẩm
					</h3>{" "}
					<i className="mt-[10px] ml-[-8px]">
						<DotsAnimation height={57} width={57} />
					</i>
				</div>
			)}
			<div
				ref={containerRef}
				className="flex justify-center animate-slideTopForm"
			>
				<div
					onClick={(e) => e.stopPropagation()}
					className=" p-3 bg-white border rounded-lg shadow-custom_1 max-w-[700px] "
				>
					<div className=" text-black font-semibold text-[20px]">
						<span>Thêm biến thể sản phẩm cho: </span>
						<span className="text-blue-600 text-[24px]">
							{variantsProduct.name}
						</span>
					</div>
					<div className="p-3  w-full">
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
												<div className="col g-l-12">
													<CustomInput
														name="price"
														type="number"
														label="Giá sản phẩm"
														placeholder="Nhập giá sản phẩm"
													/>
												</div>
												<div className="col g-l-12">
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
																	color ===
																	"Đen"
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
																	color ===
																	"Xanh lam"
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
																	color ===
																	"Xám"
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
																checked={
																	color ===
																	"Đỏ"
																}
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
																	color ===
																	"Hồng"
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
																	color ===
																	"Vàng"
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
																	color ===
																	"Trắng"
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
														<p className="ml-1 mt-[2px] text-[12px] text-red-600">
															Vui lòng chọn trường
															này!
														</p>
													)}
												</div>
												<div className="col g-l-12 mt-2">
													<CustomInput
														name="quantity"
														type="number"
														label="Số lượng"
														placeholder="Nhập số lượng sản phẩm"
													/>
												</div>
												<div className="col g-l-12">
													<CustomSelect
														name="ram"
														label="Dung lượng RAM"
													>
														<option>
															--Chọn dung lượng
															RAM--
														</option>
														{optionsRam?.map(
															(brand) => (
																<option
																	key={brand}
																	value={
																		brand
																	}
																>
																	{brand}
																</option>
															)
														)}
													</CustomSelect>
												</div>
												<div className="col g-l-12">
													<CustomSelect
														name="internalMemory"
														label="Dung lượng bộ nhớ trong"
													>
														<option className="text-gray-400">
															--Chọn dung lượng bộ
															nhớ trong--
														</option>
														{optionsInternalMemory?.map(
															(
																internalMemory
															) => (
																<option
																	key={
																		internalMemory
																	}
																	value={
																		internalMemory
																	}
																>
																	{
																		internalMemory
																	}
																</option>
															)
														)}
													</CustomSelect>
												</div>
												<div className="col g-l-12">
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
															preview ? 1 : 0
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
														<p className="ml-1 mt-[2px] text-[12px] text-red-600">
															Vui lòng nhập trường
															này!
														</p>
													)}
													<div className="mt-5">
														{preview && (
															<img
																loading="lazy"
																className="w-[140px] object-cover"
																src={preview}
																alt=""
															/>
														)}
													</div>
												</div>
											</div>
										</div>
										<div className="flex gap-3">
											<Button
												styleCustom="px-3 py-1 bg-green-500 text-white rounded hover:opacity-80 my-[24px]"
												type="submit"
												title="Tạo mới"
												handleClick={handleValidateFrom}
											/>
											<span
												onClick={() =>
													onHandleHide({
														isVariants: false,
														data: null,
													})
												}
												className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded hover:opacity-80 my-[24px]"
											>
												Back
											</span>
										</div>
									</Form>
								);
							}}
						</Formik>
					</div>
				</div>
			</div>
		</>
	);
};

export default CreateVariants;
