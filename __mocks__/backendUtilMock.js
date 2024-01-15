module.exports = {
    getPageOffsetFromPageNo: jest.fn((pageNumber, pageSize) => {
        return pageNumber * pageSize;
    }),
};
