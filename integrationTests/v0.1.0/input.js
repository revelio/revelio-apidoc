
/**
 * @api {get} /some/endpoint Some Endpoint's description
 * @apiName SomeEndpoint
 * 
 */
function someEndpoint() {
    
}

/**
 * @api {get} /endpoint/withSuccess
 * @apiName endpointWithSuccessResponse
 * @apiDescription This endpoint has a success response
 * @apiSuccess (200) {String} param1 A parameter in the response
 * @apiSuccess (200) {Number} param2 An integer parameter
 * @apiSuccess (200) {Object} complex
 * @apiSuccess (200) {String} complex.innerProperty An inner property
 */
function endpointWithSuccessResponse() {
    
}

/**
 * @api {post} /endpoint/complexObject
 * @apiName endpointWithComplexParameter
 * @apiDescription This endpoint has a complex object
 * @apiParam {String} complex.innerProperty An inner property that occurs before the base object
 * @apiParam {Object} complex
 */
function endpointWithComplexParameter() {
    
}
/**
 * @api {get} /endpoint/queryString
 * @apiName endpointWithQueryStringParameters
 * @apiDescription This endpoint has query string parameters
 * @apiParam {String} stringParam A string parameter
 * @apiParam {Int32} Int32Param An Int32 parameter
 */
function endpointWithQueryStringParameters() {
    
}

/**
 * @api {get} /endpoint/array
 * @apiName endpointWithArray
 * @apiDescription This endpoint has an array
 * @apiSuccess (200) {String[]} stringArray
 * @apiSuccess (200) {Object[]} complexArray
 * @apiSuccess (200) {Number} complexArray.someNumber
 */
function endpointWithArray() {
    
}

/**
 * @api {get} /endpoint/optional
 * @apiName endpointWithOptional
 * @apiDescription This endpoint has an optional parameter
 * @apiParam {String} notOptional
 * @apiParam {String} [optional]
 */
function endpointWithOptional() {
    
}

/**
 * @api {get} /endpoint/errors
 * @apiName endpointWithErrors
 * @apiDescription This endpoint has errors
 * @apiError (404) {String} errors Some errors
 * @apiError (404) {Int32} errorCode An error code
 * @apiError (401) {String} user
 * @apiError (401) {String} missingPermission
 */
function endpointWithErrors() {
    
}

/**
 * @api {get} /endpoint/namedsuccess
 * @apiName endpointWithNamedSuccess
 * @apiDescription This endpoint has a named success
 * @apiResponse (success) 201 Everything is good
 * @apiError (success) {String} name User name
 * @apiError (success) {Int32} id User Id
 */
function endpointWithNamedSuccess() {
    
}

/**
 * @api {get} /endpoint/namederror
 * @apiName endpointWithNamedError
 * @apiDescription This endpoint has a named error
 * @apiResponse (userNotFound) 404 User not found
 * @apiError (userNotFound) {String} errors Some errors
 * @apiError (userNotFound) {Int32} errorCode An error code
 */
function endpointWithNamedError() {
    
}