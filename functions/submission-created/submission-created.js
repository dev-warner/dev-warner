const fetch = require("node-fetch");
const { ERRORS } = require("./errors");

const URL = "https://api.buttondown.email/v1/subscribers";

exports.handler = async function (e) {
  try {
    if (e.httpMethod === "POST") {
      const { payload } = JSON.parse(e.body);
      const { email } = payload;

      if (!email) {
        throw new Error(ERRORS.INVALID_PARAMS);
      }

      const res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.BUTTON_DOWN_EMAIL}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return {
        statusCode: 200,
        body: "",
      };
    }
  } catch (error) {
    const { message } = error;
    const UNKNOWN = !Object.values(ERRORS).includes(message);

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          message: UNKNOWN ? ERRORS.UNKNOWN : message,
        },
      }),
    };
  }
};
