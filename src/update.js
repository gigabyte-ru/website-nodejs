import { GlobalVariables } from './classes/GlobalVariables';

new GlobalVariables().runUpdate();

process.on('SIGINT', function () {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  // some other closing procedures go here
  process.exit(0);
});
