import { GlobalVariables } from '../classes/GlobalVariables';

new GlobalVariables()
  .createTriggers()
  .then(() => {
    console.log('All triggers are created successfully!');
  })
  .catch((e) => {
    console.error(e);
  });
