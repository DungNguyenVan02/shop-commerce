import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useRef, useState } from "react";
import { apiGetUserById } from "~/apis";
import { apiAddChat, apiAddMessage, apiGetMessage } from "~/apis/chat";
import images from "~/assets/images";
import icons from "~/utils/icons";
import { toast } from "react-toastify";

const ChatBox = ({
	chat,
	getChat,
	currentUserId,
	currentUser,
	setSendMessage,
	receiverMessage,
	online,
}) => {
	const { FaPhoneAlt, RiInformationFill, RiSendPlaneFill, LuMessagesSquare } =
		icons;

	const [userData, setUserData] = useState(null);
	const [message, setMessage] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isFocus, setIsFocus] = useState(false);

	const scroll = useRef();

	useEffect(() => {
		if (currentUserId) {
			const userId = chat?.members?.find((id) => id !== currentUserId);
			const getUserData = async () => {
				const response = await apiGetUserById(userId);

				setUserData(response.data);
			};

			if (chat !== null) getUserData();
		}
	}, [chat, currentUserId]);

	useEffect(() => {
		if (chat) {
			const fetchMessage = async () => {
				const response = await apiGetMessage(chat._id);

				setMessage(response.data);
			};

			fetchMessage();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chat]);

	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: "smooth" });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message]);

	const handleSendMessage = async () => {
		if (newMessage.trim().length > 0) {
			const messageSend = {
				chatId: chat._id,
				senderId: currentUser ? currentUser?._id : currentUserId,
				text: newMessage.trim(),
			};

			const response = await apiAddMessage(messageSend);

			if (response.success) {
				setMessage([...message, response.data]);
				setNewMessage("");
			}

			// gửi message tới socket server
			const uIdCurrent = currentUser ? currentUser?._id : currentUserId;

			const receiverId = chat?.members?.find((id) => id !== uIdCurrent);

			setSendMessage({
				...messageSend,
				receiverId,
			});
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

	useEffect(() => {
		console.log(
			receiverMessage !== null && receiverMessage?.chatId === chat?._id
		);
		if (receiverMessage !== null && receiverMessage?.chatId === chat?._id) {
			setMessage((prev) => [...prev, receiverMessage]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [receiverMessage]);

	const handleStartChat = async () => {
		const response = await apiAddChat({
			senderId: currentUser._id,
		});

		if (!response.success) {
			toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
		} else {
			getChat();
		}
	};

	return (
		<div className="h-full">
			{chat ? (
				<div className="h-full">
					{!currentUser && (
						<div className="z-[99999] flex items-center justify-between p-2 bg-blue-500 absolute top-0 left-0 right-0 rounded-tr-md rounded-tl-md">
							<div className="relative flex items-center gap-2">
								{online && (
									<span className="absolute bottom-0 left-[32px] w-[14px] h-[14px] border-[2px]  border-white  bg-green-500 rounded-full"></span>
								)}
								<img
									loading="lazy"
									className="w-[50px] h-[50px] object-cover rounded-full"
									src={
										userData?.image || images.avatarDefault
									}
									alt=""
								/>
								<div>
									<h3 className="text-[15px] text-white font-medium">
										{userData?.fullName || "Admin"}
									</h3>
									<p className="text-[13px] text-white line-clamp-1">
										{online ? "Đang hoạt động" : ""}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 mr-5">
								<i className="cursor-pointer hover:opacity-75">
									<FaPhoneAlt color="white" />
								</i>
								<i className="cursor-pointer hover:opacity-75">
									<RiInformationFill
										size={22}
										color="white"
									/>
								</i>
							</div>
						</div>
					)}

					<div
						className={`pt-[70px] pb-4 px-1 overflow-y-scroll  ${
							currentUser ? "h-[408px]" : "h-[550px]"
						}`}
					>
						{message?.map((mes, i) => {
							return (
								<div
									key={i}
									ref={scroll}
									className={`flex mt-1 ${
										mes?.senderId ===
										(currentUser
											? currentUser?._id
											: currentUserId)
											? "justify-end "
											: ""
									} `}
								>
									<div
										className={`
                                flex flex-col
                                ${
									mes?.senderId ===
									(currentUser
										? currentUser?._id
										: currentUserId)
										? "bg-blue-500 p-3 text-white max-w-[60%]  rounded-tr-xl rounded-tl-xl rounded-bl-xl  border"
										: "bg-[#f3f3f3] p-3 text-gray-700 max-w-[60%] rounded-tr-xl rounded-tl-xl rounded-br-xl border"
								}`}
									>
										<span className="text-[15px]">
											{mes?.text}
										</span>
										<span
											className={`flex ${
												mes?.senderId ===
												(currentUser
													? currentUser?._id
													: currentUserId)
													? "justify-end"
													: ""
											} text-[12px] opacity-80`}
										>
											{moment(mes?.createdAt).fromNow()}
										</span>
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
			) : (
				<div className="flex items-center justify-center  h-full">
					<h3 className="text-[38px] text-gray-500 text-center">
						{currentUser ? (
							<div>
								<h3 className="text-[24px]">
									Gửi tin nhắn cho người bán
								</h3>
								<span
									onClick={handleStartChat}
									className="px-3 py-1 border rounded-full cursor-pointer text-[18px] text-gray-700 hover:bg-[#f2f2f2]"
								>
									Bắt đầu
								</span>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center">
								click vào cuộc hội thoại để bắt đầu
								<LuMessagesSquare size={50} color="gray" />
							</div>
						)}
					</h3>
				</div>
			)}
		</div>
	);
};

export default ChatBox;
