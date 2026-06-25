export class CommonBaseObject {
  /**
   * Changelog
   */
  created_at!: Date;
  created_by!: number;
  updated_at!: Date;
  updated_by!: number;

  /**
   * Soft deletion
   */
  deleted_at!: Date;
  deleted_by!: number;
}
