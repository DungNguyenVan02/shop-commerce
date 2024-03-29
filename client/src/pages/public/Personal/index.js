import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiUpdateUser } from "~/apis";
import images from "~/assets/images";
import { Button, CustomInput, CustomSelect } from "~/components/common";
import { userSelector } from "~/redux/selector";
import { schemasValidChangeProfile } from "~/utils/schemasValid";
import { OvalAnimation } from "~/components/Animation";
import { toast } from "react-toastify";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import { getCurrentUser } from "~/redux/asyncActions";

function Personal({ dispatch }) {
	const { currentUser } = useSelector(userSelector);
	const [isUploading, setIsUploading] = useState(false);
	const [isRender, setIsRender] = useState(false);
	const [fileAvatar, setFileAvatar] = useState("");
	const [previewAvatar, setPreviewAvatar] = useState("");

	useEffect(() => {
		if (fileAvatar) {
			const srcPreview = URL.createObjectURL(fileAvatar);
			setPreviewAvatar(srcPreview);
		}
	}, [fileAvatar]);

	useEffect(() => {
		return () => fileAvatar && URL.revokeObjectURL(previewAvatar);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [previewAvatar]);

	const innitValues = {
		firstName: currentUser.firstName || "",
		lastName: currentUser.lastName || "",
		email: currentUser.email || "",
		phone: currentUser.phone || "",
		address: currentUser.address[0] || "",
	};
	const checkDirty = (data) => {
		let isDirty = false;
		for (let i of Object.keys(data)) {
			if (data[i] !== innitValues[i]) {
				isDirty = true;
				break;
			}
		}
		return isDirty;
	};
	const handleSaveChanges = async (data) => {
		if (checkDirty(data) || fileAvatar !== "") {
			const formData = new FormData();
			for (let i of Object.entries(data)) {
				formData.append(i[0], i[1]);
			}
			if (fileAvatar) {
				formData.append("avatar", fileAvatar);
			}
			setIsUploading(true);
			const response = await apiUpdateUser(formData);
			if (response?.success) {
				setIsUploading(false);
				toast.success(response.mes);
				dispatch(getCurrentUser());
				setIsRender(!isRender);
				setFileAvatar("");
				setPreviewAvatar("");
			} else {
				setIsUploading(false);
				toast.success(response.mes);
			}
		}
	};
	return (
		<>
			{isUploading && (
				<div className="fixed top-0 right-0 bottom-0 left-0 bg-overlay z-[99999999] flex items-center justify-center">
					<OvalAnimation height={34} width={34} />
				</div>
			)}
			<div className="px-[30px] mb-[24px] bg-white shadow-lg">
				<div className="py-[18px] border-b mb-6">
					<h3 className="text-[#222] font-medium text-[18px]">
						My Profile
					</h3>
					<h4 className="text-[#555] text-[16px]">
						Manage and protect your account
					</h4>
				</div>
				<div className="grid wide">
					<div className="row">
						<div className="col g-l-8">
							<Formik
								initialValues={innitValues}
								validationSchema={schemasValidChangeProfile}
								onSubmit={handleSaveChanges}
							>
								{({ handleSubmit, handleChange }) => (
									<Form
										onSubmit={handleSubmit}
										onChange={handleChange}
									>
										<CustomInput
											label="First name"
											name="firstName"
											placeholder="Enter your first name"
										/>
										<CustomInput
											label="Last name"
											name="lastName"
											placeholder="Enter your last name"
										/>
										<CustomSelect
											label="Address"
											name="address"
										>
											{currentUser.address?.map(
												(item, i) => (
													<option key={i}>
														{item}
													</option>
												)
											)}
										</CustomSelect>
										<CustomInput
											label="Email"
											name="email"
											placeholder="Enter your email address"
										/>
										<CustomInput
											label="Phone number"
											name="phone"
											placeholder="Enter your phone number"
										/>
										<Button
											styleCustom="px-3 py-1 bg-green-500 text-white rounded hover:opacity-80 my-[24px]"
											type="submit"
											title="Save"
										/>
									</Form>
								)}
							</Formik>
						</div>
						<div className="col g-l-4">
							<div className="flex flex-col items-center gap-2">
								<img
									className="w-[100px] h-[100px] object-cover shadow-lg rounded-full"
									src={
										previewAvatar
											? previewAvatar
											: currentUser?.image ||
											  images.avatarDefault
									}
									alt="avatar"
								/>
								<label
									htmlFor="btnChangeImage"
									className="border p-2 text-[16px] cursor-pointer text-[#888] hover:border-main"
								>
									Change image
								</label>
								<input
									id="btnChangeImage"
									type="file"
									hidden
									onChange={(e) =>
										setFileAvatar(e.target.files[0])
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default withBaseComponent(Personal);
