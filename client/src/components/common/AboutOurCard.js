import React from "react";

const AboutOurCard = ({ title, content, number }) => {
	return (
		<div className=" text-white relative w-full h-[178px] border py-[15px] px-[15px] rounded-tr-3xl rounded-bl-3xl overflow-hidden border-blue-500">
			<div className="absolute top-0 right-0 bottom-0 left-0 h-full w-full bg-gradient-custom-2 z-[-1]"></div>
			<div>
				<h3 className="text-[34px] font-semibold">
					<span>{`0${number}`}</span>
				</h3>
				<div>
					<h3 className="text-[28px] font-semibold">{title}</h3>
					<p className="text-[14px] text-gray-500">{content}</p>
				</div>
			</div>
		</div>
	);
};

export default AboutOurCard;
