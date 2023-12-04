import icons from "./icons";

const { IoStar, IoStarOutline } = icons;

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
	if (number === 0) {
		for (let i = 5; i > +number; i--) {
			stars.push(<IoStarOutline color="#f1b400" />);
		}
		return stars;
	}
	for (let i = 0; i < +number; i++) {
		stars.push(<IoStar color="#f1b400" />);
	}
	for (let i = 5; i > +number; i--) {
		stars.push(<IoStarOutline color="#f1b400" />);
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
