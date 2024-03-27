import * as yup from "yup";

// eslint-disable-next-line no-useless-escape
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /([0-9]{10})\b/;
export const schemasValidRegister = yup.object().shape({
	fullName: yup
		.string()
		.min(2, "Vui lòng nhập họ tên của bạn")
		.required("Vui lòng nhập trường này"),
	phone: yup
		.string()
		.min(10, "Vui lòng nhập số điện thoại tối thiểu 10 số")
		.required("Vui lòng nhập trường này"),
	email: yup
		.string()
		.matches(emailRegex, "Vui lòng nhập địa chỉ email của bạn")
		.required("Vui lòng nhập trường này"),
	password: yup
		.string()
		.min(6, "Mật khẩu tối thiểu 6 ký tự")
		.required("Vui lòng nhập trường này"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Mật khẩu nhập lại chưa chính xác")
		.required("Vui lòng nhập trường này"),
});

export const schemasValidLogin = yup.object().shape({
	email: yup
		.string()
		.matches(emailRegex, "Vui lòng nhập email của bạn")
		.required("Vui lòng nhập trường này"),
	password: yup
		.string()
		.min(6, "Mật khẩu tối thiểu 6 ký tự")
		.required("Vui lòng nhập trường này"),
});

export const schemasValidResetPassword = yup.object().shape({
	password: yup
		.string()
		.min(6, "Mật khẩu tối thiểu 6 ký tự")
		.required("Vui lòng nhập trường này"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Giá trị nhập vào chưa chính xác")
		.required("Vui lòng nhập trường này"),
	codeVerify: yup
		.string()
		.min(5, "Mã xác nhận gồm 5 ký tự")
		.required("Vui lòng nhập trường này"),
});

export const schemasValidProduct = yup.object().shape({
	name: yup
		.string()
		.min(2, "Vui lòng nhập tên sản phẩm")
		.required("Vui lòng nhập trường này"),
	price: yup
		.number()
		.min(1, "Vui lòng nhập giá sản phẩm")
		.required("Vui lòng nhập trường này"),
	quantity: yup
		.number()
		.min(1, "Vui lòng nhập số lượng")
		.required("Vui lòng nhập trường này"),

	category: yup.string().required("Vui lòng chọn trường này"),
	brand: yup.string().required("Vui lòng chọn trường này"),
	internalMemory: yup.string().required("Vui lòng chọn trường này"),
	ram: yup.string().required("Vui lòng chọn trường này"),
});

export const schemasValidVariants = yup.object().shape({
	quantity: yup
		.number()
		.min(1, "Vui lòng nhập số lượng")
		.required("Vui lòng nhập trường này"),
	price: yup
		.number()
		.min(2, "Vui lòng nhập giá sản phẩm")
		.required("Vui lòng nhập trường này"),
	color: yup
		.string()
		.min(2, "Please enter color")
		.required("Vui lòng nhập trường này"),
});

export const schemasValidChangeProfile = yup.object().shape({
	firstName: yup
		.string()
		.min(2, "Invalid first name")
		.required("Vui lòng nhập trường này"),
	lastName: yup
		.string()
		.min(2, "Invalid last name")
		.required("Vui lòng nhập trường này"),
	phone: yup
		.string()
		.test("phone", "Invalid phone number", (value) =>
			phoneRegex.test(value)
		),
	email: yup
		.string()
		.matches(emailRegex, "Invalid email address")
		.required("Vui lòng nhập trường này"),
});

export const schemasValidBlog = yup.object().shape({
	title: yup
		.string()
		.min(2, "Please enter title blog")
		.required("Vui lòng nhập trường này"),
});
