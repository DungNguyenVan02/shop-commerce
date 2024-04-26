import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useRef, useState } from "react";
import images from "~/assets/images";
import icons from "~/utils/icons";
import { toast } from "react-toastify";
import { apiSendQuestion } from "~/apis/chatGPT";

const ChatBoxAI = ({ messageAI, setMessageAI }) => {
	const { FaPhoneAlt, RiInformationFill, RiSendPlaneFill, LuMessagesSquare } =
		icons;

	const [userData, setUserData] = useState(null);
	const [newMessage, setNewMessage] = useState("");
	const [isFocus, setIsFocus] = useState(false);

	const scroll = useRef();

	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: "smooth" });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageAI]);

	const handleSendMessage = async () => {
		if (newMessage.trim().length > 0) {
			const messageSend = {
				text: newMessage.trim(),
			};

			await apiSendQuestion(messageSend);
		}
	};
	useEffect(() => {
		function handleKeyDown(e) {
			if (e.keyCode === 13 && newMessage.length > 0 && isFocus) {
				handleSendMessage();
			}
		}
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFocus, newMessage]);

	return (
		<div className="h-full">
			<div className="pt-[70px] pb-4 px-1 overflow-y-scroll h-[408px]">
				{messageAI?.map((mes, i) => {
					return (
						<div
							key={i}
							ref={scroll}
							className={`flex mt-1 ${
								mes?.sender !== "AI" ? "justify-end " : ""
							} `}
						>
							<div
								className={`
                                flex flex-col
                                ${
									mes?.sender !== "AI"
										? "bg-blue-500 p-3 text-white max-w-[60%]  rounded-tr-xl rounded-tl-xl rounded-bl-xl  border"
										: "bg-[#f3f3f3] p-3 text-gray-700 max-w-[60%] rounded-tr-xl rounded-tl-xl rounded-br-xl border"
								}`}
							>
								<span className="text-[15px]">{mes?.text}</span>
							</div>
						</div>
					);
				})}
			</div>
			<div className="absolute bottom-0 left-0 right-0 h-[55px] bg-white border rounded-br-md rounded-bl-md flex items-center">
				<div className="px-5 w-full flex items-center gap-2">
					<input
						value={newMessage}
						placeholder="Aa"
						onChange={(e) => setNewMessage(e.target.value)}
						onFocus={() => setIsFocus(true)}
						onBlur={() => setIsFocus(false)}
						className="px-3 bg-[#f2f2f2] h-[40px] border rounded-lg w-full outline-none"
					/>
					<i
						onClick={handleSendMessage}
						className=" px-5 py-2 rounded-xl bg-blue-500 cursor-pointer hover:opacity-80"
					>
						<RiSendPlaneFill size={26} color="white" />
					</i>
				</div>
			</div>
		</div>
	);
};

export default ChatBoxAI;
