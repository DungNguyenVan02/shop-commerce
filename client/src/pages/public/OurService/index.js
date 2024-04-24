import { BreadcrumbHeader } from "~/components/SectionLayout";
import { ExtraInfo } from "~/components/common";
import { extraInfo } from "~/utils/contains";

function OurService() {
	return (
		<div className="px-[24px]">
			<div className="mx-[-24px]">
				<BreadcrumbHeader category="OurService" slug="services" />
			</div>
			<div className="max-w-main w-full mx-auto my-7">
				<div className="grid wide">
					<div className="row">
						<div className="col g-l-6 g-m-6 g-c-12 ">
							<img
								loading="lazy"
								className="w-full object-cover"
								src="https://cdn.shopify.com/s/files/1/1636/8779/files/9069783_orig.jpg?v=1491836163"
								alt=""
							/>
						</div>
						<div className="col g-l-6 g-m-6 g-c-12">
							<div className="flex flex-col gap-5 justify-center h-full">
								<p>
									Với kỳ vọng của khách hàng ở mức cao nhất
									mọi thời đại, các nhóm dịch vụ khách hàng
									phải nỗ lực hết mình để đảm bảo trải nghiệm
									tuyệt vời cho khách hàng. Các tương tác của
									bạn không chỉ phải hiệu quả, hiệu quả và xác
									thực mà còn phải có mặt thông qua kênh ưa
									thích của khách hàng.
								</p>
								<p>
									Nhận thêm thông tin trước từ khách hàng của
									bạn có thể giúp tăng tốc độ giải quyết vấn
									đề. Điều này bao gồm việc cung cấp các bước
									để tái tạo sự cố và yêu cầu thông số kỹ
									thuật của sản phẩm hoặc ảnh chụp màn hình
									minh họa sự cố.
								</p>
							</div>
						</div>
					</div>
					<h3 className="text-[28px] font-semibold text-center text-gray-600 my-7">
						Chúng tôi cung cấp dịch vụ tốt nhất
					</h3>
					<div className="row">
						{extraInfo.map((extra) => {
							return (
								<div
									key={extra.id}
									className="col g-l-4 g-m-6 g-c-12 mt-2"
								>
									<ExtraInfo
										icon={extra.icon}
										title={extra.title}
										subTitle={extra.subTitle}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default OurService;
