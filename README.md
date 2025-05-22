# About this proof of concept

This POC demonstrate integration capabilities of clpBNR with the WASM version of SWI-Prolog.

The full documentation of clpBNR can be found here : https://ridgeworks.github.io/clpBNR/CLP_BNR_Guide/CLP_BNR_Guide.html

This POC uses a [clpBNR implementation written by Jan Wielemaker](https://github.com/ridgeworks/clpBNR)

## Key learnings

### About clpBNR <> WASM

- clpBNR interval cannot be interpreted by SWIPL-WASM output : an internal prolog variable reference is returned instead.
  - Typical output : `"Rate":{"$t":"v","v":157}`
  - To get any value on JS side, you first need to cast the variable back to a prolog primitive.
  - To get the "calculated value", set in the middle of the interval, you can use `midpoint(ValInInterval, Result)`.
  - Same principle applies with `lower_bound/2`, `upper_bound/2`.
- Once casted to a prolog primitive, numbers are correctly casted in JS.

### Load of prolog facts

- Prolog facts should be loaded into WASM virtual file system with `preRun`.
- We could compile this env with Prolog files as a new WASM image. It should still be investigated.
- Once written, files can be loaded like using usual binary Prolog.
