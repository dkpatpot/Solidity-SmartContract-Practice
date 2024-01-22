const path = require('path');
const solc = require('solc');
const fs = require('fs');

const lotteryPath = path.resolve(__dirname, "contract", "lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "lottery.sol": {
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
  console.log(parsedOutput);
  if (parsedOutput.errors) {
    console.error("Compilation errors:");
    parsedOutput.errors.forEach((error) => {
      console.error(error.formattedMessage);
    });
    process.exit(1);
  }

  module.exports = parsedOutput.contracts["lottery.sol"].Lottery;
} catch (error) {
  console.error("Error compiling the contract:", error);
  process.exit(1);
}
