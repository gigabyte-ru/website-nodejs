export class GlobalVariables {
  variables = {};

  setVariables(classes) {
    console.log(classes);

    this.variables = Object.keys(classes).reduce(
      (acc, className) => (acc[className] = classes[className].data) && acc,
      {}
    );
  }
}

/**
 * All global variables
 */
export const globalVariables = new GlobalVariables();
