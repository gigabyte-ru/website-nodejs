import { GlobalVariablesParser } from '../classes';

new GlobalVariablesParser()
  .createTriggers()
  .then(() => {
    console.log('All triggers are created successfully!');
  })
  .catch((e) => {
    console.error(e);
  });
