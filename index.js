const fs = require("fs");
const path = require("path");
const compile = require("node-elm-compiler").compile;
XMLHttpRequest = require("xhr2");

const DIR_PATH = process.cwd();
const OUTPUT_FILE_NAME = "elm.js";
const ELM_FILE_PATH = path.join(DIR_PATH, OUTPUT_FILE_NAME);
const COMPILED =
  process.env.NODE_ENV === "production" ? fs.existsSync(ELM_FILE_PATH) : false;
const OPTIMIZED = false;

elmHtmlToPort()
  .then(generatedHtml => {
    console.log(generatedHtml);
  })
  .catch(console.error);

async function elmHtmlToPort() {
  if (COMPILED === true) {
    return runElmApp().then(outputs => {
      return outputs;
    });
  }

  return runCompiler().then(results => {
    return results;
  });
}

function runCompiler() {
  return new Promise((resolve, reject) => {
    const compileProcess = compile("Main.elm", {
      cwd: DIR_PATH,
      output: OUTPUT_FILE_NAME,
      optimize: OPTIMIZED
    });

    compileProcess.on("exit", exitCode => {
      if (exitCode !== 0) {
        return reject(exitCode);
      }

      return runElmApp().then(resolve).catch(reject);
    });
  });
}

function runElmApp() {
  return new Promise((resolve, _) => {
    const elmFileContent = fs.readFileSync(ELM_FILE_PATH, "utf-8");

    fs.writeFileSync(
      ELM_FILE_PATH,
      elmFileContent.replace(
        "return $elm$json$Json$Encode$string('REPLACE_ME_WITH_JSON_STRINGIFY')",
        OPTIMIZED ? "return x" : "return _Json_wrap(x)"
      )
    );

    const app = require(ELM_FILE_PATH).Elm.Main.init();

    app.ports["htmlOut"].subscribe(resolve);
  });
}
