const { TABLES } = require('../../../utils/constants.js');

const TABLE = TABLES.USERS;

const controller = (store) => {
    const getList = () => {
        return store.getList(TABLE);
    };

    const getById = (id) => {
        return store.getById(TABLE, 'user', id);
    };

    const insert = async(body) => {
        const data = body;
        return store.insert(TABLE, data);
    };

    const update = async(data, id) => {
        return store.update(TABLE, 'user', data, id);
    };

    return {
        getList,
        getById,
        update,
        insert
    }
}


module.exports = controller;