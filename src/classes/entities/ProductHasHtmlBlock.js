import { Entity } from './Entity';
import { HtmlBlocksList } from '../lists/HtmlBlocksList';

/**
 * @typedef ProductHasHtmlBlockEntity
 * @type { Object }
 * @property { number } id
 * @property { number } productId
 * @property { number } infoTypeId
 * @property { number } containerId
 * @property { number } htmlBlockId
 * @property { number } sorder
 * @property { string } description
 */

export class ProductHasHtmlBlock extends Entity {
  /**
   * @type { ProductHasHtmlBlockEntity }
   */
  data = {};

  /**
   * @type { HtmlBlock | null }
   */
  htmlBlock = null;

  /**
   * @return { ProductHasHtmlBlock }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.productId = entityFromDb['product_id'];
    this.data.infoTypeId = entityFromDb['info_type_id'];
    this.data.containerId = entityFromDb['container_id'];
    this.data.htmlBlockId = entityFromDb['html_block_id'];
    this.data.sorder = entityFromDb['sorder'];
    this.data.description = entityFromDb['description'];

    return this;
  }

  async setLinksEntities() {
    this.htmlBlock = await new HtmlBlocksList().get(this.data.htmlBlockId);
  }
}
