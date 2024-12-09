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

// @route POST /user/set-device-config
// @requestBody
async function userSetDeviceConfig(props) {
	const { res } = props;
	
	console.log('userSetDeviceConfig')
	
	utils.postBodyParser(props, async (data) => {
		
		console.log(data)
		
		// try {			
			// const { deviceSerialNumber, email, password } = JSON.parse(data);
			
			// const user = await findByEmail(email);
			
			// if (!user) {
				// if (!checkValidationSuccess({ deviceSerialNumber, email, password })) {
					// errorResponse(res, validationErrorMessage);
					// return;
				// }
				
				// // Create new instance or update created one
				// try {
					// Event.emit('userSignUp', { 
						// deviceSerialNumber,
						// email,
						// password,
						// res
					// });
				// } catch (error) {
					// console.log(error);
				// }
			// } else {			
				// errorResponse(res, 'This email is present');
			// }
		// } catch (error) {			
			// errorResponse(res, error);
		// }
	});
}

/*
*	 GET methods
*/

// @route GET /user
// @requestQuery accessToken
//
async function userGet(props) {
  const { res, urlArray } = props;
  
  try {
    const accessToken = urlArray[1].split('?accessToken=')[1];
    
    const results = await userService.userGet(accessToken);
    
    if (results.data) {
      successResponse({ res, message: results.message, data: results.data });
      return;
    }
    
    errorResponse({ res, message: results.message, data: {} });
  } catch (error) {
    console.log('userGet error');
  }
}

module.exports = {
	userSingUp,
	userSignIn,
	userSetDeviceConfig,
  
  userGet
};