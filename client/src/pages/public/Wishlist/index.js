import { useSelector } from "react-redux";
import { Product } from "~/components/Product";
import { userSelector } from "~/redux/selector";

const Wishlist = () => {
	const { currentUser } = useSelector(userSelector);

	return (
		<div className="px-[30px] pb-[24px] bg-white shadow-lg">
			<div className="py-[18px] border-b mb-6">
				<h3 className="text-[#222] font-medium text-[18px]">
					My wishlist
				</h3>
				<h4 className="text-[#555] text-[16px]">
					Manage your wishlist
				</h4>
			</div>
			<div className="grid wide">
				<div className="row">
					{currentUser?.wishlist?.map((item) => (
						<div key={item._id} className="col g-l-4 mt-2">
							<Product data={item} productPage />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Wishlist;
