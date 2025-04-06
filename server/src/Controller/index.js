import Services from "../services/index.js";
import { appError, appSuccess } from "../Config/responses.js";
import axios from "axios";
import Config from "../Config/serverConfig.js";
import fs from 'fs';
import path, {dirname} from "path";
import { fileURLToPath } from "url";

const services = new Services();

export const getSubjectScript = async (req, res) => {
  try {
    if (!req.body || !req.body.name || !req.body.topic || !req.body.class) {
      console.log("Request body was empty, returning from controller layer");
      return appError(
        res,
        400,
        "Request body is empty, add all of the fields, name, topic and class are a must, followed by temperature variable",
        "Status code is required"
      );
    }
    const data = await services.getSubjectScript(
      req.body.name,
      req.body.topic,
      req.body.std,
      req.body.temperature
    );
    if (!data) {
      return appError(
        res,
        404,
        "Unable to generate script for the class",
        "Status failed"
      );
    }
    return appSuccess(res, 201, data, "Script generated successfully");
  } catch (error) {
    console.log("Error in subjectscript controller layer: ", error);
    return appError(res, 500, error.message, "Internal server error");
  }
};

export const getThisApi = async (req, res) => {
  try {
    // topic grade level are the parameters required that we will be taking from the user
    if (!req.body || !req.body.topic || !req.body.grade || !req.body.level) {
      console.log("Request body was empty, returning from controller layer");
      return appError(
        res,
        400,
        "Request body is empty, add all of the fields, topic, grade and level are a must, followed by temperature variable",
        "Status code is required"
      );
    }
    const data = await services.getThisApi(
      req.body.topic,
      req.body.grade,
      req.body.level
    );
    if (!data) {
      return appError(
        res,
        404,
        "Unable to generate script for the class",
        "Status failed"
      );

    }
    return appSuccess(res, 201, data, "Script generated successfully");
  } catch (error) {
    console.log("Error in this api controller layer: ", error);
    return appError(res, 500, error.message, "Internal server error");
  }
}  

export async function helper(){
  createTalkingHead()
    .then(() => console.log("Video generation completed successfully!"))
    .catch((err) => console.error("Failed to generate video:", err));
}

export async function createTalkingHead(
  text = "Hello hackathon judges! This is our amazing project demo using D-ID API.",
  imageUrl = "https://as2.ftcdn.net/jpg/05/70/57/47/1000_F_570574724_HWfki1q3XZt9WzVlCcQujOV5Jxe8UBG1.jpg", // Fixed single URL
  outputFile = "output.mp4"
) {
  try {
    // 1. Validate input first
    if (!text || !imageUrl) {
      throw new Error("Missing required parameters: text or imageUrl");
    }

    // 2. Create the talk with enhanced payload
    const payload = {
      script: {
        type: "text",
        input: text,
        provider: {
          type: "microsoft",
          voice_id: "en-US-JennyNeural",
          ssml: false,
        },
      },
      source_url: imageUrl,
      config: {
        fluent: true,
        pad_audio: 0.0,
        align_driver: true,
        sharpen: true,
        stitch: true,
      },
    };

    console.log(
      "Creating talk with payload:",
      JSON.stringify(payload, null, 2)
    );

    const talkResponse = await axios({
      method: "post",
      url: `${Config.DID_API_URI}/talks`,
      data: payload,
      headers: {
        Authorization: `Basic ${Config.DID_API}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 30000, // 30 second timeout
    });

    const talkId = talkResponse.data.id;
    console.log(`Talk created with ID: ${talkId}`);
    console.log("Initial response:", talkResponse.data);

    // 3. Enhanced polling with timeout
    const startTime = Date.now();
    const timeoutMs = 300000; // 5 minute timeout
    let resultUrl;

    while (Date.now() - startTime < timeoutMs) {
      const statusResponse = await axios({
        method: "get",
        url: `${Config.DID_API_URI}/talks/${talkId}`,
        headers: {
          Authorization: `Basic ${Config.DID_API}`,
        },
        timeout: 10000,
      });

      console.log("Polling status:", statusResponse.data.status);

      if (statusResponse.data.status === "done") {
        resultUrl = statusResponse.data.result_url;
        console.log("Result URL:", resultUrl);
        break;
      } else if (statusResponse.data.status === "error") {
        console.error("Error details:", statusResponse.data);
        throw new Error(
          `Video generation failed: ${JSON.stringify(
            statusResponse.data.error
          )}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (!resultUrl) {
      throw new Error("Processing timeout exceeded");
    }

    // 4. Download with audio verification
    console.log("Downloading video...");
    const videoResponse = await axios({
      method: "get",
      url: resultUrl,
      responseType: "stream",
      timeout: 60000,
    });

    // Verify content type is video
    const contentType = videoResponse.headers["content-type"];
    if (!contentType || !contentType.includes("video")) {
      throw new Error(`Unexpected content type: ${contentType}`);
    }

    const writer = fs.createWriteStream(outputFile);
    videoResponse.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(`Video successfully saved to ${outputFile}`);
        verifyVideoAudio(outputFile) // Additional verification
          .then(resolve)
          .catch(reject);
      });
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    throw error;
  }
}

// Helper function to verify video contains audio
async function verifyVideoAudio(filePath) {
  return new Promise((resolve, reject) => {
    // Using ffprobe to check for audio stream
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "a",
      "-show_entries",
      "stream=codec_type",
      "-of",
      "csv=p=0",
      filePath,
    ]);

    let output = "";
    ffprobe.stdout.on("data", (data) => (output += data.toString()));
    ffprobe.stderr.on("data", (data) => console.error(data.toString()));

    ffprobe.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`FFprobe exited with code ${code}`));
      }
      if (!output.includes("audio")) {
        return reject(new Error("Generated video contains no audio stream"));
      }
      resolve();
    });
  });
}

export const convertTextToVideo = async (req, res) => {
  try {
    if (!req.body || !req.body.id) {
      console.log("Request body was empty, returning from controller layer");
      return appError(
        res,
        400,
        "Request body is empty, add all of the fields, name, topic and class are a must, followed by temperature variable",
        "Status code is required"
      );
    }
    const data = await services.getVideo(
      req.body.id
    );
    if (!data) {
      return appError(
        res,
        404,
        "Unable to generate video",
        "Status failed"
      );
    }
    return appSuccess(res, 201, data, "video generated successfully");
  } catch (error) {
    console.log("Error in convertTextToVideo controller layer: ", error);
    return appError(res, 500, error.message, "Internal server error");
  }
};

export const streamVideo = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Check if the parameter exists
    console.log("Request.body:", req.body);
    let vidName;
    if (!req.body || !req.body.videoName) {
      vidName = "1101101.mp4";
    }else
     vidName = req.body.videoName;
    


    let videoPath = path.join(__dirname, "Videos", vidName);
    if (!videoPath.endsWith(".mp4")) {
      videoPath += ".mp4";
    }
    console.log("Video path:", videoPath);

    
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle partial content (streaming)
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Handle full video request
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
      console.log("Error in streamVideo layer: ", error);
      return appError(res, 500, error.message, "Internal server error");
  }
};


export const doubtScript = async (req,res) =>{
  try {
    
  } catch (error) {
      console.log("Error in doubtScript controller layer: ", error);
      return appError(res, 500, error.message, "Internal server error");
  }
}

