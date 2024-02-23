import * as yup from "yup";

// eslint-disable-next-line no-useless-escape
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /([0-9]{10})\b/;
export const schemasValidRegister = yup.object().shape({
	firstName: yup
		.string()
		.min(2, "Please enter your first name")
		.required("Required field"),
	lastName: yup
		.string()
		.min(2, "Please enter your last name")
		.required("Required field"),
	phone: yup
		.string()
		.min(10, "Please enter at least 10 number")
		.required("Required field"),
	email: yup
		.string()
		.matches(emailRegex, "Please enter your email address")
		.required("Required field"),
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Required field"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Password must match")
		.required("Required field"),
});

export const schemasValidLogin = yup.object().shape({
	email: yup
		.string()
		.matches(emailRegex, "Invalid email address")
		.required("Required field"),
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Required field"),
});

export const schemasValidResetPassword = yup.object().shape({
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Required field"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Password must match")
		.required("Required field"),
	codeVerify: yup
		.string()
		.min(5, "Code must be at least 5 characters")
		.required("Required field"),
});

export const schemasValidUpdateUser = yup.object().shape({
	firstName: yup
		.string()
		.min(2, "Invalid first name")
		.required("Required field"),
	lastName: yup
		.string()
		.min(2, "Invalid last name")
		.required("Required field"),
	phone: yup
		.string()
		.min(10, "Invalid phone number")
		.required("Required field"),
	email: yup
		.string()
		.matches(emailRegex, "Invalid email address")
		.required("Required field"),
	status: yup
		.string()
		.oneOf(["blocked", "active"], "Choose status")
		.required("Required field"),
	role: yup
		.string()
		.oneOf(["user", "admin"], "Choose role")
		.required("Required field"),
});

export const schemasValidProduct = yup.object().shape({
	name: yup.string().min(2, "Please enter name").required("Required field"),
	price: yup.number().min(1, "Please enter price").required("Required field"),
	quantity: yup
		.number()
		.min(1, "Please enter quantity")
		.required("Required field"),
	color: yup.string().min(2, "Please enter color").required("Required field"),
	category: yup
		.string()
		.oneOf(
			[
				"Smartphone",
				"Tablet",
				"Laptop",
				"Speaker",
				"Camera",
				"Accessories",
				"Television",
				"Printer",
			],
			"Please choose category for product"
		)
		.required("Required field"),
});

export const schemasValidVariants = yup.object().shape({
	quantity: yup
		.number()
		.min(1, "Please enter quantity")
		.required("Required field"),
	price: yup.number().min(2, "Please enter price").required("Required field"),
	color: yup.string().min(2, "Please enter color").required("Required field"),
});

export const schemasValidChangeProfile = yup.object().shape({
	firstName: yup
		.string()
		.min(2, "Invalid first name")
		.required("Required field"),
	lastName: yup
		.string()
		.min(2, "Invalid last name")
		.required("Required field"),
	phone: yup
		.string()
		.test("phone", "Invalid phone number", (value) =>
			phoneRegex.test(value)
		),
	email: yup
		.string()
		.matches(emailRegex, "Invalid email address")
		.required("Required field"),
});

export const schemasValidBlog = yup.object().shape({
	title: yup
		.string()
		.min(2, "Please enter title blog")
		.required("Required field"),
});
