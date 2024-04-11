import React, { useEffect, useRef, useState } from "react";
import icons from "~/utils/icons";
import { toast } from "react-toastify";
import { apiCreateSlide } from "~/apis";
import { DotsAnimation } from "~/components/Animation";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import { getSlide } from "~/redux/asyncActions";

const CreateSlide = ({ onHide, dispatch }) => {
	const { IoCloseOutline, FaUpload, GoPlus } = icons;
	const [invalidField, setInvalidField] = useState(false);
	const inputFileRef = useRef();
	const [resetImages, setResetImages] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [images, setImages] = useState([]);

	const [preview, setPreview] = useState([]);

	useEffect(() => {
		images.length > 0 && setInvalidField(false);
	}, [images]);

	useEffect(() => {
		return () => {
			if (preview?.length > 0) {
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

		for (let i of images) {
			URL.revokeObjectURL(i.path);
		}
		if (checkInvalidFiles) {
			setResetImages(!resetImages);

			setImages([...e.target.files]);

			const previewImg = [];
			for (let i of e.target.files) {
				const createLink = URL.createObjectURL(i);
				previewImg.push({ name: i.name, path: createLink });
			}

			setPreview(previewImg);
		} else {
			toast.warning("Định dạng file chưa được hỗ trợ, vui lòng chọn lại");
		}
	};

	const handleRemoveFile = (file) => {
		URL.revokeObjectURL(file.path);

		inputFileRef.current.value = "";

		setImages((prev) => prev.filter((item) => item.name !== file.name));

		setPreview((prev) => prev.filter((item) => item.name !== file.name));
	};

	const handleCreate = async () => {
		if (images.length === 0) {
			setInvalidField(true);
			return;
		} else {
			const formData = new FormData();

			for (let i of images) {
				formData.append("images", i);
			}
			setIsLoading(true);
			const response = await apiCreateSlide(formData);
			if (response.success) {
				setIsLoading(false);
				dispatch(getSlide());
				toast.success("Slide đã được thêm mới");
				onHide(false);
			} else {
				setIsLoading(false);
				toast.success("Có lỗi xảy ra, vui lòng thử lại sau!");
			}
		}
	};

	return (
		<div className="p-5 bg-[#f6f8fb] min-h-screen">
			{isLoading && (
				<div className="fixed top-0 right-0 bottom-0 left-0 bg-overlay z-[99999999] flex items-center justify-center">
					<h3 className="text-[20px] text-white">
						Đang thêm hình ảnh slider
					</h3>{" "}
					<i className="mt-[10px] ml-[-8px]">
						<DotsAnimation height={57} width={57} />
					</i>
				</div>
			)}
			<div className="p-3 bg-white border rounded-lg shadow-custom_1 min-h-[600px]">
				<h3 className="flex items-center text-black font-semibold text-[24px]">
					Quản lý thêm hình ảnh slider
				</h3>
				<div className="grid wide">
					<div className="row">
						<div className="col g-l-12 g-m-12 g-c-12">
							<h4 className=" font-medium px-3 text-[16px]">
								Hình ảnh
							</h4>
							<label
								htmlFor="selectImages"
								className={`cursor-pointer border h-[40px] flex items-center ${
									invalidField
										? "bg-red-100 border-main"
										: "bg-white"
								} px-5 rounded-md`}
							>
								<FaUpload />
								<span className=" ml-2">{`Đã chọn ${preview.length}`}</span>
								<input
									ref={inputFileRef}
									id="selectImages"
									className="hidden"
									type="file"
									multiple
									onChange={handleChooseImages}
								/>
							</label>
							{invalidField && (
								<p className="ml-1 mt-[2px] text-[14px] text-red-600">
									Vui lòng nhập trường này!
								</p>
							)}

							<div className="mt-5 flex gap-3">
								<div className="grid wide">
									<div className="row">
										{preview.length > 0 &&
											preview.map((image, i) => {
												return (
													<div
														key={i}
														className="relative col g-l-4 mt-4"
													>
														<img
															loading="lazy"
															className="w-full object-cover"
															src={
																image.path ||
																image
															}
															alt=""
														/>
														<i
															className="absolute top-[10px] right-[10px] cursor-pointer hover:opacity-90"
															onClick={() =>
																handleRemoveFile(
																	image
																)
															}
														>
															<IoCloseOutline
																size={20}
															/>
														</i>
													</div>
												);
											})}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex gap-3 items-center mt-6">
					<div
						onClick={handleCreate}
						className=" flex items-center justify-center gap-1 text-[14px] h-[40px] w-[120px] border bg-blue-500 text-white shadow-custom_1 rounded-lg cursor-pointer hover:opacity-80 ease-in-out"
					>
						<GoPlus size={24} color="white" />
						<span>Thêm mới</span>
					</div>

					<div
						onClick={() => onHide(false)}
						className=" flex items-center justify-center gap-1 text-[14px] h-[40px] w-[120px] border bg-red-500 text-white shadow-custom_1 rounded-lg cursor-pointer hover:opacity-80 ease-in-out"
					>
						Trở lại
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBaseComponent(CreateSlide);
