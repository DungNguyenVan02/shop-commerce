import icons from "./icons";

const { FaStar, FaRegStar, FaRegStarHalfStroke } = icons;

export const createSlug = (string) => {
	return string
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.split(" ")
		.join("-");
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

// export const getBase64 = (file) => {
// 	return new Promise((resolve, reject) => {
// 		const reader = new FileReader();
// 		reader.readAsDataURL(file);
// 		reader.onload = () => resolve(reader.result);
// 		reader.onerror = (error) => reject(error);
// 	});
// };
