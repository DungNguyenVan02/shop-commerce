import images from "~/assets/images";
import { formatMoney } from "~/utils/helper";
import Select from "react-select";
import { useEffect, useState } from "react";
import { apiPutReturnOrder, apiUpdateStatusOrder } from "~/apis";
import { toast } from "react-toastify";

const UpdateOrder = ({ dataUpdate, onHide, onRerender }) => {
	const [selectedOption, setSelectedOption] = useState(null);
	const [isInvalid, setIsInvalid] = useState(false);
	const options = [
		{ value: "Processing", label: "Processing" },
		{ value: "Transported", label: "Transported" },
		{ value: "Return", label: "Return" },
		{ value: "Canceled", label: "Canceled" },
	];

	useEffect(() => {
		if (selectedOption !== null) {
			setIsInvalid(false);
		}
	}, [selectedOption]);

	const handleUpdateStatus = async () => {
		if (selectedOption === null && dataUpdate?.status !== "Return") {
			setIsInvalid(true);
		} else {
			let response;
			if (dataUpdate?.status === "Return") {
				response = await apiPutReturnOrder(dataUpdate._id);
			} else {
				response = await apiUpdateStatusOrder(
					{ status: selectedOption.value },
					dataUpdate._id
				);
			}
			if (response.success) {
				onHide({ isUpdate: false, data: [] });
				onRerender((prev) => !prev);
				toast.success(response.mes);
			}
		}
	};

	return (
		<div
			className="bg-[#f5f5f5] min-w-[800px] h-[90%] overflow-y-auto"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="tagHeader"></div>
			<div className="p-3 bg-white border-b">
				<h3 className="text-[24px]">Detail order</h3>
			</div>
			<div className="mt-3 px-2 bg-white flex flex-col gap-2">
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Code: </span>
					<span>{dataUpdate?.code}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">OrderBy: </span>
					<span>{`${dataUpdate?.orderBy?.firstName} ${dataUpdate?.orderBy?.lastName}`}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Phone number: </span>
					<span>{dataUpdate?.orderBy?.phone}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Address: </span>
					<span>{dataUpdate?.address}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Quantity: </span>
					<span>{dataUpdate?.products.length}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Total: </span>
					<span>{`${dataUpdate?.total} $`}</span>
				</div>
				<div className="border p-3 rounded shadow-md">
					<span className="font-semibold">Products order</span>
					<span>
						{dataUpdate?.products.map((item) => {
							return (
								<div
									key={item._id}
									className="flex items-center p-2 mt-2 border rounded"
								>
									<img
										className="w-[50px] object-cover"
										src={
											item.thumbnail ||
											images.defaultProduct
										}
										alt=""
									/>
									<div className="text-[#333]">
										<h3>{item?.product?.name}</h3>
										<h5>{formatMoney(item.price)}</h5>
									</div>
								</div>
							);
						})}
					</span>
				</div>
				{(dataUpdate.status === "Processing" ||
					dataUpdate.status === "Transported") && (
					<div className="border p-3 rounded shadow-md">
						<span className="font-semibold">Status order </span>
						<Select
							defaultValue={selectedOption}
							onChange={setSelectedOption}
							options={options}
							formatOptionLabel={(options) => (
								<div className="flex text-[#333] items-center gap-2">
									<span>{options.label}</span>
								</div>
							)}
							className=" w-[170px]"
						/>
						{isInvalid && (
							<p className="text-[12px] text-main">
								Please choose status
							</p>
						)}
					</div>
				)}
			</div>
			<div className="flex justify-end px-5 py-2 gap-3">
				<button
					className="px-3 py-1 bg-gray-600 text-white rounded hover:opacity-80"
					onClick={() => onHide({ isUpdate: false, data: [] })}
				>
					Exit
				</button>
				<button
					className="px-3 py-2 bg-green-500 text-white rounded hover:opacity-80"
					onClick={handleUpdateStatus}
				>
					{dataUpdate.status === "Return"
						? "Confirm return and refund"
						: "Save"}
				</button>
			</div>
		</div>
	);
};

export default UpdateOrder;
