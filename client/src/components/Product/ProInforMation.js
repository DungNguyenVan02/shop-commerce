import { memo, useState } from "react";
import DOMPurify from "dompurify";
import { tabs } from "~/utils/contains";
import icons from "~/utils/icons";
function ProInforMation({ description }) {
	const [active, setActive] = useState(1);
	const [content, setContent] = useState(null);

	const { GoDotFill } = icons;
	return (
		<div className="pb-6">
			<ul className="flex items-center gap-1">
				{tabs.map((tab) => (
					<li
						key={tab.id}
						className={`uppercase border text-[#505050] text-[15px] cursor-pointer hover:bg-gray-500 hover:text-white py-[9px] px-[20px] rounded transition-all ease-linear ${
							tab.id === active ? "bg-gray-500 text-white" : ""
						}`}
						onClick={() => {
							setActive(tab.id);
							setContent(tab.content);
						}}
					>
						{tab.tab}
					</li>
				))}
			</ul>
			<div className="p-5 text-[14px] border rounded mt-4 shadow-custom_1">
				{active === 1 && (
					<ul>
						{Array.isArray(description) ? (
							description?.map((desc) => (
								<li key={desc} className="flex gap-2">
									<GoDotFill />
									{desc}
								</li>
							))
						) : (
							<li
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(description),
								}}
							></li>
						)}
					</ul>
				)}
				{content}
			</div>
		</div>
	);
}

export default memo(ProInforMation);
