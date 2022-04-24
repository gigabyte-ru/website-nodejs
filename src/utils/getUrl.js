import axios from 'axios';

export default async (url) => {
  try {
    return await axios.get(url);
  } catch(e) {
    console.error(e);
  }

  return null;
}