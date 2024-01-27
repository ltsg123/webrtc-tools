import { execSync } from "child_process";
import { writeFile, copyFileSync } from "fs";
import { resolve } from "path";
import pkg from "../package.json";

function generateApiDeclaration() {
  execSync("npx tsc --project tsconfig.api.json", { stdio: "inherit" });
  execSync(
    "npx api-extractor run --local --verbose --config ./scripts/api-extractor.json",
    {
      stdio: "inherit",
    }
  );

  execSync("rm -rf ./dist/lib", { stdio: "inherit" });
}

// 生成 package.json
function generatePackage() {
  const {
    description,
    types = "",
    author,
    keywords,
    license,
    repository,
    bugs,
    homepage,
    dependencies,
  } = pkg;
  const template = {
    name: pkg.name,
    version: pkg.version,
    description,
    main: pkg.main.replace("dist/", ""),
    module: pkg.module.replace("dist/", ""),
    types: types.replace("dist/", ""),
    declaration: true,
    author,
    keywords,
    license,
    repository,
    bugs,
    homepage,
    dependencies,
  };

  writeFile(
    resolve(__dirname, "../dist/package.json"),
    JSON.stringify(template, null, "\t"),
    { encoding: "utf8" },
    (err) =>
      console.log(err || `write package.json, current version ${pkg.version}`)
  );
}

function generateReadme() {
  copyFileSync(
    resolve(__dirname, "../README.md"),
    resolve(__dirname, "../dist/README.md")
  );
  copyFileSync(
    resolve(__dirname, "../README-zh_CN.md"),
    resolve(__dirname, "../dist/README-zh_CN.md")
  );
}

void generateApiDeclaration();
void generatePackage();
void generateReadme();
