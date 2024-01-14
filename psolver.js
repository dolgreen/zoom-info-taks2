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

function psolverTarget(c, d, t) {
  if (c === undefined || d === undefined) {
    return "invalid input";
  }
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
    return `${t} cannot be computed in ${c} ${d}s `;
  }
}

function psolver(c, d) {
  // Memoization Map to store previously calculated results
  const memo = new Map();

  // Helper function to check if a number is a positive integer
  function isPositiveInteger(number) {
    return Number.isInteger(number) && number > 0;
  }

  // Helper function to remove duplicates from an array
  function removeDuplicates(array) {
    return Array.from(new Set(array));
  }

  // Recursive function to calculate possible results for a given set of numbers
  function calculate(numbers) {
    let results = [];

    // Base case: if there's only one number, return it
    if (numbers.length === 1) {
      results.push(numbers[0]);
      return results;
    }

    // Generate a unique key for the current set of numbers
    const key = numbers.join(",");

    // If the result for these numbers is already calculated, return it from memo
    if (memo.has(key)) {
      return memo.get(key);
    }

    // Iterate through pairs of numbers and perform various operations
    for (let i = 0; i < numbers.length - 1; i++) {
      const a = numbers[i];

      for (let j = i + 1; j < numbers.length; j++) {
        const b = numbers[j];

        const remainingNumbers = [
          ...numbers.slice(0, i),
          ...numbers.slice(i + 1, j),
          ...numbers.slice(j + 1),
        ];

        // Perform addition, subtraction, multiplication, and division operations
        // Recursively calculate results for each operation
        calculate([...remainingNumbers, a + b]).forEach((result) => {
          if (isPositiveInteger(result)) {
            results.push(result);
          }
        });

        calculate([...remainingNumbers, a - b]).forEach((result) => {
          if (isPositiveInteger(result)) {
            results.push(result);
          }
        });

        calculate([...remainingNumbers, b - a]).forEach((result) => {
          if (isPositiveInteger(result)) {
            results.push(result);
          }
        });

        calculate([...remainingNumbers, a * b]).forEach((result) => {
          if (isPositiveInteger(result)) {
            results.push(result);
          }
        });
        // Check for division by zero
        if (b !== 0) {
          calculate([...remainingNumbers, a / b]).forEach((result) => {
            if (isPositiveInteger(result)) {
              results.push(result);
            }
          });
        }

        if (a !== 0) {
          calculate([...remainingNumbers, b / a]).forEach((result) => {
            if (isPositiveInteger(result)) {
              results.push(result);
            }
          });
        }
      }
      // Remove duplicates from the results for the current set of numbers
      results = [...removeDuplicates(results)];
    }
    // Memoize the results for the current set of numbers
    memo.set(key, results);
    return results;
  }

  // Start searching for impossible numbers
  let impossibleNumber = 1;

  while (true) {
    // Create an array with 'c' elements, each initialized to 'd'
    const numbers = Array(c).fill(d);
    // Calculate possible results for the current set of numbers
    const possibleResults = calculate(numbers);

    // Check if the current impossibleNumber cannot be computed with the given numbers
    if (!possibleResults.includes(impossibleNumber)) {
      console.log(`${impossibleNumber} cannot be computed in ${c} ${d}s`);

      return;
    }
    // Move on to the next impossibleNumber
    impossibleNumber++;
  }
}

const checkTargetValidity = (target) => {
  if (target === undefined) {
    return undefined;
  }
  return isNaN(parseInt(process.argv[4], 10))
    ? null
    : parseInt(process.argv[4], 10);
};

// Parse command line arguments
const processArgParams = {
  c: isNaN(parseInt(process.argv[2], 10))
    ? undefined
    : parseInt(process.argv[2], 10),
  d: isNaN(parseInt(process.argv[3], 10))
    ? undefined
    : parseInt(process.argv[3], 10),
  t: checkTargetValidity(process.argv[4]),
};

// Run psolver for the given arguments
if (
  processArgParams.c !== undefined &&
  processArgParams.d !== undefined &&
  processArgParams.t !== null
) {
  if (processArgParams.t !== undefined) {
    console.log(
      psolverTarget(processArgParams.c, processArgParams.d, processArgParams.t)
    );
  } else {
    psolver(processArgParams.c, processArgParams.d);
  }
} else {
  if (processArgParams.c === undefined || processArgParams.d === undefined) {
    console.log("Invalid input. Please provide values for -c, -d.");
  }
  if (processArgParams.t === null) {
    console.log("Invalid input. Please provide value for -t.");
  }
}
