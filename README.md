# revelio-apidoc
Adapter to publish [apidoc](https://github.com/apidoc/apidoc) documentation to a [Revelio](https://www.getrevelio.com) site


## Command line parameters

`revelio-apidoc <path_to_configuration_file> <revelio_url> [configuration_name] [options]`

- `path_to_configurationFile` - File path to your configuration file
- `revelio_url` - URL of your Revelio installation
- `configuration_name` (optional) - Name of the configuration to use
- `options`
 - `--publicKey <publicKey>` - Public API key. Only necessary if your Revelio server requires API key authentication
 - `--secretKey <secretKey>` - Secret API key. Only necessary if your Revelio server requires API key authentication

## Configuration file

In order to publish documentation to Revelio, you need to create a Revelio configuration file.
This contains information about how to read documentation from your code and 
how it should be shown in Revelio.


### Basic file
 ```json
 {
     "url": "http://myapiurl.com",
     "targets": [ "../lib/endpoints", "../lib/otherEndpoints" ],
     "path": "Sample Group/My API/QA/v1.2.3"
 }
 ```

### Multiple configurations
```json
 {
     "targets": [ "../lib/endpoints", "../lib/otherEndpoints" ],
     "configurations": {
         "DEV": {
            "url": "http://dev.myapiurl.com",
            "path": "Sample Group/My API/DEV/v1.2.3"
         },
         "QA": {
            "url": "http://qa.myapiurl.com",
            "path": "Sample Group/My API/QA/v1.2.3"
         },
         "PROD": {
            "url": "http://myapiurl.com",
            "path": "Sample Group/My API/PROD/v1.2.3"
         }
 }
```
 
## Supported attributes

The following are standard apiDoc attributes that Revelio supports
- `@api {method} route description` **Required**
 - Marks this as an endpoint with the given HTTP method and route.
 - Description is optional
 - Example: `@api {get} /employee/:employee_id Gets an employee's information`
- `@apiName friendly_endpoint_name` *Optional*
 - Gives the endpoint a name, otherwise apiDoc will attempt to give one based on the route
 - Example: `@apiName GetEmployee`
- `@apiDescription Description text` *Optional*
 - Gives this endpoint a description
 - Example: `@apiDescription Gets an employee's information`
- `@apiParam {type} field_name field_description` *Optional*
 - Used to describe input for the endpoint: query string parameters for GET and DELETE, or
 a JSON object for POST and PUT. See below for examples
- `@apiSuccess (group_name) {type} field_name field_description` *Optional*
 - Used to describe the response for a successful request. Similar to `@apiParam`. See below for examples
- `@apiError (group_name) {type} field_name field_description` *Optional*
 - Used to describe responses for an erroroneous request. Similar to `@apiSuccess`. See below for examples
- `@apiIgnore` *Optional*
 - This can be used to exclude an endpoint

The following are custom Revelio attributes
- `@apiResponse (group_name) response_code response_description
 - Gives the HTTP response code and a semantic description for the group_name response
 - See examples below

GET request with response information
```javascript
/**
 * @api {get} /employee/:employeeId Retrieves an employee by their ID
 * @apiName GetEmployee
 * @apiResponse (success) 200 User information
 * @apiSuccess (success) {String} firstName User's first name
 * @apiSuccess (success) {String} lastName User's last name
 * @apiSuccess (success) {Integer} id User's ID
 * @apiSuccess (success) {Object} contact
 * @apiSuccess (success) {String} phone
 * @apiSuccess (success) {String} email
 * @apiSuccess (success) {String} fax
 * @apiResponse(userNotFound) 404 User not found
 * @apiError (userNotFound) {String} error
 */
```

GET request with query string parameters
```javascript
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
```

POST request with JSON payload
```javascript
/**
 * @api {post} /employee Create an employee
 * @apiName CreateEmployee
 * @apiParam {String} firstName User's first name
 * @apiParam {String} {String} lastName User's last name
 * @apiParam {String} {Object} contact
 * @apiParam {String} {String} phone
 * @apiParam {String} {String} email
 * @apiParam {String} {String} fax
 * @apiResponse (success) 200 User successfully created
 * @apiSuccess (success) {Integer} id User's Id
 * @apiResponse (invalidData) 400 Invalid data
 * @apiError (invalidData) {String[]} errors
 */
```

### Custom parsers

Revelio supports using custom ApiDoc parsers to modify documentation. See the sample parser in `examples/parsers/api_auth.js` or refer to the apiDoc 
site for more information about creating parsers.

 ```json
 {
     "url": "http://myapiurl.com",
     "targets": [ "../lib/endpoints", "../lib/otherEndpoints" ],
     "path": "Sample Group/My API/QA/v1.2.3",
     "parsers": ["./parsers/custom_parser.js"]
 }
 ```
