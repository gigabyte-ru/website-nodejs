export default (name, filterFn = (arg) => arg) => {
  const args = process.argv;

  let trap = false;

  for (const arg of args) {
    if (trap) {
      return filterFn(arg);
    }

    if (arg === name) {
      trap = true;
    } else {
      const splitArg = arg.split('=');
      if (splitArg[0] === name) {
        return filterFn(splitArg[1]);
      }
    }
  }

  return null;
};
