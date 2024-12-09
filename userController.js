// const Event = require('../common/events').eventBus;

const {
  responseProps: {
    headers, successCode, errorCode 
  },
  validationErrorMessage
} = require('../common/constants');
const { successResponse, errorResponse } = require('../common/utils');
const { checkValidationSuccess } = require('../common/validations');
const {
  findByEmail,
  findByEmailAndPassword,
  insertNewUser
} = require('../models/userModel');
const userService = require('../services/userService');
const utils = require('./utils');

/*
*	 POST methods
*/

//
// @route POST /user/sign-up
// @requestBody
// @data: name, email, password, serialNumber
//
async function userSingUp(props) {
  const { res } = props;

  utils.postBodyParser(props, async (data) => {
    try {
      const currentData = JSON.parse(data);

      // 1.
      const validationErrorMessage = checkValidationSuccess({ ...currentData });      
      if (validationErrorMessage) {
        errorResponse({ res, message: validationErrorMessage, data: {} });
        return;
      }

      // 2.
      const results = await userService.userInsert({ ...currentData });      
      if (results.token != null) {
        successResponse({ res, message: results.message, data: { token: results.token } });
        return;
      }
      errorResponse({ res, message: results.message, data: {} });		
    } catch (error) {	
      errorResponse({ res, message: error, data: {} });
    }
  });
}

// @route POST /user/sign-in
// @requestBody
async function userSignIn(props) {
  const { res } = props;

  utils.postBodyParser(props, async (data) => {
    try {		
      const { email, password } = JSON.parse(data);

      if (!checkValidationSuccess({ email, password })) {
        errorResponse({ res, message: validationErrorMessage, data: {} });
        return;
      }

      const insertedUser = await findByEmailAndPassword({ email, password });

      if (insertedUser.length === 0) {
        errorResponse({ res, message: 'Email or password is wrong', data: {} });
        return;
      }

      const { name, token } = insertedUser[0];

      successResponse({ res, message: 'Welcome back', data: { name, token } });
    } catch (error) {			
    errorResponse({ res, message: error, data: {} });
    }
  });
}

module.exports = {
  userSingUp,
  userSignIn
};