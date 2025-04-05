import Config from "../Config/serverConfig.js";

class Services {
  async getSubjectScript({name, topic, std, temperature = 0.5}) {
    try {
      const options = {
        method: "GET",
        url: Config.StationsURI,
        params: { query: data },
        headers: {
          "X-RapidAPI-Key": Config.RapidAPIKey,
          "X-RapidAPI-Host": Config.RapidAPIHost,
        },
      };
      const response = await axios.request(options);
      return response.data.data;
    } catch (error) {
      console.log("Error in station service layer", error);
      throw new Error(error);
    }
  }
}
export default Services;
