import { useDispatch } from "react-redux";
import { showModal } from "../../redux/appSlice";
function Modal({ children }) {
	const dispatch = useDispatch();
	return (
		<div
			onClick={() => dispatch(showModal({ isShowModal: false }))}
			className="absolute top-0 right-0 bottom-0 left-0 bg-overlay z-20 flex justify-center items-center"
		>
			{children}
		</div>
	);
}

export default Modal;
