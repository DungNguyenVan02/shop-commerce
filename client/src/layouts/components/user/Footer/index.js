import icons from "~/utils/icons";
function Footer() {
	const {
		IoIosMail,
		FaPhoneAlt,
		GiPositionMarker,
		FaLinkedinIn,
		FaFacebookF,
		FaTwitter,
		FaPinterest,
		FaFlickr,
		IoLogoGoogleplus,
	} = icons;

	const ABOUT_US = [
		{
			icon: GiPositionMarker,
			title: "Address",
			description: "474 Ontario St Toronto, ON M4X 1M7 Canada",
		},
		{
			icon: FaPhoneAlt,
			title: "Phone",
			description: "(+1234)56789xxx",
		},
		{
			icon: IoIosMail,
			title: "Mail",
			description: "tadathemes@gmail.com",
		},
	];

	return (
		<footer className="w-full">
			<div className="h-[100px] w-full bg-main flex items-center">
				<div className="max-w-main w-full mx-auto flex justify-between items-center">
					<div className="flex-1">
						<h3 className="text-[20px] uppercase text-white tracking-[2px]">
							SIGN UP TO NEWSLETTER
						</h3>
						<p className="text-[13px] text-white font-[400] opacity-60">
							Subscribe now and receive weekly newsletter
						</p>
					</div>
					<div className="flex items-center flex-1 max-w-[590px] w-full rounded-full px-5 bg-[rgba(255,255,255,.1)]">
						<input
							className="flex-1 py-3 pr-[24px] bg-transparent outline-none text-white placeholder:text-white placeholder:text-[13px] placeholder:opacity-80"
							type="text"
							name="email"
							placeholder="Email address"
						/>
						<IoIosMail color="white" opacity={0.8} size={24} />
					</div>
				</div>
			</div>
			<div className="w-full bg-[#191919]">
				<div className="max-w-main w-full mx-auto flex justify-between items-center text-white text-[13px] py-[34px]">
					<div className="grid wide">
						<div className="row">
							<div className="col g-l-5">
								<h3 className="uppercase font-bold text-[15px] border-l-[3px] px-3 border-main mb-4">
									About Us
								</h3>

								{ABOUT_US.map((item, index) => {
									const Icon = item.icon;
									return (
										<div
											key={index}
											className="flex items-center gap-2 font-[300]"
										>
											<Icon size={16} />
											<span className="my-1 font-[500]">
												{item.title}:{" "}
											</span>
											<span className="my-1 opacity-75">
												{item.description}
											</span>
										</div>
									);
								})}
								<div className="flex gap-2 mt-3">
									<span className="cursor-pointer hover:bg-gray-500 w-[40px] h-[40px] bg-gray-700 rounded-sm flex items-center justify-center">
										<FaFacebookF />
									</span>
									<span className="cursor-pointer hover:bg-gray-500 w-[40px] h-[40px] bg-gray-700 rounded-sm flex items-center justify-center">
										<FaTwitter />
									</span>
									<span className="cursor-pointer hover:bg-gray-500 w-[40px] h-[40px] bg-gray-700 rounded-sm flex items-center justify-center">
										<FaPinterest />
									</span>
									<span className="cursor-pointer hover:bg-gray-500 w-[40px] h-[40px] bg-gray-700 rounded-sm flex items-center justify-center">
										<IoLogoGoogleplus />
									</span>
									<span className="cursor-pointer hover:bg-gray-500 w-[40px] h-[40px] bg-gray-700 rounded-sm flex items-center justify-center">
										<FaLinkedinIn />
									</span>
									<span className="cursor-pointer hover:bg-gray-500 w-[40px] h-[40px] bg-gray-700 rounded-sm flex items-center justify-center">
										<FaFlickr />
									</span>
								</div>
							</div>
							<div className="col g-l-7">
								<div className="row">
									<div className="col g-l-4">
										<h3 className="uppercase font-bold text-[15px] border-l-[3px] px-3 border-main mb-4">
											INFORMATION
										</h3>
										<div className="flex flex-col gap-2 text-gray-300">
											<span className="hover:text-white cursor-pointer">
												Typography
											</span>
											<span className="hover:text-white cursor-pointer">
												Gallery
											</span>
											<span className="hover:text-white cursor-pointer">
												Store Location
											</span>
											<span className="hover:text-white cursor-pointer">
												Today's Deals
											</span>
											<span className="hover:text-white cursor-pointer">
												Contact
											</span>
										</div>
									</div>
									<div className="col g-l-4">
										<h3 className="uppercase font-bold text-[15px] border-l-[3px] px-3 border-main mb-4">
											WHO WE ARE
										</h3>
										<div className="flex flex-col gap-2 text-gray-300">
											<span className="hover:text-white cursor-pointer">
												Help
											</span>
											<span className="hover:text-white cursor-pointer">
												Free Shipping
											</span>
											<span className="hover:text-white cursor-pointer">
												FAQs
											</span>
											<span className="hover:text-white cursor-pointer">
												Return & Exchange
											</span>
											<span className="hover:text-white cursor-pointer">
												Testimonials
											</span>
										</div>
									</div>
									<div className="col g-l-4">
										<h3 className="uppercase font-bold text-[15px] border-l-[3px] px-3 border-main mb-4">
											#DIGITALWORLDSTORE
										</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
