import { apiUpdateUser } from "~/apis";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { showModal } from "~/redux/appSlice";
import { Form, Formik } from "formik";
import { CustomInput, CustomSelect } from "~/components/common";
import { schemasValidUpdateUser } from "~/utils/schemasValid";

function FormUpdate({ useEdit }) {
	const dispatch = useDispatch();

	const onSubmit = async (data) => {
		const transformData = {
			...data,
			role: data.role === "admin" ? 1974 : 1978,
			isBlocked: data.status === "blocked" ? true : false,
		};
		const response = await apiUpdateUser(transformData, useEdit?._id);
		if (response.success) {
			Swal.fire(
				"Notifications",
				"Update user successfully",
				"success"
			).then(() => {
				dispatch(showModal({ isShowModal: false }));
			});
		} else {
			Swal.fire(
				"Notifications",
				"Something went wrong, please try again",
				"error"
			);
		}
	};

	const initialValues = {
		firstName: useEdit?.firstName,
		lastName: useEdit?.lastName,
		phone: useEdit?.phone,
		email: useEdit?.email,
		role: useEdit?.role === 1974 ? "admin" : "user",
		status: useEdit?.isBlocked ? "blocked" : "active",
	};
	return (
		<div
			className="w-[500px] bg-white shadow-2xl rounded-xl"
			onClick={(e) => e.stopPropagation()}
		>
			<h3 className="text-center text-[20px] font-medium border-b p-4">
				Edit user
			</h3>
			<Formik
				initialValues={initialValues}
				validationSchema={schemasValidUpdateUser}
				onSubmit={onSubmit}
			>
				{({ handleSubmit }) => (
					<Form onSubmit={handleSubmit} className="p-5">
						<CustomInput name="firstName" label="First name" />
						<CustomInput name="lastName" label="Last name" />
						<CustomInput name="email" label="Email" />
						<CustomInput name="phone" label="Phone number" />
						<CustomSelect name="role" label="Role">
							<option
								value={
									useEdit?.role === 1974 ? "admin" : "user"
								}
							>
								{useEdit?.role === 1974 ? "Admin" : "User"}
							</option>
							<option
								value={
									useEdit?.role === 1974 ? "user" : "admin"
								}
							>
								{useEdit?.role === 1974 ? "User" : "Admin"}
							</option>
						</CustomSelect>
						<CustomSelect name="status" label="Status account">
							<option
								value={
									useEdit?.isBlocked === false
										? "active"
										: "blocked"
								}
							>
								{useEdit?.isBlocked === false
									? "Active"
									: "Blocked"}
							</option>
							<option
								value={
									useEdit?.isBlocked === false
										? "blocked"
										: "active"
								}
							>
								{useEdit?.isBlocked === false
									? "Blocked"
									: "Active"}
							</option>
						</CustomSelect>
						<div className="flex justify-end px-5 py-2 gap-3">
							<button
								className="px-3 py-1 bg-gray-600 text-white rounded hover:opacity-80"
								onClick={() =>
									dispatch(showModal({ isShowModal: false }))
								}
							>
								Exit
							</button>
							<button
								className="px-3 py-1 bg-green-500 text-white rounded hover:opacity-80"
								type="submit"
							>
								Save
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export default FormUpdate;
