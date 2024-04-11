import { appSelector } from "~/redux/selector";
import { useSelector } from "react-redux";
import icons from "~/utils/icons";
import { Slider } from "~/components/Slider";
import { SwiperSlide } from "swiper/react";

import { useEffect, useRef, useState } from "react";
import { CreateSlide } from "~/layouts/components/admin/Slider";
import { toast } from "react-toastify";
import { apiUpdateSlide } from "~/apis";
import { DotsAnimation } from "~/components/Animation";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import { getSlide } from "~/redux/asyncActions";

const ManageSlide = ({ dispatch }) => {
	const { slides } = useSelector(appSelector);
	const { GoPlus, FaRegEdit, IoCloseOutline } = icons;
	const inputFileRef = useRef();

	const [preview, setPreview] = useState([]);
	const [images, setImages] = useState([]);
	const [imagesAddNew, setImagesAddNew] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [isEdit, setIsEdit] = useState(false);
	const [isCreateNew, setIsCreateNew] = useState(false);
	const [resetImages, setResetImages] = useState(false);

	useEffect(() => {
		if (slides) {
			setPreview([...slides[0].images]);
			setImages([...slides[0].images]);
		}
	}, [slides]);

	useEffect(() => {
		return () => {
			if (images?.length > 0) {
				for (let i of preview) {
					URL.revokeObjectURL(i.path);
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetImages]);

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

			const previewImg = [];
			for (let i of e.target.files) {
				const createLink = URL.createObjectURL(i);
				previewImg.push({ name: i.name, path: createLink });
			}

			setImagesAddNew((prev) => [...prev, ...e.target.files]);
			setPreview((prev) => [...prev, ...previewImg]);
		} else {
			toast.warning("Định dạng file chưa được hỗ trợ, vui lòng chọn lại");
		}
	};

	const handleRemove = (file) => {
		console.log(file);
		if (imagesAddNew.length > 0 && typeof file === "object") {
			inputFileRef.current.value = "";

			setImagesAddNew(imagesAddNew.filter((image) => image !== file));
			setPreview(preview?.filter((image) => image !== file));

			URL.revokeObjectURL(file.path);
		} else {
			setImages(images.filter((image) => image !== file));
			setPreview(preview.filter((image) => image !== file));
		}
	};

	const handleSaveUpdate = async () => {
		const formData = new FormData();

		if (
			images.length === slides[0].images.length &&
			imagesAddNew.length === 0
		) {
			setIsEdit(false);
			return;
		}

		if (images.length === 0 && imagesAddNew.length === 0) {
			toast.error("Hình ảnh không được bỏ trống");
			return;
		}

		if (slides) {
			formData.append("sid", slides[0]._id);
		}

		if (images.length > 0) {
			for (let i of images) {
				formData.append("defaultImages", i);
			}
		}

		if (imagesAddNew.length > 0) {
			for (let i of imagesAddNew) {
				formData.append("images", i);
			}
		}

		setIsLoading(true);
		const response = await apiUpdateSlide(formData);

		if (response.success) {
			setIsLoading(false);
			dispatch(getSlide());
			setResetImages(!resetImages);
			setImagesAddNew([]);
			toast.success("Sản phẩm đã được cập nhật");
		} else {
			setIsLoading(false);
			toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
		}
	};

	return (
		<div className="p-5 bg-[#f6f8fb] min-h-screen">
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
			{isCreateNew && (
				<div
					className={`absolute top-0 right-0 bottom-0 left-0 z-40 min-h-screen bg-[#f6f8fb]`}
				>
					<CreateSlide onHide={setIsCreateNew} />
				</div>
			)}

			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center justify-between text-black font-semibold text-[24px]">
					<span>Quản lý slider</span>
					<div
						onClick={() => setIsCreateNew(true)}
						className=" flex items-center gap-1 text-[14px] px-5 py-2 border bg-blue-500 text-white shadow-custom_1 rounded-lg cursor-pointer hover:translate-y-[2px] ease-in-out"
					>
						<GoPlus size={24} color="white" />
						<span>Thêm mới</span>
					</div>
				</h3>

				<div className=" mx-auto my-5 p-4 border rounded-md shadow-custom_1 max-w-[700px]">
					<Slider showLg={1} showMd={1} showSm={1}>
						{slides &&
							slides[0]?.images?.map((item) => (
								<SwiperSlide key={item}>
									<div className="rounded-lg overflow-hidden w-full">
										<img
											loading="lazy"
											src={item}
											alt=""
											className="w-full h-full object-contain"
										/>
									</div>
								</SwiperSlide>
							))}
					</Slider>
				</div>

				<div>
					<div className="flex justify-between items-center border-b py-2">
						<h3 className="text-[24px] font-medium">Hình ảnh</h3>
						{!isEdit ? (
							<div
								onClick={() => {
									setIsEdit(true);
								}}
								className=" flex items-center justify-center gap-1 text-[14px] w-[120px] h-[40px]  border bg-blue-500 text-white shadow-custom_1 rounded-lg cursor-pointer hover:translate-y-[2px] ease-in-out"
							>
								<FaRegEdit size={24} color="white" />
								<span>Chỉnh sửa</span>
							</div>
						) : (
							<div
								onClick={() => {
									setIsEdit(false);
									handleSaveUpdate();
								}}
								className=" flex items-center justify-center gap-1 text-[14px] w-[120px] h-[40px]  border bg-green-500 text-white shadow-custom_1 rounded-lg cursor-pointer hover:translate-y-[2px] ease-in-out"
							>
								<FaRegEdit size={24} color="white" />
								<span>Lưu lại</span>
							</div>
						)}
					</div>
					<div className="grid wide">
						<div className="row">
							{preview?.map((item, i) => (
								<div key={i} className="col g-l-4 mt-4">
									<div className="relative  w-[full] shadow-custom p-1">
										<img
											loading="lazy"
											src={item.path || item}
											alt=""
											className="w-full h-full object-contain"
										/>
										{isEdit && (
											<i
												onClick={() =>
													handleRemove(item)
												}
												className="absolute top-[10px] right-[10px] cursor-pointer hover:opacity-70"
											>
												<IoCloseOutline size={22} />
											</i>
										)}
									</div>
								</div>
							))}
							<div className="col g-l-4 mt-4">
								<div className="relative  w-[full] min-h-[169px]  shadow-custom p-1  hover:opacity-80">
									<label
										htmlFor="addNewImg"
										onClick={() => setIsEdit(true)}
										className=" cursor-pointer w-full min-h-[169px] bg-[#f1f1f1] flex items-center justify-center "
									>
										<GoPlus size={50} color="gray" />
									</label>
									<input
										ref={inputFileRef}
										onChange={handleChooseImages}
										id="addNewImg"
										type="file"
										multiple
										hidden
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBaseComponent(ManageSlide);
