# Remo Platform Server

This is the main backend server for Remo.TV<br>
Some backend services may be moved out of this repo at a later date.

By default, the server runs as localhost on port 3000 <br>
The webclient frontend can be found here:
[https://github.com/remotv/remo-web-client](https://github.com/remotv/remo-web-client)<br>

### Setup:

Make sure you have npm installed, then run the following:<br>

```
npm install
```

IMPORTANT! Disable tracking for overrides.js, never ever commit any changes to the overrides.js file.<br>
If your IDE is tracking changes to overrides.js, run this command:

```
git update-index --skip-worktree src/config/overrides.js
```

TBD: Instructions for setting up postgres && PGAdmin ( PSQL is required for running the server ) <br>
Database table builder can be found in `src/services/db/remote_contro.sql`

Then in termal run:<br>

```
npm run server
```

If desired, Rather than get captcha working or bypass it by ripping code apart, You can set `bypassreCaptcha` to `true` in `/src/config/index.js`

## Available Scripts

In the project directory, you can run:

### `npm run server`

This runs the express server for user authentication via JWT & Passport.<br>
Currently not integrated into the main project.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
