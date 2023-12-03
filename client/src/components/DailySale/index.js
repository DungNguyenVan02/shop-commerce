import icons from "../../utils/icons";

function DailySale() {
	const { IoStar } = icons;

	return (
		<div className="border p-5">
			<div className="relative flex items-center justify-center text-[20px] font-semibold text-[#505050]">
				<IoStar color="#d11" className="absolute left-0" />
				<h3>DAILY DEALS</h3>
			</div>
			<img
				src="https://digital-world-2.myshopify.com/cdn/shop/products/Untitled-189_400x.jpg?v=1491404918"
				alt=""
			/>
			<div className="flex flex-col items-center text-[16px]">
				<h3 className="line-clamp-1">Motorola Moto 360 (2nd gen)</h3>
				<div className="flex gap-1 mt-1">
					<IoStar className="text-star" />
					<IoStar className="text-star" />
					<IoStar className="text-star" />
					<IoStar className="text-star" />
					<IoStar className="text-star" />
				</div>
				<span className="my-5">8.483.762 VND</span>
			</div>
			<div className="flex justify-center items-center gap-4">
				<div className="flex flex-col items-center w-[70px] p-2 bg-[#f4f4f4] px-[5px]">
					0<p>Hours</p>
				</div>
				<div className="flex flex-col items-center w-[70px] p-2 bg-[#f4f4f4] px-[5px]">
					0<p>Minutes</p>
				</div>
				<div className="flex flex-col items-center w-[70px] p-2 bg-[#f4f4f4] px-[5px]">
					0<p>Seconds</p>
				</div>
			</div>
			<button className="mt-4 bg-main w-full py-2 px-3 text-white text-[14px] rounded hover:bg-[#333]">
				Buy
			</button>
		</div>
	);
}

export default DailySale;
