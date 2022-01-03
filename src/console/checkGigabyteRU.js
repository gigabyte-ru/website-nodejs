import axios from 'axios';

let fallCounts = 0;

const checkGigabyteWeb = async () => {
  const response = await axios.get('https://www.gigabyte.ru/');
  if (response.data.indexOf('/reload?additional=1') > 0) {
    fallCounts = 0;
    console.log('work good!');
  } else {
    console.log('Alarm!');
    if (fallCounts > 3) {
      fallCounts = 0;
    } else {
      fallCounts++;
    }
  }
};

setInterval(checkGigabyteWeb, 1000 * 60);
