import * as yup from "yup";

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
		.min(9, "Please enter at least 10 numbers")
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
