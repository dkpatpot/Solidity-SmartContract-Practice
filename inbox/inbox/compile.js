const path = require('path');
const solc = require('solc');
const fs = require('fs');

const inboxPath = path.resolve(__dirname, "contracts", "inbox.sol");
const source = fs.readFileSync(inboxPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "Inbox.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

try {
  const output = solc.compile(JSON.stringify(input));

  const parsedOutput = JSON.parse(output);

  if (parsedOutput.errors) {
    console.error("Compilation errors:");
    parsedOutput.errors.forEach((error) => {
      console.error(error.formattedMessage);
    });

    process.exit(1);
  }

  module.exports = parsedOutput.contracts["Inbox.sol"].Inbox;
} catch (error) {
  console.error("Error compiling the contract:", error);
  process.exit(1);
}
