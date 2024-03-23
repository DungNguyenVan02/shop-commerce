import {
	PayPalScriptProvider,
	PayPalButtons,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiCreateOrder } from "~/apis";
import routes from "~/config/routes";

// This value is from the props in the UI
const style = { layout: "vertical" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({
	currency,
	showSpinner,
	amount,
	payload,
	onSuccess,
}) => {
	const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
	const navigate = useNavigate();
	useEffect(() => {
		dispatch({
			type: "resetOptions",
			value: {
				...options,
				currency,
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currency, showSpinner]);

	return (
		<>
			{showSpinner && isPending && <div className="spinner" />}
			<PayPalButtons
				style={style}
				disabled={false}
				forceReRender={[style, currency, amount]}
				fundingSource={undefined}
				createOrder={(data, actions) =>
					actions.order
						.create({
							purchase_units: [
								{
									amount: {
										currency_order: currency,
										value: amount,
									},
								},
							],
						})
						.then((orderID) => orderID)
				}
				onApprove={(data, actions) =>
					actions.order.capture().then(async (response) => {
						if (response.status === "COMPLETED") {
							const response = await apiCreateOrder(payload);
							if (response?.success) {
								onSuccess(true);
								setTimeout(() => {
									Swal.fire(
										"Congratulation",
										response.mes,
										"success"
									).then(() => {
										navigate(routes.home);
									});
								}, 500);
							} else {
								toast.error(response.mes);
							}
						}
					})
				}
			/>
		</>
	);
};

export default function Paypal({ amount, payload, onSuccess }) {
	return (
		<div className="w-full">
			<PayPalScriptProvider
				options={{
					clientId: "test",
					components: "buttons",
					currency: "USD",
				}}
			>
				<ButtonWrapper
					currency={"USD"}
					amount={amount}
					payload={payload}
					showSpinner={false}
					onSuccess={onSuccess}
				/>
			</PayPalScriptProvider>
		</div>
	);
}
