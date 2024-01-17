import { Form, Formik, setIn } from "formik";
import {
	CustomInput,
	CustomSelect,
	Button,
	MarkdownEditor,
} from "~/components/common";
import { useSelector } from "react-redux";
import { appSelector } from "~/redux/selector";
import { schemasValidCreateProduct } from "~/utils/schemasValid";
import { useCallback, useState } from "react";
function CreateProduct() {
	const { categories } = useSelector(appSelector);
	const [brands, setBrands] = useState([]);
	const [descriptionProduct, setDescriptionProduct] = useState({
		description: "",
	});
	const [files, setFiles] = useState({
		thumb: "",
		images: [],
	});

	// Thể hiện trạng thái validate form
	const [invalidField, setInvalidField] = useState({
		description: false,
		thumb: false,
		images: false,
	});

	// get data từ MarkDown
	const onChangeValue = useCallback(
		(value) => {
			setDescriptionProduct(value);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[descriptionProduct]
	);

	const initialValues = {
		name: "",
		price: "",
		color: "",
		quantity: "",
		category: "",
	};

	const onSubmit = (data, actions) => {
		if (descriptionProduct.description === "") {
			setInvalidField((prev) => ({
				...prev,
				description: true,
			}));
		}
		if (files.thumb === "") {
			setInvalidField((prev) => ({
				...prev,
				thumb: true,
			}));
		}
		if (files.images.length === 0) {
			setInvalidField((prev) => ({
				...prev,
				images: true,
			}));
		}
		// actions.resetForm();
		const mergeObjects = { ...data, ...descriptionProduct, ...files };
		console.log(mergeObjects);
		const formData = new FormData();
		for (let i of Object.entries(mergeObjects)) {
			formData.append(i[0], i[1]);
		}
	};

	const getIdChoose = (name) => {
		const result = categories?.filter((cate) => {
			return cate.name === name;
		});
		if (result) setBrands(result[0]?.brand);
	};

	return (
		<div>
			<div className="flex items-center h-[40px] bg-gray-600 text-white px-3">
				Manage create new product
			</div>
			<div className="p-3  bg-gray-100 min-h-screen">
				<Formik
					initialValues={initialValues}
					validationSchema={schemasValidCreateProduct}
					onSubmit={onSubmit}
				>
					{(handleSubmit) => (
						<Form handleSubmit={handleSubmit}>
							<div className="flex gap-10">
								<div className="w-1/4">
									<CustomInput
										name="name"
										label="Name product"
										placeholder="Enter name product"
									/>
								</div>
								<div className="w-1/4">
									<CustomInput
										name="price"
										type="number"
										label="Price product"
										placeholder="Enter price product"
									/>
								</div>
								<div className="w-1/4">
									<CustomInput
										name="quantity"
										type="number"
										label="Quantity product"
										placeholder="Enter quantity product"
									/>
								</div>
								<div className="w-1/4">
									<CustomInput
										name="color"
										label="Color product"
										placeholder="Enter color product"
									/>
								</div>
							</div>
							<div className="flex gap-10">
								<div className="w-1/4">
									<CustomSelect
										name="category"
										label="Category product"
										getIdChoose={getIdChoose}
									>
										<option value="">
											--Choose category for product--
										</option>
										{categories?.map((cate) => (
											<option
												key={cate._id}
												value={cate.name}
											>
												{cate.name}
											</option>
										))}
									</CustomSelect>
								</div>
								<div className="w-1/4">
									<CustomSelect
										name="brand"
										label="Brand product (optional)"
									>
										<option>
											--Choose brand for product--
										</option>
										{brands?.length > 0 &&
											brands?.map((brand) => (
												<option
													key={brand}
													value={brand}
												>
													{brand}
												</option>
											))}
									</CustomSelect>
								</div>
							</div>
							<div className="flex flex-col gap-5">
								<div>
									<label
										className="text-[16px] font-medium ml-2"
										htmlFor="thumb"
									>
										Upload thumb product
									</label>
									<div className="p-1 bg-white rounded-md">
										<input
											id="thumb"
											name="thumb"
											type="file"
											onChange={(event) => {
												setFiles((prev) => ({
													...prev,
													thumb: event.target
														.files[0],
												}));
											}}
										/>
										{invalidField.thumb && (
											<div className="text-[12px] text-main">
												Invalid field
											</div>
										)}
									</div>
								</div>
								<div>
									<label
										className="text-[16px] font-medium ml-2 "
										htmlFor="images"
									>
										Upload images product
									</label>
									<div className="p-1 bg-white rounded-md">
										<input
											id="images"
											name="images"
											type="file"
											multiple={true}
											onChange={(event) => {
												setFiles((prev) => ({
													...prev,
													images: [
														...event.target.files,
													],
												}));
											}}
										/>
										{invalidField.images && (
											<div className="text-[12px] text-main">
												Invalid field
											</div>
										)}
									</div>
								</div>
							</div>
							<MarkdownEditor
								label="Description product"
								name="description"
								onChangeValue={onChangeValue}
								invalidField={invalidField}
								setInvalidField={setInvalidField}
							/>
							<Button
								styleCustom="px-3 py-1 bg-green-500 text-white rounded hover:opacity-80 my-[24px]"
								type="submit"
								title="Create new product"
							/>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default CreateProduct;
