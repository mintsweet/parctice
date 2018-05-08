import BaseComponent from '../prototype/BaseComponent';
import formidable from 'formidable';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user';

const SALT_WORK_FACTOR = 10;

class User extends BaseComponent {
  constructor() {
    super();
    this.signup = this.signup.bind(this);
    this.forget = this.forget.bind(this);
  }

  getInfo(req, res) {
    const { userInfo } = req.session;
    if (!userInfo) {
      return res.send({
        status: 0,
        type: 'ERROR_GET_ADMIN_INFO',
        message: '尚未登录'
      });
    } else {
      return res.send({
        status: 1,
        data: userInfo
      });
    }
  }

  signin(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { mobile, password } = fields;

      try {
        if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号!');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SIGNIN_PARMAS',
          message: err.message
        });
      }

      const existUser = await UserModel.findOne({ mobile }, '-_id, -__v');
      if (!existUser) {
        return res.send({
          status: 0,
          type: 'ERROR_USER_IS_NOT_EXITS',
          message: '手机账户账户不存在'
        });
      }

      const isMatch = await bcrypt.compare(password, existUser.password);
      if (isMatch) {
        // req.session.userInfo = existUser;
        return res.send({
          status: 1,
          data: existUser
        });
      } else {
        return res.send({
          status: 0,
          type: 'ERROR_PASS_IS_NOT_MATCH',
          message: '用户密码错误'
        });
      }

    });
  }

  signup(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }

      const { nickname, mobile, password } = fields;
      const existUser = await UserModel.findOne({ mobile });
      if (existUser) {
        return res.send({
          status: 0,
          type: 'USER_HASN_EXIST',
          message: '手机号已经存在了'
        });
      }

      try {
        if (!mobile || !/^1[3,5,7,8,9]\d{9}$/.test(mobile)) {
          throw new Error('请输入正确的手机号!');
        } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间!');
        } else if (!nickname || nickname.length > 8 || nickname.length < 4) {
          throw new Error('请输入4-8位的名称!');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SIGNUP_PARMAS',
          message: err.message
        });
      }

      const bcryptPassword = await this.encryption(password);
      const userId = await this.getId('user_id');
      const userInfo = {
        id: userId,
        nickname,
        password: bcryptPassword,
        mobile
      };

      try {
        await UserModel.create(userInfo);
        return res.send({
          status: 1,
          data: userInfo
        });
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE_FAILED',
          message: '服务器无响应，请稍后重试'
        });
      }
    });
  }

  async encryption(password) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  forget(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          status: 0,
          type: 'ERROR_PARMAS',
          message: '参数解析失败'
        });
      }
      const { msg_code } = req.session;
      const { mobile, password , msgcaptcha } = fields;

      try {
        if (mobile && mobile !== msg_code.mobile) {
          throw new Error('提交手机号与获取验证码手机号不对应');
        } else if (msg_code.code !== msgcaptcha) {
          throw new Error('验证码错误');
        } else if ((Date.now() - msg_code.time) / (1000 * 60) > 10) {
          throw new Error('验证码已失效，请重新获取');
        } else if (!password || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password)) {
          throw new Error('密码必须为数字、字母和特殊字符其中两种组成并且在6-18位之间!');
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_FORGET_PARMAS',
          message: err.message
        });
      }

      const bcryptPassword = await this.encryption(password);
      await UserModel.findOneAndUpdate({ mobile }, {$set: {password: bcryptPassword}});
      return res.send({
        status: 1
      });
    });
  }

  async getInfoById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.send({
        status: 0,
        type: 'ERROR_PARMAS',
        message: '不能获取ID'
      });
    } else {
      try {
        const user = await UserModel.findOne({ id }, '-_id -__v');
        if (!user) {
          return res.send({
            status: 0,
            type: 'ERROR_NO_EXIST_USER',
            message: '用户不存在'
          });
        } else {
          return res.send({
            status: 1,
            data: user
          });
        }
      } catch(err) {
        return res.send({
          status: 0,
          type: 'ERROR_SERVICE_FAILED',
          message: '服务器无响应，请稍后重试'
        });
      }
    }
  }
}

export default new User();