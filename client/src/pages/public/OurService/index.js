import { BreadcrumbHeader } from "~/components/SectionLayout";
import { ExtraInfo } from "~/components/common";
import { extraInfo } from "~/utils/contains";

function OurService() {
	return (
		<div>
			<BreadcrumbHeader category="OurService" slug="services" />
			<div className="max-w-main w-full mx-auto my-7">
				<div className="grid wide">
					<div className="row">
						<div className="col g-l-6 g-m-6 g-c-12 ">
							<img
								className="w-full object-cover"
								src="https://cdn.shopify.com/s/files/1/1636/8779/files/9069783_orig.jpg?v=1491836163"
								alt=""
							/>
						</div>
						<div className="col g-l-6 g-m-6 g-c-12">
							<div className="flex flex-col gap-1 justify-center h-full">
								<p>
									With customer expectations at an all-time
									high, customer service teams must pull out
									all the stops to ensure an excellent
									customer experience. Your interactions must
									not only be efficient, effective, and
									authentic, but you must be available through
									customers’ preferred channel.
								</p>
								<p>
									Getting more information upfront from your
									customer can help to speed up problem
									resolution. This includes providing steps to
									replicate the problem and asking for product
									specs or screenshots illustrating the issue.
								</p>
							</div>
						</div>
					</div>
					<h3 className="text-[28px] font-semibold text-center text-gray-600 my-7">
						We Offer Best Services
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
