const { TABLES } = require('../../../utils/constants.js');

const TABLE = TABLES.WISH_LIST;

const controller = (store) => {
    const getList = () => {
        return store.getList(TABLE);
    };

    const getAllUsersFullData = () => {
        return store.getAllUsersFullData();
    };

    const insert = async(body) => {
        const data = body;
        return store.insert(TABLE, data);
    };

    return {
        getList,
        getAllUsersFullData,
        insert
    }
}


module.exports = controller;