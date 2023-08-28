const PAGE_SIZE = 6;
const DEFAULT_PAGE = 1;

const getTotalPage = (items) => {
  return Math.ceil(items.length / PAGE_SIZE);
};

const getPageTotal = (totalItems) => {
  return Math.ceil(totalItems / PAGE_SIZE);
};

const getItemsByPage = (items, page = DEFAULT_PAGE) => {
  const result = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return result;
};

module.exports = {
  getTotalPage,
  getItemsByPage,
  PAGE_SIZE,
  getPageTotal,
};
