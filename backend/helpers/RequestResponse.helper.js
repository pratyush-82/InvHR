const { request } = require("express");

function sendResponse(expressRes, result, message = "", data = {}) {
  const returnResult = {};
  returnResult.message = message;
  if (Object.keys(data).length > 0) returnResult.data = data;
  if (result == true || result === 200) {
    returnResult.result = true;
    expressRes.status(200).json(returnResult);
  } else {
    returnResult.result = false;
    expressRes.status(400).json(returnResult);
  }
}

function requestSuccess() {
  const argLen = arguments.length;

  if (argLen == 1) {
    requestResponse(
      arguments[0],
      true,
      200,
      200,
      "Your request completed successfully"
    );
  }

  if (argLen == 2) {
    const paramsType = typeof arguments[1];

    if (paramsType == "number") {
      requestResponse(
        arguments[0],
        true,
        200,
        arguments[1],
        "Your request completed successfully"
      );
    }

    if (paramsType == "string") {
      requestResponse(arguments[0], true, 200, 200, arguments[1]);
    }

    if (paramsType != "number" && paramsType != "string") {
      requestResponse(
        arguments[0],
        true,
        200,
        200,
        "Your request completed successfully",
        arguments[1]
      );
    }
  }
  if (argLen == 3) {
    if (typeof arguments[1] == "number" && typeof arguments[2] == "string") {
      requestResponse(arguments[0], true, 200, arguments[1], arguments[2]);
    }

    if (
      typeof arguments[1] == "number" &&
      (typeof arguments[2] == "object" || typeof arguments[2] == "array")
    ) {
      requestResponse(
        arguments[0],
        true,
        200,
        arguments[1],
        "Your request completed successfully",
        arguments[2]
      );
    }

    if (
      typeof arguments[1] == "string" &&
      (typeof arguments[2] == "object" || typeof arguments[2] == "array")
    ) {
      requestResponse(arguments[0], true, 200, 200, arguments[1], arguments[2]);
    }
  }
  if (argLen == 4) {
    requestResponse(
      arguments[0],
      true,
      200,
      arguments[1],
      arguments[2],
      arguments[3]
    );
  }
}

function requestFail() {
  const argLen = arguments.length;

  if (argLen == 1) {
    requestResponse(
      arguments[0],
      false,
      400,
      400,
      "Bad request. Can't continue with this request."
    );
  }

  if (argLen == 2 && typeof arguments[1] == "number") {
    requestResponse(
      arguments[0],
      false,
      400,
      arguments[1],
      "Bad request. Can't continue with this request."
    );
  }

  if (argLen == 2 && typeof arguments[1] == "string") {
    requestResponse(arguments[0], false, 400, 400, arguments[1]);
  }

  if (
    argLen == 3 &&
    typeof arguments[1] == "number" &&
    typeof arguments[2] == "string"
  ) {
    requestResponse(arguments[0], false, 400, arguments[1], arguments[2]);
  }
}

// test cases

// reqSuccess(res,code)
// reqSuccess(res,"message")
// reqSuccess(res,data)
// reqSuccess(res,code,message)
// reqSuccess(res,code,data)
// reqSuccess(res,message,data)
// reqSuccess(res,code,message,data)

function requestResponse(res, reqResult, reqCode, code, message, data = null) {
  const resultData = {
    result: reqResult,
    code,
    message,
  };
  if (data) resultData.data = data;
  return res.status(reqCode).json(resultData);
}

module.exports = {
  sendResponse,
  requestSuccess,
  requestFail,
};
