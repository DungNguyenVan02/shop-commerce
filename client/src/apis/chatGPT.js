const apiKey = "sk-proj-60IGxiAvA2a9nV3q1wXvT3BlbkFJ4EKrq6BN81aPvltXYPxF";

export const apiSendQuestion = async (question) => {
	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			message: [{ role: "user", content: question }],
		}),
	})
		.then((response) => response.json())
		.then((data) => console.log(data))
		.catch((error) => console.log(error));

	return response;
};
