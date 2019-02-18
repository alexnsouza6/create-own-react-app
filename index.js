#!/usr/bin/env node
let templates = require("./templates/templates.js");
let config = require("./config/config.js");
let shell = require("shelljs");
let colors = require("colors");
let fs = require("fs"); //fs already comes included with node.

let appName = process.argv[2];
let appDirectory = `${process.cwd()}/${appName}`;
let reactApp = false;

const createReactAppOrEmptyFolder = () => {
  return new Promise(resolve => {
    if (appName) {
      if (reactApp) {
        shell.exec(`create-react-app ${appName}`, () => {
          console.log("Created react app".bgWhite);
          resolve(true);
        });
      } else {
        shell.exec(`mkdir ${appName}`, () => {
          console.log("Created a simple folder".bgWhite.black);
          resolve(true);
        });
      }
    } else {
      console.log("\nNo app name was provided.".bgRed);
      console.log("\nProvide an app name in the following format: ".bgCyan);
      console.log("\ncreate-own-react-app ", "app-name\n".bgCyan);
      resolve(false);
    }
  });
};

const cdIntoNewApp = () => {
  let makeSrc = reactApp ? "" : "&& mkdir src";
  return new Promise(resolve => {
    shell.exec(`cd ${appName}`, () => {
      console.log("Got into and created a src folder".bgWhite.black);
      resolve();
    });
  });
};

const installReduxRouterPackages = () => {
  return new Promise(resolve => {
    console.log(
      "\nInstalling redux, react-router, react-router-dom, react-redux, and redux-thunk\n"
        .cyan
    );
    shell.exec(
      `npm install --save redux react-router react-redux redux-thunk react-router-dom`,
      () => {
        console.log("\nFinished installing packages\n".green);
        resolve();
      }
    );
  });
};

const installPrettierPackages = () => {
  return new Promise(resolve => {
    console.log("\nInstalling Prettier\n".cyan);
    shell.exec(`npm install --save --save-exact prettier`, () => {
      console.log("\nFinished installing packages\n".green);
      resolve();
    });
  });
};

const installESlintPackages = () => {
  return new Promise(resolve => {
    console.log("\nInstalling ESLint\n".cyan);
    shell.exec(
      `npm --save install eslint eslint-loader eslint-plugin-jest eslint-config-react eslint-config-airbnb eslint-plugin-jsx-a11y eslint-plugin-react prettier-eslint`,
      () => {
        console.log("\nFinished installing packages\n".green);
        resolve();
      }
    );
  });
};

const updateConfigFiles = () => {
  return new Promise(resolve => {
    let promises = [];
    Object.keys(config).forEach((fileName, i) => {
      promises[i] = new Promise(res => {
        fs.writeFile(`${appDirectory}/${fileName}`, config[fileName], function(
          err
        ) {
          if (err) {
            return console.log(err);
          }
          res();
        });
      });
    });
    Promise.all(promises).then(() => {
      resolve();
    });
  });
};

const run = async () => {
  let success = await createReactAppOrEmptyFolder();
  if (!success) {
    console.log(
      "Something went wrong while trying to create a new React app using create-react-app"
        .red
    );
    return false;
  }

  await cdIntoNewApp();
  await installReduxRouterPackages();
  await installPrettierPackages();
  await installESlintPackages();
  await updateConfigFiles();

  console.log("All done".bgGreen.black);
};

run();
