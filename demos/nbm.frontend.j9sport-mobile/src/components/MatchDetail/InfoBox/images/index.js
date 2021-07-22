const imgContext = require.context('./', true, /^\.\/.*\.png$/);

const getImg = (name) => imgContext(name).default

export default getImg
