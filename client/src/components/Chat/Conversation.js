import React, { useEffect, useState } from "react";
import { apiGetUserById } from "~/apis";
import images from "~/assets/images";

const Conversation = ({ data, currentUserId, online }) => {
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const userId = data.members.find((id) => id !== currentUserId);

		const getUserData = async () => {
			const response = await apiGetUserById(userId);

			setUserData(response.data);
		};

		getUserData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex items-center relative bg-[#f2f2f2] rounded-md px-2">
			{online && (
				<span className="absolute bottom-[7px] left-[32px] w-[14px] h-[14px] border-[2px]  border-white  bg-green-500 rounded-full"></span>
			)}
			<img
				loading="lazy"
				className="w-[40px] h-[40px] object-cover rounded-full"
				src={userData?.image || images.avatarDefault}
				alt=""
			/>
			<div className="p-2">
				<h3 className="text-[15px] text-[#050505] font-medium">
					{userData?.fullName}
				</h3>
				<p className="text-[13px] text-[#65676B] line-clamp-1">
					Oke nhé shop
				</p>
			</div>
		</div>
	);
};

export default Conversation;
