const { nanoid } = require('nanoid');
const { TABLES } = require('../../../utils/constants.js');

const TABLE = TABLES.DEPARTMENTS;

const controller = (store) => {
    const getList = () => {
        return store.getList(TABLE);
    };

    const insert = async(body) => {
        const data = body;
        return store.insert(TABLE, data);
    };

    return {
        getList,
        insert
    }
}


module.exports = controller;