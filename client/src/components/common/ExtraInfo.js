function ExtraInfo({ icon, title, subTitle }) {
	return (
		<div className="flex items-center border p-2 gap-4">
			<i className="w-[33px] h-[33px] rounded-full bg-gray-700 flex items-center justify-center">
				{icon}
			</i>
			<div className="text-[14px]">
				<h4 className="text-gray-600">{title}</h4>
				<p className="text-[13px] text-gray-400">{subTitle}</p>
			</div>
		</div>
	);
}

export default ExtraInfo;
