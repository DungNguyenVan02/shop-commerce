export const createSlug = (string) => {
	return string
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.split(" ")
		.join("-");
};

export const formatMoney = (money) => {
	return (money = Number(money.toFixed(1)).toLocaleString("it-IT", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 9,
	}));
};

export const renderStar = (number) => {
	if (!Number(number)) return;
	const stars = [];
	for (let i = 0; i < +number; i++) {
		stars.push(1);
	}
	for (let i = 5; i > +number; i--) {
		stars.push(0);
	}

	return stars;
};
