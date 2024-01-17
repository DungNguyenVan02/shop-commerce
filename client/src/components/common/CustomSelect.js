import { useField } from "formik";
import { memo, useEffect } from "react";

function CustomSelect({ label, getIdChoose, ...props }) {
	const [field, meta] = useField(props);

	useEffect(() => {
		getIdChoose && getIdChoose(field.value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [field.value]);

	return (
		<div className="flex flex-col mb-3">
			{label && (
				<label className="text-[16px] font-medium ml-2">{label}</label>
			)}
			<select
				className={`border border-gray-300 w-full outline-none px-2 h-[34px] rounded-md text-[14px] ${
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
