/* eslint-disable react-hooks/rules-of-hooks */
const jwt_decode = require( "jwt-decode");
const { isEmpty } = require("lodash");
const { useNavigate,useState } = require("react-router-dom");

function authorisedUserOnly() {
  const token = localStorage.getItem("token") ?? "";

  if (isEmpty(token)) {
    window.location.href = "/login";
  }
}
 function userDetails() {
  authorisedUserOnly();
  const token = localStorage.getItem("token") ?? "";
  if (!isEmpty(token)) {
   return jwt_decode(token);
  }
  return {};
}

module.exports={
  authorisedUserOnly,userDetails
}