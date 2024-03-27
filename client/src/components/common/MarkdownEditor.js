import React, { memo } from "react";
import { Editor } from "@tinymce/tinymce-react";

function MarkdownEditor({
	label,
	value,
	onChangeValue,
	invalidField,
	setInvalidField,
}) {
	return (
		<>
			{label && (
				<label className="text-[16px] font-medium ml-2">{label}</label>
			)}
			<Editor
				apiKey={process.env.REACT_APP_TINYMCE_KEY}
				initialValue={value || ""}
				init={{
					height: 500,
					menubar: true,
					plugins: [
						"advlist",
						"autolink",
						"lists",
						"link",
						"image",
						"charmap",
						"anchor",
						"searchreplace",
						"visualblocks",
						"code",
						"fullscreen",
						"insertdatetime",
						"media",
						"table",
						"preview",
						"help",
						"wordcount",
					],
					toolbar:
						"undo redo | blocks | " +
						"bold italic forecolor | alignleft aligncenter " +
						"alignright alignjustify | bullist numlist outdent indent | " +
						"removeformat | help",
					content_style:
						"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
				}}
				onChange={(e) => onChangeValue(e.target.getContent())}
				onBlur={(e) =>
					e.target.getContent() === "" &&
					setInvalidField((prev) => ({ ...prev, description: true }))
				}
				onFocus={() =>
					invalidField.description &&
					setInvalidField((prev) => ({ ...prev, description: false }))
				}
			/>
			{invalidField.description && (
				<p className="text-main">Vui lòng nhập trường này</p>
			)}
		</>
	);
}

export default memo(MarkdownEditor);
