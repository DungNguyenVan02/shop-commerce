import moment from "moment";
import icons from "./icons";

const { FaStar, FaRegStar, FaRegStarHalfStroke } = icons;

export const createSlug = (string) => {
	//Đổi ký tự có dấu thành không dấu
	string = string.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
	string = string.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
	string = string.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
	string = string.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
	string = string.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
	string = string.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
	string = string.replace(/đ/gi, "d");
	//Xóa các ký tự đặt biệt
	string = string.replace(
		/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
		""
	);
	//Đổi khoảng trắng thành ký tự gạch ngang
	string = string.replace(/ /gi, "-");
	//Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
	//Phòng trường hợp người nhập vào quá nhiều ký tự trắng
	string = string.replace(/\-\-\-\-\-/gi, "-");
	string = string.replace(/\-\-\-\-/gi, "-");
	string = string.replace(/\-\-\-/gi, "-");
	string = string.replace(/\-\-/gi, "-");
	//Xóa các ký tự gạch ngang ở đầu và cuối
	string = "@" + string + "@";
	string = string.replace(/\@\-|\-\@|\@/gi, "");
	return string;
};

export const formatMoney = (money) => {
	return (money = Number(money?.toFixed(1)).toLocaleString("it-IT", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 9,
	}));
};

export const renderStar = (number) => {
	if (isNaN(number)) return;
	const stars = [];

	const check = number.toString().split(".")[1];

	if (+check === 5) {
		for (let i = 0; i < Math.floor(number); i++) {
			stars.push(<FaStar color="orange" />);
		}

		stars.push(<FaRegStarHalfStroke color="orange" />);

		for (let i = 5; i > Math.round(number); i--) {
			stars.push(<FaRegStar color="orange" />);
		}
	} else if (+check < 5 || +check > 5) {
		for (let i = 0; i < Math.floor(number); i++) {
			stars.push(<FaStar color="orange" />);
		}
		for (let i = 5; i > Math.floor(number); i--) {
			stars.push(<FaRegStar color="orange" />);
		}
	} else {
		for (let i = 0; i < Math.floor(number); i++) {
			stars.push(<FaStar color="orange" />);
		}
		for (let i = 5; i > Math.floor(number); i--) {
			stars.push(<FaRegStar color="orange" />);
		}
	}
	return stars;
};

export const formatTimes = (number) => {
	number = Number(number) / 1000;
	const h = Math.floor(number / 3600);
	const m = Math.floor((number % 3600) / 60);
	const s = Math.floor((number % 3600) % 60);
	return { h, m, s };
};

export const generateRange = (start, end) => {
	const length = end + 1 - start;
	return Array.from({ length }, (el, i) => {
		return start + i;
	});
};

export const getMoneyByTime = (time, type, orders) => {
	const filterOrderByTime = orders.filter((order) => {
		if (type === "YYYY") {
			return (
				+moment(order.createdAt).format(type) === time &&
				order.status === "Giao hàng thành công"
			);
		} else {
			return (
				+moment(order.createdAt).format(type) ===
				(type === "MM" ? time : +moment(time).format(type))
			);
		}
	});

	let result = 0;

	if (filterOrderByTime.length > 0) {
		result = filterOrderByTime?.reduce((rs, item) => rs + item.total, 0);
	}

	return formatMoney(result);
};
