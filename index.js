const fs = require("fs");
const path = require("path");
const compile = require("node-elm-compiler").compile;
XMLHttpRequest = require("xhr2");

const DIR_PATH = process.cwd();
const OUTPUT_FILE_NAME = "elm.js";
const ELM_FILE_PATH = path.join(DIR_PATH, OUTPUT_FILE_NAME);
const COMPILED = fs.existsSync(ELM_FILE_PATH);
const OPTIMIZED = true;

elmHtmlToPort()
  .then(generatedHtml => {
    console.log(generatedHtml);
  })
  .catch(console.error);

async function elmHtmlToPort() {
  if (COMPILED === true) {
    return runElmApp(DIR_PATH).then(outputs => {
      return outputs;
    });
  }

  return runCompiler(DIR_PATH).then(results => {
    return results;
  });
}

function runCompiler(rootDir) {
  return new Promise((resolve, reject) => {
    const compileProcess = compile("Main.elm", {
      cwd: rootDir,
      output: OUTPUT_FILE_NAME,
      optimize: OPTIMIZED
    });

    compileProcess.on("exit", exitCode => {
      if (exitCode !== 0) {
        return reject(exitCode);
      }

      return runElmApp(rootDir).then(resolve).catch(reject);
    });
  });
}

function runElmApp(dirPath) {
  return new Promise((resolve, _) => {
    const elmFileContent = fs.readFileSync(ELM_FILE_PATH, "utf-8");

    fs.writeFileSync(
      ELM_FILE_PATH,
      elmFileContent.replace(
        "return $elm$json$Json$Encode$string('REPLACE_ME_WITH_JSON_STRINGIFY')",
        "return x"
      )
    );

    const app = require(ELM_FILE_PATH).Elm.Main.init();

    app.ports["htmlOut"].subscribe(resolve);
  });
}
