# React Demo App

## Getting Started
`git clone https://github.com/RaoulHofmann/react-demo.git` \
`npm install`\
`npm run test`\
`npm run dev`

### Mocked API
API endpoints mocked using mswjs

GET /api/location\
POST /api/submit-consignment

### Tests
Because I used vite I needed to use vitest instead of jest for testing.\
Command `npm run test` will run the tests.

**Test Cases:**

Renders form correctly – checks all fields and submit button.\
Validation errors – shows errors when weight is invalid.\
API data fetch – dropdowns show fetched locations.\
Successful submission – shows success message after valid submit.\
Submit disabled if missing fields – ensures button disabled until form valid.\
Submission failure – shows error message if API returns 400.\
Location fetch failure – shows error if /api/location fails.\
Prevent same source/destination – disables same option.\
Unit conversion – verifies cm/mm conversion works.