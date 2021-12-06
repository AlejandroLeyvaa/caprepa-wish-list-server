const express = require("express");
const path = require("path");
const multer = require("multer");

const controller = require("./index");
const { config } = require("../../../config/index");

const dirName = path.join(__dirname, "../../../../", "public/assets/images");
const destinationPath = path.join(
    __dirname,
    "../../../../",
    "public/assets/images"
);
let storage = multer.diskStorage({
    destination: destinationPath,
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage,
    dest: dirName,
});

const router = express.Router();

router.get("/", async(req, res, next) => {
    try {
        const wishList = await controller.getList();

        if (wishList.length) {
            res.status(200).json({
                data: wishList,
                message: "Wish list retrieved",
            });
        } else {
            res.status(200).json({
                data: [],
                message: "No existen registros.",
            });
        }
    } catch (err) {
        next(err);
    }
});

router.get('/users-wish-list', async(req, res, next) => {
    try {
        const users = await controller.getAllUsersFullData();
        if (users.length) {
            res.send({
                valid: true,
                message: 'Users retrieved.',
                data: users,
            })
        } else {
            res.send({
                valid: true,
                message: 'No existen registros.',
                data: [],
            })
        }
    } catch (err) {
        next(err);
    }
});

router.post("/", upload.single("wish-image"), async(req, res, next) => {
    try {
        const { body, file } = req;
        if (body && file) {
            const { wish_name, wish_price, user_id, wish_description, wish_url } = JSON.parse(
                JSON.stringify(body)
            );
            const data = {
                user_id,
                wish_name,
                wish_description,
                wish_url,
                wish_price: parseInt(wish_price),
                wish_image_url: `assets/images/${file.originalname}`,
            };
            const wishList = await controller.insert(data);

            res.send({
                valid: true,
                message: "Sugerencia de regalo creada.",
            });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;