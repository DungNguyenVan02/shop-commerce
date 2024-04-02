import { useEffect, useState } from "react";
import Select from "react-select";
import icons from "~/utils/icons";
import { addressFake } from "~/config/fakeData";
import { Button, CustomInput } from "../common";
import { Form, Formik } from "formik";

import { schemasValidAddress } from "~/utils/schemasValid";
import { apiUpdateAddress } from "~/apis";
import withBaseComponent from "../hocs/withBaseComponent";
import { getCurrentUser } from "~/redux/asyncActions";
import { toast } from "react-toastify";

const Address = ({ onClose, dispatch, onReload }) => {
	const { FiMapPin } = icons;
	const [isValid, setIsValid] = useState(false);

	const [province, setProvince] = useState(null);
	const [optionProvince, setOptionProvince] = useState([]);

	const [district, setDistrict] = useState(null);
	const [optionDistrict, setOptionDistrict] = useState([]);

	const [commune, setCommune] = useState(null);
	const [optionCommune, setOptionCommune] = useState([]);

	useEffect(() => {
		const result = addressFake?.province?.map((province) => ({
			label: province.name,
			value: province.idProvince,
		}));
		setOptionProvince(result);
	}, []);

	useEffect(() => {
		if (province) {
			const filterDistrictByProvince = addressFake?.district?.filter(
				(item) => item.idProvince === province.value
			);

			if (filterDistrictByProvince) {
				const result = filterDistrictByProvince?.map((district) => ({
					label: district.name,
					value: district.idDistrict,
				}));
				setOptionDistrict(result);
			}
		}
	}, [province]);

	useEffect(() => {
		if (district) {
			const filterCommuneByDistrict = addressFake?.commune?.filter(
				(item) => item.idDistrict === district.value
			);
			if (filterCommuneByDistrict) {
				const result = filterCommuneByDistrict?.map((commune) => ({
					label: commune.name,
					value: commune.idCommune,
				}));
				setOptionCommune(result);
			}
		}
	}, [district]);

	const onSubmit = async (data) => {
		if (!isValid) {
			const payload = {
				address: `${commune.label}, ${district.label}, ${province.label}`,
				detail: data.address,
			};
			const response = await apiUpdateAddress(payload);

			if (response?.success) {
				dispatch(getCurrentUser());
				onReload((prev) => !prev);
				onClose(false);
				toast.success(response?.mes);
			} else {
				toast.error(response?.mes);
			}
		}
	};

	const handleValidateFrom = () => {
		if (!province || !district || !commune) {
			setIsValid(true);
		}
	};

	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className="w-[60%] bg-white  rounded-xl shadow-custom_1 animate-slideTopForm "
		>
			<Formik
				initialValues={{ address: "" }}
				validationSchema={schemasValidAddress}
				onSubmit={onSubmit}
			>
				{({ handleSubmit }) => (
					<Form onSubmit={handleSubmit}>
						<div className="h-[60px] border-b bg-[#f2f2f2] rounded-tl-xl rounded-tr-xl flex gap-2 items-center pl-5 font-medium">
							<FiMapPin size={20} />
							Chọn địa chỉ của bạn
						</div>
						<div className="grid wide p-5">
							<div className="row">
								<div className="col g-l-4 g-m-12 g-c-12">
									<label>Chọn tỉnh, thành phố</label>
									<Select
										isClearable={true}
										onChange={(city) => setProvince(city)}
										options={optionProvince}
									/>
									{isValid && !province && (
										<p className="text-[12px] text-main">
											Vui lòng chọn trường này
										</p>
									)}
								</div>
								<div className="col g-l-4 g-m-12 g-c-12">
									<label>Chọn quận, huyện</label>
									<Select
										isClearable={true}
										onChange={(district) =>
											setDistrict(district)
										}
										options={optionDistrict}
									/>
									{isValid && !district && (
										<p className="text-[12px] text-main">
											Vui lòng chọn trường này
										</p>
									)}
								</div>
								<div className="col g-l-4 g-m-12 g-c-12">
									<label>Chọn xã, phường</label>
									<Select
										isClearable={true}
										onChange={(commune) =>
											setCommune(commune)
										}
										options={optionCommune}
									/>
									{isValid && !commune && (
										<p className="text-[12px] text-main">
											Vui lòng chọn trường này
										</p>
									)}
								</div>
								<div className="col g-l-12 g-m-12 g-c-12 mt-3">
									<CustomInput
										name="address"
										label="Địa chỉ chi tiết của bạn"
										placeholder="Nhập địa chỉ của bạn"
									/>
								</div>
								<div className="col g-l-4 g-m-4 g-c-12">
									<Button
										styleCustom="px-4 py-2 bg-blue-500 text-white rounded hover:opacity-80 "
										type="submit"
										title="Lưu lại"
										handleClick={handleValidateFrom}
									/>
								</div>
							</div>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default withBaseComponent(Address);
