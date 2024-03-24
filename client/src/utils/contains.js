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
		subTitle: "SẴn sàng tư vấn 24/7",
	},
];

export const tabs = [
	{
		id: 1,
		tab: "Mô tả sản phẩm",
	},
	{
		id: 2,
		tab: "Cam kết sản phẩm",
		content: `
			WARRANTY INFORMATION
			LIMITED WARRANTIES
			Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:

			Frames Used In Upholstered and Leather Products
			Limited Lifetime Warranty
			A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.
		`,
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
		vote: "Terrible",
	},
	{
		id: 2,
		vote: "Poor",
	},
	{
		id: 3,
		vote: "Average",
	},
	{
		id: 4,
		vote: "Good",
	},
	{
		id: 5,
		vote: "Excellent",
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
		title: "Manage users",
		icon: <TiGroupOutline />,
		path: routes.admin_manage_users,
	},
	{
		id: 2,
		title: "Manage product",
		icon: <RiProductHuntLine />,
		children: [
			{
				id: 0,
				title: "Create product",
				path: routes.admin_create_product,
			},
			{
				id: 1,
				title: "Manage products",
				path: routes.admin_manage_products,
			},
		],
	},
	{
		id: 3,
		title: "Manage order",
		icon: <HiOutlineClipboardDocumentList />,
		children: [
			{
				id: 0,
				title: "List orders",
				path: routes.admin_manage_orders,
			},
			{
				id: 1,
				title: "Return and refund",
				path: routes.admin_manage_return,
			},
			{
				id: 2,
				title: "Canceled",
				path: routes.admin_manage_canceled,
			},
		],
	},
	{
		id: 4,
		title: "Manage blog",
		icon: <TfiWrite size={16} />,
		children: [
			{
				id: 0,
				title: "Write blog",
				path: routes.admin_create_blog,
			},
			{
				id: 1,
				title: "Manage blogs",
				path: routes.admin_manage_blogs,
			},
		],
	},
];

export const memberSlideBar = [
	{
		id: 0,
		title: "Personal",
		icon: <BiUser />,
		path: routes.member_personal,
	},
	{
		id: 1,
		title: "Wishlist",
		icon: <GoChecklist />,
		path: routes.member_wishlist,
	},
	{
		id: 2,
		title: "My cart",
		icon: <BsCart3 />,
		path: routes.member_cart,
	},
	{
		id: 3,
		title: "My order",
		icon: <LiaFileInvoiceDollarSolid />,
		path: routes.member_order,
	},

	{
		id: 4,
		title: "Return and refund",
		icon: <TbTruckReturn />,
		path: routes.member_return,
	},
	{
		id: 5,
		title: "History order",
		icon: <AiOutlineHistory />,
		path: routes.member_history,
	},
];

export const slider = [
	{
		id: 1,
		src: images.slide1,
	},
	{
		id: 2,
		src: images.slide2,
	},
	{
		id: 3,
		src: images.slide3,
	},
	{
		id: 4,
		src: images.slide4,
	},
];
