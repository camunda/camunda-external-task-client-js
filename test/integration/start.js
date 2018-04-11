const fetch = require("node-fetch");

const startProcess = async (processName, processId, engineEndpoint) => {
  //const goods = [{ name: "Apple", amount: 5 }, { name: "Banana", amount: 1 }];

  await fetch(engineEndpoint + `/process-definition/key/${processId}/start`, {
    method: "POST",
    body: JSON.stringify({
      variables: {
        fooCount: {
          value: 2,
          type: "Integer"
        }
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(function(response) {
    var status = response.status;

    if (status === 200) {
      console.log(`started ${processName}`);
    } else {
      console.error(`failed to start ${processName} (status=%s)`, status);

      response.json().then(function(json) {
        console.log(json);
      });
    }
  });
};

module.exports = startProcess;
