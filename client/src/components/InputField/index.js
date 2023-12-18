import { useEffect, useState } from "react";
import icons from "../../utils/icons";
import { convertToDisplayName } from "../../utils/helper";

function InputField({
	value,
	setValue,
	fieldKey,
	type,
	invalidField,
	setInValidField,
}) {
	const { FaRegEye, FaEyeSlash } = icons;
	const [isShowLabel, setIsShowLabel] = useState(true);
	const [isShowPass, setIsShowPass] = useState(false);

	useEffect(() => {
		setIsShowLabel(true);
		if (value === "") {
			setIsShowLabel(false);
		}
	}, [value]);
	return (
		<div className="w-full relative">
			<label
				htmlFor={convertToDisplayName(fieldKey)}
				className={`text-[11px] left-[10px] bg-white ${
					isShowLabel &&
					"opacity-95 animate-slideTopInput px-[8px] py-1 absolute top-[-12px]"
				}`}
			>
				{isShowLabel && convertToDisplayName(fieldKey)}
			</label>
			<input
				id={convertToDisplayName(fieldKey)}
				className={`w-full outline-none border p-[10px] ${
					type === "password" ? "pr-10" : ""
				} rounded-sm text-[14px] placeholder:text-[11px] focus:border-[#4285f4] focus:shadow-md`}
				type={(type && !isShowPass ? "password" : "text") || "text"}
				placeholder={convertToDisplayName(fieldKey)}
				autoComplete="off"
				value={value}
				onChange={(e) =>
					setValue((prev) => ({
						...prev,
						[fieldKey]: e.target.value,
					}))
				}
			/>
			{type === "password" && (
				<i
					className="absolute top-[50%] translate-y-[-50%] right-4 cursor-pointer"
					onClick={() => setIsShowPass(!isShowPass)}
				>
					{!isShowPass ? (
						<FaEyeSlash color="gray" />
					) : (
						<FaRegEye color="gray" />
					)}
				</i>
			)}
		</div>
	);
}

export default InputField;
