export default ({ rs, key, expire = 60, computed }) => {
  return async (...args) => {
    let rsKey = '';

    if (typeof key === 'function') {
      rsKey = key(...args);
    } else {
      rsKey = key;
    }

    let content = await rs.get(rsKey);

    if (content !== null) {
      try {
        return JSON.parse(content);
      } catch (err) {
        throw new Error(err);
      }
    } else {
      content = await computed(...args);
      await rs.set(rsKey, JSON.stringify(content));
      await rs.expire(rsKey, expire);
      return content;
    }
  };
};
