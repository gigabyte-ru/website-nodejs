import { GlobalVariables } from '../classes';

new GlobalVariables()
  .createTriggers()
  .then(() => {
    console.log('All triggers are created successfully!');
  })
  .catch((e) => {
    console.error(e);
  });
