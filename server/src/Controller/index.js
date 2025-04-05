import Services from "../services";

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
    console.log("Error in convertTextToVideo controller layer: ", error);
    return appError(res, 500, error.message, "Internal server error");
  }
};



export const streamVideo = async (req,res) =>{
  try {
    
  } catch (error) {
      console.log("Error in streamVideo controller layer: ", error);
      return appError(res, 500, error.message, "Internal server error");
  }
}

export const doubtScript = async (req,res) =>{
  try {
    
  } catch (error) {
      console.log("Error in doubtScript controller layer: ", error);
      return appError(res, 500, error.message, "Internal server error");
  }
}

