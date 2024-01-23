import icons from "~/utils/icons";
function ChooseImages({
	files,
	invalidField,
	id,
	onUpload,
	multiple,
	selected,
}) {
	const { FaUpload } = icons;
	return (
		<>
			<h3 className="text-[16px] font-medium ml-2">
				{`Choose ${id} product`}
			</h3>
			<div className="p-1 bg-white rounded-md border">
				<label
					className="text-[16px] font-medium ml-2 flex items-center gap-2"
					htmlFor={id}
				>
					<FaUpload />
					{`${selected} file selected`}
				</label>
				<input
					id={id}
					name={id}
					type="file"
					accept="image/jpeg, image/png"
					onChange={onUpload}
					hidden
					multiple={multiple}
				/>
				{invalidField[id] && files[id] === "" && id === "thumb" ? (
					<div className="text-[12px] text-main">Invalid field</div>
				) : (
					invalidField[id] &&
					files[id].length === 0 &&
					id === "images" && (
						<div className="text-[12px] text-main">
							Invalid field
						</div>
					)
				)}
			</div>
		</>
	);
}

export default ChooseImages;
