import icons from "~/utils/icons";
function ChooseImages({
	files,
	invalidField,
	id,
	onUpload,
	multiple,
	selected,
	title = "product",
}) {
	const { FaUpload } = icons;
	return (
		<div className="cursor-pointer">
			<h3 className="text-[16px] font-medium ml-2">
				{`Choose ${id} ${title}`}
			</h3>
			<div className="p-1 bg-white rounded-md border cursor-pointer">
				<label
					className="text-[16px] font-medium ml-2 flex items-center gap-2 "
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
		</div>
	);
}

export default ChooseImages;
