function psolver(c, d, t) {
    // Helper function to calculate reachable numbers and solution
    function calculate(nums, memo) {
        // Generate a unique key for the current state
        const key = nums.join(",");
        // Check if this state has already been computed
        if (memo.has(key)) {
            // Return the memoized result
            return memo.get(key);
        }

        // Set to store reachable numbers for the current state
        const reachable = new Set();
        // Variable to store the solution expression
        let solution;

        // Base case: if there's only one number, check if it matches the target
        if (nums.length === 1) {
            const num = nums[0];
            reachable.add(num);
            // If the single number matches the target, set it as the solution
            if (num === t) {
                solution = num;
            }
        } else {
            // Recursive case: explore different combinations of numbers and operators
            for (let i = 0; i < nums.length - 1; i++) {
                for (let j = i + 1; j < nums.length; j++) {
                    for (const operator of ["+", "-", "*", "/"]) {
                        // Create a new array with the current operation applied
                        const newNums = [
                            ...nums.slice(0, i),
                            `(${nums[i]} ${operator} ${nums[j]})`,
                            ...nums.slice(j + 1),
                        ].map(eval);

                        // Recursively calculate reachable numbers and solution for the new state
                        const { reachable: subReachable, solution: subSolution } = calculate(newNums, memo);

                        // Add reachable numbers from the subproblem to the current set
                        subReachable.forEach((num) => reachable.add(num));

                        // If a solution is found in the subproblem, set it as the solution for the current state
                        if (subSolution !== undefined) {
                            solution = `(${nums[i]} ${operator} ${nums[j]})`;
                            // Break out of the loop since we've found a solution
                            break;
                        }
                    }
                }
            }
        }

        // Create an object to store the result for the current state
        const result = { reachable: [...reachable], solution };
        // Memoize the result for the current state
        memo.set(key, result);
        // Return the result
        return result;
    }

    // Initial array of numbers (repeating 'd' for 'c' times)
    const initialNums = Array(c).fill(d).map(String);
    // Call the calculate function to get reachable numbers and solution
    const { reachable, solution } = calculate(initialNums, new Map());

    // Check if a target is provided
    if (t !== undefined) {
        // If a solution is found, return the formatted result
        if (solution !== undefined) {
            return `${t} can be computed in ${c} ${d}s\nHere is how: ${solution} = ${t}`;
        } else {
            // If no solution is found, return a message indicating it
            return `${t} cannot be computed in ${c} ${d}s `;
        }
    } else {
        // If no target is provided, find the smallest number that cannot be reached
        let result = 1;
        while (reachable.includes(result)) {
            result++;
        }
        // Return the result
        return `${result} cannot be computed in ${c} ${d}s `;
    }
}

// Example usage like in bash script with target
for (let c = 1; c <= 5; c++) {
    for (let d = 2; d <= 9; d++) {
        console.log(psolver(c, d));
    }
}
