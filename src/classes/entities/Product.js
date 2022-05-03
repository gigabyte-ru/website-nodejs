import { Entity } from './Entity';
import { ProductHasCpuList } from '../lists/ProductHasCpuList';
import { ProductImagesList } from '../lists/ProductImagesList';
import { ProductHasFilesList } from '../lists/ProductHasFilesList';
import { MemorySummariesList } from '../lists/MemorySummariesList';
import { ProductHasMemoryList } from '../lists/ProductHasMemoryList';

/**
 * @typedef ProductEntity
 * @type { Object }
 * @property { number } id
 * @property { string } alias
 * @property { string } originalAlias
 * @property { string } fullName
 * @property { number } memorySummaryId
 */

export class Product extends Entity {
  /**
   * @type { ProductEntity }
   */
  data = {};

  /**
   * @type { ProductHasCpu[] | null}
   */
  cpuList = null;

  /**
   * @type { ProductHasCpu[] | null}
   */
  memoryList = null;

  /**
   * @type { ProductImage[] | null }
   */
  imagesList = null;

  /**
   * @type { ProductHasFile[] | null }
   */
  filesList = null;

  /**
   * @type { string | null }
   */
  memorySummary = null;

  /**
   * @return { Product }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.alias = entityFromDb['alias'];
    this.data.originalAlias = entityFromDb['original_alias'];
    this.data.fullName = entityFromDb['fullname'];
    this.data.memorySummaryId = entityFromDb['memory_summary_id'];

    return this;
  }

  async setCpus() {
    this.cpuList = await new ProductHasCpuList().getEntitiesByProduct(
      this.data.id
    );
    return this;
  }

  async setMemories() {
    this.memoryList = await new ProductHasMemoryList().getEntitiesByProduct(
      this.data.id
    );
    return this;
  }

  async setImages() {
    this.imagesList = await new ProductImagesList().getEntitiesByProduct(
      this.data.id
    );
    return this;
  }

  async setFiles() {
    this.filesList = await new ProductHasFilesList().getEntitiesByProduct(
      this.data.id
    );
    return this;
  }

  async setMemorySummary() {
    this.memorySummary = await new MemorySummariesList().get(this.data.memorySummaryId);
    return this;
  }
}
