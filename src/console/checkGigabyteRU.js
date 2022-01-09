import axios from 'axios';
const child_process = require('child_process');

let fallCounts = 0;

const checkGigabyteWeb = async () => {
  try {
    const response = await axios.get('https://www.gigabyte.ru/');
    if (response.data.indexOf('/reload?additional=1') > 0) {
      fallCounts = 0;
      console.log('work good!');
    }
  } catch (e) {
    console.log('Alarm!');
    if (fallCounts > 2) {
      console.log('Restart PHP!');

      child_process.exec('ping -c 1 192.168.0.2', (error, stdout, stderr) => {
        console.log({ error, stdout, stderr });
      });
      fallCounts = 0;
    } else {
      fallCounts++;
    }
  }
};

setInterval(checkGigabyteWeb, 1000 * 10);
