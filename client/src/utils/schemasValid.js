import * as yup from "yup";

export const schemasValidRegister = yup.object().shape({
	firstName: yup
		.string()
		.min("Please enter your first name")
		.required("Required field"),
	lastName: yup
		.string()
		.min("Please enter your last name")
		.required("Required field"),
	phone: yup
		.string()
		.min(20, "Please enter at least 10 numbers")
		.required("Required field"),
	email: yup
		.string()
		.email("Please enter a valid email address")
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
		.email("Please enter a valid email address")
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
		.min(20, "Invalid phone numbers")
		.required("Required field"),
	email: yup
		.string()
		.email("Invalid email address")
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
	price: yup.number().min(2, "Please enter price").required("Required field"),
	quantity: yup
		.number()
		.min(2, "Please enter quantity")
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
