import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import Navigation from "../components/user/Navigation";
import icons from "~/utils/icons";
import { useEffect, useRef, useState } from "react";
import images from "~/assets/images";
import { apiGetChats } from "~/apis/chat";
import { userSelector } from "~/redux/selector";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import withBaseComponent from "~/components/hocs/withBaseComponent";
import routes from "~/config/routes";
import { createSearchParams } from "react-router-dom";
import { ChatBox } from "~/components/Chat";
import { apiSendQuestion } from "~/apis/chatGPT";
import ChatBoxAI from "~/components/Chat/ChatBoxAI";

function DefaultLayout({ children, navigate, location }) {
	const { LuMessagesSquare, IoCloseOutline, BsRobot } = icons;
	const [isOpenChat, setIsOpenChat] = useState(false);
	const [isOpenChatAI, setIsOpenChatAI] = useState(false);
	const { currentUser } = useSelector(userSelector);

	const [chat, setChat] = useState([]);

	const [messageAI, setMessageAI] = useState([
		{ sender: "AI", text: "Xin chào tôi có thể giúp gì cho bạn" },
	]);
	const [sendMessage, setSendMessage] = useState(null);
	const [receiverMessage, setReceiverMessage] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);

	const socket = useRef();

	// Gửi tin đến socket server
	useEffect(() => {
		if (sendMessage !== null) {
			socket.current.emit("send-message", sendMessage);
		}
	}, [sendMessage]);

	// kết nối socket
	useEffect(() => {
		socket.current = io("http://localhost:8080");

		return () => socket.current?.disconnect();
	}, [currentUser]);

	//Thêm online user
	useEffect(() => {
		if (isOpenChat) {
			socket.current.emit("new-user-add", currentUser._id);
			socket.current.on("get-user", (users) => {
				setOnlineUsers(users);
			});
		} else {
		}

		return () => {
			socket.current?.off("get-user");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpenChat]);

	// Nhận tin nhắn mới từ socket server
	useEffect(() => {
		socket.current?.on("receive-message", (data) => {
			setReceiverMessage(data);
		});

		return () => {
			socket.current.off("receive-message");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, sendMessage]);

	const fetchChats = async () => {
		const response = await apiGetChats(currentUser?._id);
		if (response?.success) {
			setChat(response?.data[0]);
		}
	};

	useEffect(() => {
		currentUser && fetchChats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	const containerChatRef = useRef();
	const containerChatAIRef = useRef();

	const checkOnlineStatus = (chat) => {
		const chatMembers = chat?.members?.find(
			(member) => member !== currentUser?._id
		);
		const online = onlineUsers.find((user) => user.userId === chatMembers);

		return online ? true : false;
	};

	return (
		<div className=" relative  w-full flex items-center flex-col">
			<Header />
			<Navigation />
			<div className="w-full">{children}</div>
			<Footer />

			{/* Chat */}
			{currentUser?.role === 1978 && (
				<div
					ref={containerChatRef}
					className="fixed bottom-[40px]  right-[20px] z-[9999999]"
				>
					{isOpenChat && (
						<div className="animate-slideTopLeft absolute bottom-0 right-0 w-[338px] h-[455px] bg-white shadow-custom_1 rounded-md border overflow-hidden">
							<div className="z-[9999999] fixed top-0 left-0 right-0 h-[40px] px-3 bg-blue-500 flex items-center justify-between shadow-inner">
								<div className="relative flex items-center gap-2">
									{checkOnlineStatus(chat) && (
										<span className="absolute bottom-0 left-[20px] w-[14px] h-[14px] border-[2px]  border-white  bg-green-500 rounded-full"></span>
									)}

									<img
										loading="lazy"
										src={images.avatarDefault}
										alt=""
										className="w-[32px] h-[32px] object-cover"
									/>
									<h3 className="text-white">Admin</h3>
								</div>
								<i
									onClick={() => setIsOpenChat(false)}
									className=" cursor-pointer p-2 hover:opacity-80"
								>
									<IoCloseOutline size={22} color="white" />
								</i>
							</div>

							<ChatBox
								chat={chat}
								getChat={fetchChats}
								currentUser={currentUser}
								setSendMessage={setSendMessage}
								receiverMessage={receiverMessage}
							/>
						</div>
					)}
					<i
						onClick={() => {
							if (currentUser) {
								setIsOpenChat(true);
							} else {
								Swal.fire({
									title: "Hệ thống thông báo!",
									text: "Bạn cần đăng nhập vào hệ thống trước khi nhắn tin cho người bán",
									icon: "warning",
									showCancelButton: true,
									confirmButtonText: "Đăng nhập",
									cancelButtonText: "Thoát",
									reverseButtons: true,
								}).then((result) => {
									if (result.isConfirmed) {
										navigate({
											pathname: routes.login,
											search: createSearchParams({
												redirect: location.pathname,
											}).toString(),
										});
									}
								});
							}
						}}
						className=" cursor-pointer w-[50px] h-[50px] bg-white shadow-custom_1 border rounded-full flex items-center justify-center"
					>
						<LuMessagesSquare />
					</i>
				</div>
			)}
			{!isOpenChat && (
				<div
					ref={containerChatAIRef}
					className="fixed bottom-[40px]  right-[80px] z-[9999999]"
				>
					{isOpenChatAI && (
						<div className="animate-slideTopLeft absolute bottom-0 right-0 w-[338px] h-[455px] bg-white shadow-custom_1 rounded-md border overflow-hidden">
							<div className="z-[9999999] fixed top-0 left-0 right-0 h-[40px] px-3 bg-blue-500 flex items-center justify-between shadow-inner">
								<div className="relative flex items-center gap-2">
									<BsRobot size={26} color="white" />

									<h3 className="text-white">Chatbot</h3>
								</div>
								<i
									onClick={() => setIsOpenChatAI(false)}
									className=" cursor-pointer p-2 hover:opacity-80"
								>
									<IoCloseOutline size={22} color="white" />
								</i>
							</div>

							<ChatBoxAI
								messageAI={messageAI}
								setMessageAI={setMessageAI}
							/>
						</div>
					)}
					<i
						onClick={() => {
							if (currentUser) {
								setIsOpenChatAI(true);
							} else {
								Swal.fire({
									title: "Hệ thống thông báo!",
									text: "Bạn cần đăng nhập vào hệ thống trước khi nhắn tin cho người bán",
									icon: "warning",
									showCancelButton: true,
									confirmButtonText: "Đăng nhập",
									cancelButtonText: "Thoát",
									reverseButtons: true,
								}).then((result) => {
									if (result.isConfirmed) {
										navigate({
											pathname: routes.login,
											search: createSearchParams({
												redirect: location.pathname,
											}).toString(),
										});
									}
								});
							}
						}}
						className=" cursor-pointer w-[50px] h-[50px] bg-white shadow-custom_1 border rounded-full flex items-center justify-center"
					>
						<BsRobot />
					</i>
				</div>
			)}
		</div>
	);
}

export default withBaseComponent(DefaultLayout);
