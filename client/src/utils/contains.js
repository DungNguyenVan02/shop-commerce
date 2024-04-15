import routes from "~/config/routes";
import icons from "./icons";
import images from "~/assets/images";
const {
	IoShieldCheckmark,
	FaShippingFast,
	IoGift,
	IoArrowUndo,
	FaPhoneAlt,
	RiDashboard3Line,
	TiGroupOutline,
	RiProductHuntLine,
	HiOutlineClipboardDocumentList,
	BiUser,
	BsCart3,
	AiOutlineHistory,
	LiaFileInvoiceDollarSolid,
	TbTruckReturn,
	GoChecklist,
	TfiWrite,
	RiSendPlaneFill,
	BsImages,
} = icons;

export const footerList = [
	{
		title: "LEO phone",
		sub: ["Giới thiệu", "Liên hệ", "Điều khoản", "Bảo mật"],
	},
	{
		title: "Sản phẩm kinh doanh",
		sub: ["Điện thoại", "Ipad", "Linh kiện, phụ tùng công nghệ"],
	},
	{
		title: "Công ty cổ phần LEO phone",
		sub: [
			"Mã số thuế: 0122977668",
			"Ngày thành lập: 03/03/2024",
			"Điều khoản",
			"Lĩnh vực: Kinh doanh sản phẩm công nghệ",
		],
	},
];

export const extraInfo = [
	{
		id: 1,
		icon: <IoShieldCheckmark size={22} color="white" />,
		title: "Bảo đảm",
		subTitle: "Sản phẩm chính hãng 100%",
	},
	{
		id: 2,
		icon: <FaShippingFast size={22} color="white" />,
		title: "Miễn phí vận chuyển",
		subTitle: "Miễn phí vận chuyển cho đơn hàng từ 10 triệu",
	},
	{
		id: 3,
		icon: <IoGift size={22} color="white" />,
		title: "Quà tặng khuyến mại",
		subTitle: "Quà tặng hấp dẫn",
	},
	{
		id: 4,
		icon: <IoArrowUndo size={22} color="white" />,
		title: "Miễn phí trả hàng",
		subTitle: "Trả hàng miễn phí trong vòng 7 ngày",
	},
	{
		id: 5,
		icon: <FaPhoneAlt size={22} color="white" />,
		title: "Tư vấn",
		subTitle: "Sẵn sàng tư vấn 24/7",
	},
];

export const tabs = [
	{
		id: 1,
		tab: "Mô tả sản phẩm",
	},
	{
		id: 2,
		tab: "Giới thiệu sản phẩm",
	},
	{
		id: 3,
		tab: "Vận chuyển",
		content: `
			PURCHASING & DELIVERY
			Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
			Picking up at the store
			Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
			Delivery
			Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
			In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.
		`,
	},
	{
		id: 4,
		tab: "Thanh toán",
		content: `
			PURCHASING & DELIVERY
			Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
			Picking up at the store
			Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
			Delivery
			Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
			In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.
		`,
	},
];

export const filterBys = [
	{
		id: 0,
		title: "Price",
		sub: [
			{
				id: 0,
				title: "Under 3 million",
			},
			{
				id: 1,
				title: "From 3-7 million",
			},
			{
				id: 2,
				title: "From 7-10 million",
			},
			{
				id: 3,
				title: "From 10-15 million",
			},
			{
				id: 4,
				title: "Over 15 million",
			},
		],
	},
	{
		id: 1,
		title: "Color",
		sub: [
			{
				id: 0,
				title: "Black",
			},
			{
				id: 1,
				title: "White",
			},
			{
				id: 2,
				title: "Gray",
			},
			{
				id: 3,
				title: "Pink",
			},
			{
				id: 4,
				title: "Blue",
			},
			{
				id: 5,
				title: "Red",
			},
		],
	},
];

export const sortBys = [
	{
		id: 1,
		title: "Latest",
		sort: "createdAt",
	},
	{
		id: 2,
		title: "Best Selling",
		sort: "-sold",
	},
	{
		id: 3,
		title: "Price low to high",
		sort: "price",
	},
	{
		id: 4,
		title: "Price high to low",
		sort: "-price",
	},
];

export const voteOptions = [
	{
		id: 1,
		vote: "Rất tệ",
	},
	{
		id: 2,
		vote: "Tệ",
	},
	{
		id: 3,
		vote: "Trung bình",
	},
	{
		id: 4,
		vote: "Tốt",
	},
	{
		id: 5,
		vote: "Rất tốt",
	},
];

export const adminSlideBar = [
	{
		id: 0,
		title: "Dashboard",
		icon: <RiDashboard3Line />,
		path: routes.admin_dashboard,
	},
	{
		id: 1,
		title: "Quản lý người dùng",
		icon: <TiGroupOutline />,
		path: routes.admin_manage_users,
	},
	{
		id: 2,
		title: "Quản lý sản phẩm",
		icon: <RiProductHuntLine />,
		children: [
			{
				id: 0,
				title: "Thêm sản phẩm",
				path: routes.admin_create_product,
			},
			{
				id: 1,
				title: "Thêm phụ kiện",
				path: routes.admin_create_accessory,
			},
			{
				id: 2,
				title: "Danh sách sản phẩm",
				path: routes.admin_manage_products,
			},
		],
	},
	{
		id: 3,
		title: "Quản lý đơn hàng",
		icon: <HiOutlineClipboardDocumentList />,
		children: [
			{
				id: 0,
				title: "Dánh sách đơn hàng",
				path: routes.admin_manage_orders,
			},
			{
				id: 1,
				title: "Danh sách đơn hoàn",
				path: routes.admin_manage_return,
			},
			{
				id: 2,
				title: "Danh sách đơn hủy",
				path: routes.admin_manage_canceled,
			},
		],
	},
	{
		id: 4,
		title: "Quản lý bài viết",
		icon: <TfiWrite size={16} />,
		children: [
			{
				id: 0,
				title: "Thêm bài viết",
				path: routes.admin_create_blog,
			},
			{
				id: 1,
				title: "Danh sách bài viết",
				path: routes.admin_manage_blogs,
			},
		],
	},
	{
		id: 5,
		title: "Quản lý slide",
		icon: <BsImages size={16} />,
		path: routes.admin_manage_slide,
	},
	{
		id: 6,
		title: "Tin nhắn",
		icon: <RiSendPlaneFill />,
		path: routes.admin_chat,
	},
];

export const memberSlideBar = [
	{
		id: 0,
		title: "Cá nhân",
		icon: <BiUser />,
		path: routes.member_personal,
	},
	{
		id: 1,
		title: "Danh sách yêu thích",
		icon: <GoChecklist />,
		path: routes.member_wishlist,
	},
	{
		id: 2,
		title: "Giỏ hàng",
		icon: <BsCart3 />,
		path: routes.member_cart,
	},
	{
		id: 3,
		title: "Đơn đặt hàng",
		icon: <LiaFileInvoiceDollarSolid />,
		path: routes.member_order,
	},

	{
		id: 4,
		title: "Trả hàng hoàn tiền",
		icon: <TbTruckReturn />,
		path: routes.member_return,
	},
	{
		id: 5,
		title: "Lịch sử mua hàng",
		icon: <AiOutlineHistory />,
		path: routes.member_history,
	},
];

export const optionsRam = ["4 GB", "6 GB", "8 GB", "16 GB", "32 GB", "64 GB"];

export const optionsInternalMemory = [
	"32 GB",
	"64 GB",
	"128 GB",
	"256 GB",
	"512 GB",
	"1 T",
];
