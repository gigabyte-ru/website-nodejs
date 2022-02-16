import { Entity } from './Entity';
import { FileGroupsList } from '../lists/FileGroupsList';
import { FileTypesList } from '../lists/FileTypesList';
import { FileHasOsList } from '../lists/FileHasOsList';

/**
 * @typedef FileEntity
 * @type { Object }
 * @property { number } id
 * @property { number } groupId
 * @property { number } fileTypeId
 * @property { string } filename
 * @property { string } hqUrl
 * @property { string } version
 * @property { number } filesize
 * @property { string } description
 * @property { string } language
 */

export class File extends Entity {
  /**
   * @type { FileEntity }
   */
  data = {};

  /**
   * @type { FileType | null }
   */
  fileType = null;

  /**
   * @type { FileGroup | null }
   */
  fileGroup = null;

  /**
   * @type { FileHasOs[] | null }
   */
  fileHasOsList = null;

  /**
   * @return { File }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.groupId = entityFromDb['group_id'];
    this.data.fileTypeId = entityFromDb['file_type_id'];
    this.data.filename = entityFromDb['filename'];
    this.data.hqUrl = entityFromDb['hq_url'];
    this.data.version = entityFromDb['version'];
    this.data.filesize = entityFromDb['filesize'];
    this.data.description = entityFromDb['description'];
    this.data.language = entityFromDb['language'];

    return this;
  }

  async setLinksEntities() {
    this.fileGroup = await new FileGroupsList().get(this.data.groupId);
    this.fileType = await new FileTypesList().get(this.data.fileTypeId);

    this.fileHasOsList = await new FileHasOsList().getEntitiesByFile(
      this.data.id
    );

    if (this.fileHasOsList) {
      await Promise.all([
        ...this.fileHasOsList.map((e) => e.setLinksEntities()),
      ]);
    }

    return this;
  }
}
