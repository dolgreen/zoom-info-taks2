# version

    My node version is 20.9.0 so use the same version.

    The file with the answer in it psolver.js

    If placed on the head of the file tree run:
        - `node ./psolver`

    Down below you can see I wrote some lines.
    The lines are some of the checks I did for the function feel free to use them and change them if needed :D.

# explenation

    The function psolve(c,d,t) gets 2 | 3 arguments.
    
        - c => number of times the diggit appear.
        - d => the diggit
        - t (optional) => the target
    If there are two arguments it finds the smallest positive number that cannot be produced from my input.

    If there are three arguments then the program returns the equation that the program used to reach the target.
    If its impossible then it will return "t cannot be computed in..."