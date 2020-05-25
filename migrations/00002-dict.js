const THRESHOLD = [
  {
    key: 'THRESHOLD_LOGIN_ERROR',
    tag: '阈值设置',
    note: '登录操作错误阈值，设置为 0 关闭限制功能',
    value: 5,
    type: 'number',
  },
];

const EMAIL = [
  {
    key: 'EMAIL_HOST',
    tag: '邮件发送配置',
    note: '主机',
    value: '',
    type: 'string',
  },
  {
    key: 'EMAIL_PORT',
    tag: '邮件发送配置',
    note: '端口',
    value: 465,
    type: 'number',
  },
  {
    key: 'EMAIL_USER',
    tag: '邮件发送配置',
    note: '账号',
    value: '',
    type: 'string',
  },
  {
    key: 'EMAIL_PASSWORD',
    tag: '邮件发送配置',
    note: '密码',
    value: '',
    type: 'string',
  },
  {
    key: 'EMAIL_SECURE',
    tag: '邮件发送配置',
    note: '使用安全连接（TLS/SSL）',
    value: true,
    type: 'boolean',
  },
  {
    key: 'EMAIL_SENDER_NAME',
    tag: '邮件发送配置',
    note: '发送者名称',
    value: '',
    type: 'string',
  },
  {
    key: 'EMAIL_SENDER_ADDRESS',
    tag: '邮件发送配置',
    note: '发送者邮箱地址',
    value: '',
    type: 'string',
  },
];

module.exports = {
  async up(db) {
    const now = new Date();

    const data = [...THRESHOLD, ...EMAIL].map((i) => ({
      ...i,
      updatedAt: now,
      createdAt: now,
    }));

    await db.collection('dict').insertMany(data);
  },

  async down(db) {
    await db.collection('dict').deleteMany();
  },
};
