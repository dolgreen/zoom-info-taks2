function psolver(c, d, t) {
  // array for all the reachable numbers
  const reachable = [];
  const operators = ["+", "-", "*", "/"];
  // equation solution
  let solution;

  function calculate(values) {
    // Split the values string into an array
    values = values.split(",");
    // Evaluate each value using eval to get the numeric result
    const solutionValues = values.map((value) => eval(value));
    if (solutionValues.length === 1) {
      // If only one value is left, check if it matches the target
      if (solutionValues[0] === t) {
        solution = values[0];
        return;
      }
      // Add the single value to the reachable array
      reachable.push(solutionValues[0]);
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
    while (reachable.includes(result)) {
      result++;
    }

    return `${result} cannot be computed in ${c} ${d}s `;
  }
}

// // Example usage
// for (let c = 1; c <= 5; c++) {
//   for (let d = 2; d <= 9; d++) {
//     console.log(psolver(c, d));
//   }
// }

// Example usage with target
for (let c = 1; c <= 5; c++) {
  for (let d = 2; d <= 9; d++) {
    for (let t = 1; t <= 9; t++) {
      console.log(psolver(c, d, t));
    }
  }
}
