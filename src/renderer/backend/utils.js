const fs = require("fs");

export const testEqDir = (eqDir) => {
  if (fs.existsSync(eqDir)) return true;
  return false;
};

export const testLogsDir = (eqDir) => {
  if (fs.existsSync(`${eqDir}/logs`)) return true;
  return false;
};

export const getDateTime = (dateTimeObj) => {
  const hours = dateTimeObj.getHours().toString().padStart(2, "0");
  const minutes = dateTimeObj.getMinutes().toString().padStart(2, "0");
  const day = dateTimeObj.getDate().toString().padStart(2, "0");
  const month = (dateTimeObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateTimeObj.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
