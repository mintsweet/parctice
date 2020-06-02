import Service from '@/core/BaseService';
import Cache from '@/utils/cache';

export default class DictService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Dict;
  }

  private cache = Cache({
    rs: this.app.redis,
    key: (rowKey: string) => `DICT:${rowKey}`,
    expire: 10,
    computed: async (rowKey: string) => {
      const result = await this.findOne({ key: rowKey });
      if (!result) {
        throw new Error(`dict ${rowKey} not found`);
      }
      return result.value;
    },
  });

  public getValue(key) {
    return this.cache(key);
  }
}
