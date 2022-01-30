import {
  Categories,
  Countries,
  Hosts,
  Langs,
  ProductCpus,
  ProductFiles,
  ProductImages,
  Products,
  Sockets,
  Translations,
} from '../classes';

const classes = [
  Langs,
  Hosts,
  Countries,
  Translations,
  Categories,
  Sockets,
  Products,
  ProductImages,
  ProductFiles,
  ProductCpus,
];

(async () => {
  for (const className of classes) {
    await new className().createTriggers();
  }
})();
