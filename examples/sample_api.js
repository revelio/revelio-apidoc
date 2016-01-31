/**
 * @api {get} /employee/:employeeId Retrieves an employee by their ID
 * @apiName GetEmployee
 * @apiResponse (success) 200 User information
 * @apiSuccess (success) {String} firstName User's first name
 * @apiSuccess (success) {String} lastName User's last name
 * @apiSuccess (success) {Integer} id User's ID
 * @apiSuccess (success) {Object} contact
 * @apiSuccess (success) {String} contact.phone
 * @apiSuccess (success) {String} contact.email
 * @apiSuccess (success) {String} contact.fax
 * @apiResponse(userNotFound) 404 User not found
 * @apiError (userNotFound) {String} error
 */
function getEmployee() {
    
}

/**
 * @api {get} /employee Searches for employees by first and last name
 * @apiName ListEmployees
 * @apiParam {String} search Search terms
 * @apiParam {Int} page Page number
 * @apiParam {Int} pageSize Number of records per page
 * @apiResponse (success) 200 List of users matching the search terms
 * @apiSuccess (success) {Object[]} results
 * @apiSuccess (success) {String} results.firstName User's first name
 * @apiSuccess (success) {String} results.lastName User's last name
 * @apiSuccess (success) {Integer} results.id User's ID
 * @apiSuccess (success) {Integer} totalCount Total number of records returned
 */
function listEmployees() {
    
}

/**
 * @api {post} /employee Create an employee
 * @apiName CreateEmployee
 * @apiParam {String} firstName User's first name
 * @apiParam {String} lastName User's last name
 * @apiParam {Object} contact
 * @apiParam {String} contact.phone
 * @apiParam {String} contact.email
 * @apiParam {String} contact.fax
 * @apiResponse (success) 200 User successfully created
 * @apiSuccess (success) {Integer} id User's Id
 * @apiResponse (invalidData) 400 Invalid data
 * @apiError (invalidData) {String[]} errors
 * @apiAuth basicAuth Username and password in base64
 * @apiAuth bearer JSON Web Token
 */
function createEmployee() {
    
}

