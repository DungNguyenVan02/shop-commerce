import { useField } from "formik";
import { memo } from "react";

function CustomSelect({ label, ...props }) {
	const [field, meta] = useField(props);
	return (
		<div className="flex flex-col mb-3">
			{label && (
				<label className="text-[14px] font-medium ml-2">{label}</label>
			)}
			<select
				className={`border border-gray-300 w-full outline-none px-2 h-[34px] rounded-md ${
					meta.touched && meta.error ? "border-main bg-red-100" : ""
				}`}
				{...field}
				{...props}
			></select>
			{meta.touched && meta.error ? (
				<div className="text-[12px] text-main">{meta.error}</div>
			) : null}
		</div>
	);
}

export default memo(CustomSelect);
