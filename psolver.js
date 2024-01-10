// this function checks for occurrences of d c times then return true if success and false if not
// this func was build to remove cases of not using all the numbers the program needs
function hasCDOccurrences(str, numberOfTimes, numberToSearchInString) {
  const regex = new RegExp(`\\b${numberToSearchInString}\\b`, "g");
  const matches = str.match(regex) || [];

  return matches.length === numberOfTimes;
}
// this flag is relevant when trying to get for a target
// this flag will turn true when the program found the right solution and there is no need for more solutions
let flag = false;

function psolver({ c, d, t }) {
  if (c === undefined || d === undefined) {
    return "invalid input";
  }
  // array for all the reachable numbers
  const reachable = [];
  const operators = ["+", "-", "*", "/"];
  // equation solution
  let solution;

  function calculate(values) {
    if (flag === true) {
      return;
    }
    // Split the values string into an array
    if (!hasCDOccurrences(values, c, d)) {
      return;
    }
    // console.log(values);
    values = values.split(",");
    // Evaluate each value using eval to get the numeric result
    const solutionValues = values.map((value) => eval(value));

    if (solutionValues.length === 1) {
      // If only one value is left, check if it matches the target
      if (solutionValues[0] == t) {
        solution = values[0];
        flag = true;
        return;
      }
      // Add the single value to the reachable array
      if (
        solutionValues[0] > 0 &&
        Number.isInteger(solutionValues[0]) &&
        !reachable.includes(solutionValues[0])
      ) {
        reachable.push(solutionValues[0]);
      }
      return;
    }

    for (let i = 0; i < solutionValues.length - 1; i++) {
      for (let j = i + 1; j < solutionValues.length; j++) {
        for (let k = 0; k < operators.length; k++) {
          // Recursively call calculate with a new equation
          calculate(
            [
              ...values.slice(0, i),
              `(${values[i]} ${operators[k]} ${values[j]})`,
              ...values.slice(j + 1),
            ].join(",")
          );
        }
      }
    }
  }
  // Start the calculation with an equation of repeating 'd' for 'c' times
  calculate(Array(c).fill(d).join(","));

  if (t !== undefined) {
    if (solution === undefined) {
      // If no solution was found, return a message indicating it
      return `${t} cannot be computed in ${c} ${d}s `;
    } else {
      // If a solution was found, return the formatted result
      return `
      ${t} can be computed in ${c} ${d}s
      Here is how: ${solution.slice(1, solution.length - 1)} = ${t}`;
    }
  } else {
    // If target is not provided, find the smallest number that cannot be reached
    let result = 1;
    reachable.sort((a, b) => a - b);
    // console.log(reachable);
    for (let i = 0; i < reachable.length; i++) {
      if (result == reachable[i]) {
        result++;
      } else {
        return `${result} cannot be computed in ${c} ${d}s `;
      }
    }

    return `${result} cannot be computed in ${c} ${d}s `;
  }
}

const processArgParams = {
  c: isNaN(parseInt(process.argv[2], 10))
    ? undefined
    : parseInt(process.argv[2], 10),
  d: isNaN(parseInt(process.argv[3], 10))
    ? undefined
    : parseInt(process.argv[3], 10),
  t: isNaN(parseInt(process.argv[4], 10))
    ? undefined
    : parseInt(process.argv[4], 10),
};

console.log(psolver(processArgParams));

// Example usage with target
// for (let c = 1; c <= 5; c++) {
//   for (let d = 2; d <= 9; d++) {
//     for (let t = 1; t <= 9; t++) {
//       console.log(psolver(c, d, t));
//     }
//   }
// }
