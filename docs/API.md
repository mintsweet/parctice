# API文档

## 获取社区规范文档

### 请求Url

```bash
/v1/static/norms
```

### 请求方式

```bash
GET
```

### 返回示例

```text
# 关于薄荷糖社区...
```

## 获取图形验证码

### 请求Url

```bash
/v1/aider/captcha
```

### 请求方式

```bash
GET
```

### 返回示例

```json
{
  "token": "D4AW1",
  "url": "data:image/bmp;base64...."
}
```

## 头像上传

### 请求Url

```bash
/v1/aider/upload_avatar
```

### 请求方式

```bash
POST
```

### 参数

| 参数   | 是否必选 | 类型 | 说明     |
| :----- | :------: | :--- | :------- |
| avatar |   Yes    | file | 头像文件 |

### 返回示例

```text
http://...
```

## 注册

### 请求Url

```bash
/v1/signup
```

### 请求方式

```bash
POST
```

### 参数类型

| 参数     | 是否必选 | 类型   | 说明                                             |
| :------- | :------: | :----- | :----------------------------------------------- |
| email    |   Yes    | string | 邮箱地址                                         |
| password |   Yes    | string | 数字、字母和特殊字符其中两种组成并且在6-18位之间 |
| nickname |   Yes    | string | 4-8位字符                                        |


## 登录

### 请求Url

```bash
/v1/signin
```

### 请求方式

```bash
POST
```

### 参数类型

| 参数     | 是否必选 | 类型   | 说明 |
| :------- | :------: | :----- | :--- |
| email    |   Yes    | string | 邮箱 |
| password |    No    | string | 密码 |

### 返回示例

```text
Bearer <token>
```

## 获取当前用户信息

### 请求Url

```bash
/v1/user/info
```

### 前置条件

*携带jwt*

### 请求方式

```bash
GET
```

### 返回示例

```json
{
  "id": 1,
  "nickname": "青湛"
}
```

## 更新个人信息

### 请求Url

```bash
/v1/setting
```

### 请求方式

```bash
PUT
```

### 前置条件

*携带jwt*

### 参数类型

| 参数      | 是否必选 | 类型   | 说明                 |
| :-------- | :------: | :----- | :------------------- |
| nickname  |    No    | string | 用户昵称，昵称唯一性 |
| avatar    |    No    | string | 用户头像             |
| location  |    No    | string | 所在地               |
| signature |    No    | string | 签名                 |