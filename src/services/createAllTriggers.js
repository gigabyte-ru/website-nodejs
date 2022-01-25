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

(async () => {
  await new Langs().createTriggers();
  await new Hosts().createTriggers();
  await new Countries().createTriggers();
  await new Translations().createTriggers();
  await new Categories().createTriggers();
  await new Sockets().createTriggers();
  await new Products().createTriggers();
  await new ProductImages().createTriggers();
  await new ProductFiles().createTriggers();
  await new ProductCpus().createTriggers();
})();
