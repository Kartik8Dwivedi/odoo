import axios from "axios";
import Config from "../Config/serverConfig.js";

class Services {
  async getSubjectScript({ name, topic, std, temperature = 0.5 }) {
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

  async getThisApi(topic="electrostatic", grade = 11, level = "beginner") {
    try {
      const prompt = `
              You are a professional human tutor creating a personalized educational video script for a student.
              Your goal is to explain the given subtopic clearly, warmly, and at the right level of difficulty based on the student’s academic level and grasping ability.

              Context Provided (Use for guidance only):
              Name: Student’s name (do not mention)
              Class: Academic grade of the student
              Exam: The exam the student is preparing for
              Learning Capability: (0.0 to 1.0) — adjust depth, pace, and complexity accordingly:
              0.0–0.4 → very simple, beginner-level explanation
              0.4–0.7 → moderately detailed and clear
              0.7–1.0 → deeper understanding with real-world connections
              Follow this Explanation Path Strictly:
              Subject → Unit → Topic → Subtopic
              Only explain the given subtopic, but include brief background from parent topics if needed for clarity.
              Script Requirements:
              Speak directly to the student — warm, friendly, natural tone.
              Don’t sound robotic or like a bot.
              Provide a 3–5 minute explanation with step-by-step clarity.
              Use examples, analogies, and real-life comparisons where helpful.
              DO NOT ask the student any questions.
              Format: Introduction → Explanation → Emphasis on Key Takeaways → Recap Conclusion
              This is not a summary. It is a teaching script designed to guide and explain like a real classroom teacher.  

              Now tell the script only for the following details of a student:
              topic:  ${topic}
              grade:  ${grade}
              level:  ${level}
              learning capability:  ${0.5}
              `;

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mixtral-8x7b",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3005/",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
export default Services;
