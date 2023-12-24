const patchServices = {
  patchData: async (url = "", data = {}) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "PATCH", // Use PATCH instead of POST
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data), // Include the request payload
    });

    return response.json();
  },
};

export default patchServices;
