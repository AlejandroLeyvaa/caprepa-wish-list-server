const express = require('express');

const controller = require('./index');

const router = express.Router();

router.get('/', async(req, res, next) => {
    try {
        const departments = await controller.getList();
        if (departments.length) {
            res.status(200).json({
                data: departments,
                message: 'Departments retrieved'
            })
        } else {
            res.status(200).json({
                data: [],
                message: 'No existen registros.'
            })
        }
    } catch (err) {
        next(err);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const { body } = req;
        const {
            user_name,
            department_id,
            user_email,
            user_password,
        } = JSON.parse(JSON.stringify(body));
        const data = {
            user_name,
            department_id,
            user_email,
            user_password,
        }
        const user = await controller.insert(body);
    } catch (err) {
        next(err);
    }
});

module.exports = router;