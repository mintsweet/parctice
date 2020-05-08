const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function filterPath(rbac) {
  let result = [];

  rbac.forEach((r) => {
    result.push(r.path);

    if (r.routes) {
      result = result.concat(filterPath(r.routes));
    }
  });

  return result;
}

function generateAuth() {
  let rbac;
  const rbacPath = path.join(__dirname, '../app/rbac');
  try {
    execSync(`./node_modules/.bin/tsc ${rbacPath}.ts`);
  } catch (err) {
    // console.log(err);
  }
  const rbacModule = require(`${rbacPath}.js`);
  fs.unlinkSync(`${rbacPath}.js`);

  if (rbacModule.__esModule) {
    rbac = rbacModule.default;
  } else {
    rbac = rbacModule;
  }

  return filterPath(rbac);
}

module.exports = {
  async up(db) {
    const now = new Date();
    // 创建 root 用户组
    const root = await db.collection('auth_group').insertOne({
      name: 'root',
      remark: '超级管理员',
      permissions: generateAuth(),
      modifiable: false,
      updatedAt: now,
      createdAt: now,
    });

    // 创建初始管理员
    await db.collection('auth_user').insertOne({
      username: 'root',
      password: 'e52b9dadafadee9a3b14067253ff7262',
      role: root.insertedId,
    });
  },

  async down(db) {
    await db.collection('auth_group').deleteMany();
    await db.collection('auth_user').deleteMany();
  },
};
