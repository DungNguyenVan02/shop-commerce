import React, { memo } from "react";
import { Editor } from "@tinymce/tinymce-react";

function MarkdownEditor({
	label,
	name,
	value,
	onChangeValue,
	invalidField,
	setInvalidField,
}) {
	return (
		<>
			{label && (
				<label className="text-[14px] font-medium ml-2">{label}</label>
			)}
			<Editor
				apiKey={process.env.REACT_APP_TINYMCE_KEY}
				initialValue={value}
				init={{
					height: 400,
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
				onChange={(e) =>
					onChangeValue((prev) => ({
						...prev,
						[name]: e.target.getContent(),
					}))
				}
				onFocus={() =>
					setInvalidField.description &&
					setInvalidField((prev) => ({ ...prev, description: false }))
				}
			/>
			{invalidField.description && (
				<p className="text-main">Invalid field</p>
			)}
		</>
	);
}

export default memo(MarkdownEditor);
