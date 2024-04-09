import React, { useEffect, useRef, useState } from "react";
import { Conversation, ChatBox } from "~/components/Chat";
import { userSelector } from "~/redux/selector";
import { useSelector } from "react-redux";
import { apiGetChats } from "~/apis/chat";

import { io } from "socket.io-client";

const ManageChat = () => {
	const { currentUser } = useSelector(userSelector);

	const [chats, setChats] = useState([]);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [sendMessage, setSendMessage] = useState(null);
	const [receiverMessage, setReceiverMessage] = useState(null);

	const socket = useRef();

	// Gửi tin đến socket server
	useEffect(() => {
		if (sendMessage !== null) {
			socket.current.emit("send-message", sendMessage);
		}
	}, [sendMessage]);

	useEffect(() => {
		socket.current = io("http://localhost:8080");

		return () => socket.current.disconnect();
	}, [currentUser]);

	//add online user
	useEffect(() => {
		socket.current.emit("new-user-add", currentUser?._id);
		socket.current.on("get-user", (users) => {
			setOnlineUsers(users);
		});

		return () => {
			socket.current.off("get-user");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	console.log(onlineUsers);

	// Nhận tin nhắn mới từ socket server và thông tin tin nhắn
	useEffect(() => {
		socket.current?.on("receive-message", (data) => {
			setReceiverMessage(data);
		});

		return () => {
			socket.current.off("receive-message");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, sendMessage]);

	// Tìm đến đoạn chat
	const fetchChats = async () => {
		const response = await apiGetChats(currentUser._id);
		setChats(response.data);
	};

	useEffect(() => {
		fetchChats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	const checkOnlineStatus = (chat) => {
		const chatMembers = chat?.members?.find(
			(member) => member !== currentUser?._id
		);
		const online = onlineUsers.find((user) => user.userId === chatMembers);

		return online ? true : false;
	};

	return (
		<div className="p-5 bg-[#f6f8fb] min-h-screen fixed top-[50px] left-[240px] right-0 bottom-0">
			<div className="p-2 bg-white  rounded-lg shadow-custom_1 min-h-[600px]">
				<div className="flex gap-4 min-h-[600px]">
					<div className="w-3/12 min-h-full rounded-md shadow-custom_1 border">
						<h3 className="p-2 bg-[#f3f3f3] text-[24px] font-semibold">
							Tin nhắn
						</h3>

						<ul className="w-full max-h-full bg-white  mt-2 p-2">
							{chats.map((chat) => {
								return (
									<li
										key={chat._id}
										onClick={() => setCurrentChat(chat)}
									>
										<Conversation
											data={chat}
											currentUserId={currentUser._id}
											online={checkOnlineStatus(chat)}
										/>
									</li>
								);
							})}
						</ul>
					</div>
					<div className="w-9/12 min-h-full rounded-md shadow-custom_1 border">
						<div className="relative w-full h-full">
							<ChatBox
								chat={currentChat}
								currentUserId={currentUser._id}
								setSendMessage={setSendMessage}
								receiverMessage={receiverMessage}
								online={checkOnlineStatus(currentChat)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageChat;
