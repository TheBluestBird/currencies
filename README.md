# Probation task about currencies

This is a probation task. Should display 3 pages
- list of currencies
- currency convertor
- form available to registered users.

There should be a mock of registration and authentication.
The third page shouldn't be available for unauthenticated users.

List of currencies should have sorting and currency finder.

Convertor should fill up the other field with result when the first filed has an input and vice-versa.

The third page should have several fields, preferably different types. 
Also, it should have a form to add currencies. 
Adding currency spawns a mini form with currency selector and a comment field.
The user shouldn't be able to add more currencies until he fills up the present ones.
There should be server sending imitation upon form submission.

The application should be unit test covered, with full coverage of at least 2 functions.

The application should be adaptive, well thought through and pretty.

Deployed version:
https://thebluestbird.github.io/currencies/

Build with React, Typescript, Jest, Webpack.

Currency API used: Coin Market Cap

## Available Scripts

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:9000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

For application to be start correctly there should be a `.env`
file in the project root with following environment variables:
```
CMC_TOKEN=YOUR_CMC_TOKEN
CMC_HOST=https://pro-api.coinmarketcap.com/
API_URL=/api/
```

### `npm test`
Launches the test runner in the interactive watch mode.


### `npm run build`
Builds the app for production to the `dist` folder.

The build is minified and the filenames include the hashes.

For application to be build correctly there should be a `.env.prod`
file in the project root with following environment variables:
```
API_URL=https://your-roxy-server-to-resolve-CORS-problems.com
```


### `npm run test:coverage`
Runs all the tests and generates coverage report in `coverage` folder

