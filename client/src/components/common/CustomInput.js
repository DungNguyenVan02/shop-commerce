import { useField } from "formik";
import { memo } from "react";

function CustomInput({ label, placeholder, textArea, onSetFile, ...props }) {
	const [field, meta] = useField(props);

	let TypeInput = "input";
	if (textArea) {
		TypeInput = "textarea";
	}
	return (
		<div className="mb-3">
			{label && (
				<label
					className="text-[16px] font-medium ml-2"
					htmlFor={props.name}
				>
					{label}
				</label>
			)}
			<TypeInput
				id={props.name}
				className={`border border-gray-300 w-full outline-none px-2  rounded-md text-[14px] placeholder:text-[14px] ${
					textArea ? "h-[100px]" : "h-[34px]"
				}  ${meta.touched && meta.error ? "border-main bg-red-100" : ""}
					${props.type === "file" ? "pt-1" : ""} 
				`}
				placeholder={placeholder}
				{...field}
				{...props}
			/>
			{meta.touched && meta.error ? (
				<div className="text-[12px] text-main">{meta.error}</div>
			) : null}
		</div>
	);
}

export default memo(CustomInput);
