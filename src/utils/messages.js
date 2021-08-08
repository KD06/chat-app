const generateMessage = (username, text) => {
  return { text, username, createdAt: new Date().getTime() };
};

const generateLocationMessage = (userName, url) => {
  return { url, userName, createdAt: new Date().getTime() };
}
module.exports = {
    generateMessage
}