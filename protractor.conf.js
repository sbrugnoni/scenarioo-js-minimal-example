"use strict";

const scenarioo = require("scenarioo-js");

exports.config = {
  allScriptsTimeout: 120000,
  SELENIUM_PROMISE_MANAGER: 0,
  baseUrl: "https://www.wikipedia.org",
  specs: ["specs/minimal_example.spec.ts"],
  directConnect: true,
  capabilities: {
    browserName: "chrome"
    //chromeOptions: { args: ["--window-size=1400,1200", "--headless"] }
  },

  beforeLaunch: async function() {
    require("ts-node").register({
      project: "tsconfig.json"
    });
  },

  /**
   * Enable & configure ScenariooJS reporter
   */
  onPrepare: function() {
    // Read current software version that is documented from source control info
    var gitVersion = readVersionFromGit();

    // Setup and configure the ScenariooJS jasmine reporter
    scenarioo.setupJasmineReporter(jasmine, {
      // target directory: where the scenarioo documentation data is generated
      targetDirectory: "./target/scenariooReports",

      // clean documentation output directory (for this build with same branch and build name only!)
      cleanBuildOnStart: true,

      // branch name: this is usually read from current version control information or set to reflect the major version of your software that you document
      // ("master" and "develop", or "Release 1.0", "Release 1.1", and so on ...)
      // it does not necessarily have to conform to the real development branch names in your source control,
      // sometimes it is better to use names of the version, release or whatever it documents
      branchName: "minimal-example",

      // put some description here, such that everybody understands, what this branch contains (which version, release, ...)
      branchDescription: "",

      // unique build name: use a timestamp, or better a build ID of current CI build running
      // usually fetched from your build server environment (e.g. passed via `process.env`,
      // e.g. for Jenkins see https://wiki.jenkins-ci.org/display/JENKINS/Building+a+software+project#Buildingasoftwareproject-JenkinsSetEnvironmentVariables)
      buildName: gitVersion,

      // set a revision: you could put your product version in combination with the latest source code revision
      // (either also the build ID or a commit ID)
      revision: gitVersion,

      // Here you configure how pages in your software are identified in the documentation
      // by generating a unique page name from current URL (usually a part of the URL, without special page content parameters)
      pageNameExtractor: function(url) {
        return url.pathname.substring(1);
      },

      /**
       * Turn on saving a step with screenshot for each expectation failure
       */
      reportStepOnExpectationFailed: true,

      /**
       * Enable or disable taking screenshots and saving a step at end of tests, can be turned on and off for failed and successfull tests separately.
       *
       * Consider scenarioo jasmine reporter config option '', to also take a screenshot for every failed expectation separately, which is recommended.
       */
      recordLastStepForStatus: {
        failed: true,
        success: true
      },

      /**
       * suppress additional helpful scenarioo log output (optional, defaults to false).
       */
      disableScenariooLogOutput: false
    });

    /**
     * Calling your source control tool to get current revision
     * (here git version of your current sources)
     */
    function readVersionFromGit() {
      var execSync = require("child_process").execSync;
      var version = "" + execSync("git rev-parse --short HEAD");
      console.log("git commit: " + version);
      return version.substring(0, version.length - 1);
    }
  },

  jasmineNodeOpts: {
    // Use following to suppress usual jasmine log:
    // print: function () {},

    // Only execute specs who's name match a certain pattern:
    // grep: 'failing',

    // Invert 'grep' matches, to execute the ones that do not match
    // invertGrep: true,

    // If true, print colors to the terminal.
    showColors: true,

    // If true, include stack traces in failures.
    includeStackTrace: true,

    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 120000
  }
};
