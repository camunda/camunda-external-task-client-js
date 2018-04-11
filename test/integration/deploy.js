const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");
//TODO: replace with got.

const deployProcess = async (diagramPath, processName, engineEndpoint) => {
  const xmlStream = fs.createReadStream(diagramPath);
  const formData = new FormData();

  formData.append("deployment-name", `${processName}Deployment`);
  formData.append("process", xmlStream);

  await fetch(engineEndpoint + "/deployment/create", {
    method: "POST",
    body: formData
  })
    .then(function(response) {
      const status = response.status;

      if (status === 200) {
        console.log(`deployed ${processName}`);
      } else {
        console.error(`failed to deploy ${processName} (status=%s)`, status);
      }
    })
    .catch(function(err) {
      console.error(err);
    });
};

module.exports = deployProcess;
