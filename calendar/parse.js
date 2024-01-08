import { XMLParser } from "fast-xml-parser";
import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const thisDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.resolve(thisDirectory, "source");

const sourceFileNames = await fs.readdir(sourceDirectory);

const result = {
  holidays: null,
  years: {},
};

for (let sourceFileName of sourceFileNames) {
  const file = await fs.readFile(path.resolve(sourceDirectory, sourceFileName));
  const fileContent = await file.toString();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });
  const { calendar } = parser.parse(fileContent);

  result.holidays ??= calendar.holidays.holiday.reduce((acc, v) => {
    acc[v.id] = v.title;
    return acc;
  }, {});

  result.years[calendar.year] = {
    days: calendar.days.day.reduce((acc, v) => {
      // Сокращенные дни нас не интересуют
      if (v.t === "2") {
        return acc;
      }

      acc[v.d] = {
        type: v.t,
      };

      if (v.h) {
        acc[v.d].holiday = v.h;
      }
      return acc;
    }, {}),
  };
}

await fs.writeFile(
  path.resolve(thisDirectory, "./result.json"),
  JSON.stringify(result)
);
