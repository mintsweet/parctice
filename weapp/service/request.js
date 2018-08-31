const perfix = 'http://localhost:3000/v1';
const request = (url, data = {}, method = 'GET') => {
  wx.showLoading({
    title: 'Loading...'
  });

  return new Promise((resolve, reject) => {
    wx.request({
      url: perfix + url,
      data,
      method,
      complete: res => {
        wx.hideLoading();
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      }
    });
  });
};

export default request;
