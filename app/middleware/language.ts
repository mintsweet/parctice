import { Context } from 'egg';

const SUPPORT_LANG = ['zh', 'zh-CN', 'en', 'en-US'];

/**
 * 国际化
 */
export default () => async (ctx: Context, next) => {
  const lang = ctx.get('Hawthorn-Language') || 'zh';

  if (!SUPPORT_LANG.includes(lang)) {
    return ctx.failure({ code: 10001 });
  }

  ctx.lang = lang;

  await next();
};
