const slugify = require("slugify");

const generateSlug = (name) => {
	return slugify(name, { locale: "vi" });
};

module.exports = generateSlug;
