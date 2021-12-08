const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");

const dirName = path.join(__dirname, "../../../../", "public/assets/images");
const destinationPath = path.join(
  __dirname,
  "../../../../",
  "public/assets/images"
);
let storage = multer.diskStorage({
  destination: destinationPath,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  dest: dirName,
});

const controller = require("./index");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await controller.getList();
    if (users.length) {
      res.send({
        valid: true,
        message: "Users retrieved.",
        data: users,
      });
    } else {
      res.send({
        valid: true,
        message: "No existen registros.",
        data: [],
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await controller.getById(req.params);

    if (user.length) {
      res.send({
        valid: true,
        message: "Users retrieved.",
        data: user,
      });
    } else {
      res.send({
        valid: false,
        message: "No existen registros.",
        data: [],
      });
    }
  } catch (err) {
    next(err);
  }
});

router.put(
  "/user-update-image",
  upload.single("user-image"),
  async (req, res, next) => {
    try {
      const { body, file } = req;
      const { user_id } = body;
      if (file) {
        const data = {
          user_image: `assets/images/${file.originalname}`,
        };

        await controller.update(data, user_id);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.put("/user-update", async (req, res, next) => {
  try {
    const { body } = req;
    const {
      user_name,
      user_id,
      user_description,
      department_id,
      user_email,
      user_password,
    } = JSON.parse(JSON.stringify(body));
    let dataForUpdate = {
      user_name,
      user_id,
      user_description,
      department_id,
      user_email,
    };

    let salt;
    let hashedPassword;

    if (user_password) {
      salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(user_password, salt);
      dataForUpdate.user_password = hashedPassword;
    }

    const user = await controller.update(dataForUpdate, user_id);
    res.send({
      valid: true,
      message: "Datos actualizados.",
    });
  } catch (err) {
    next(err);
  }
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { body } = req;

    if (
      !body.user_name.length ||
      !body.user_email.length ||
      !body.department_id
    ) {
      res.send({
        valid: false,
        message: "Rellene todos los campos.",
      });
      return;
    }

    const { user_name, department_id, user_email, user_password } = JSON.parse(
      JSON.stringify(body)
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);

    const data = {
      user_name,
      department_id,
      user_email,
      user_password: hashedPassword,
    };

    const user = await controller.insert(data);

    res.send({
      valid: true,
      data: data,
      message: "Usuario creado.",
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { body } = req;

    const secondsInOneMonth = 1000 * 60 * 60 * 24 * 30;

    const { user_name, user_email, user_password } = await JSON.parse(
      JSON.stringify(body)
    );

    const users = await controller.getList();
    const userFiltered = users.filter((user) => user.user_email === user_email);

    if (!userFiltered.length) {
      return res.send({
        valid: false,
        message: "Usuario no encontrado",
      });
    }

    const storedUserId = userFiltered[0].user_id;
    const storedUserPassword = userFiltered[0].user_password;
    const correctPassword = await bcrypt.compare(
      user_password,
      storedUserPassword
    );

    if (correctPassword) {
      const token = jwt.sign(
        {
          user_name: userFiltered[0].user_name,
          user_admin: 0,
          id: userFiltered[0].user_id,
          user_email,
          createAt: new Date().getTime(),
        },
        process.env.SECRET,
        {
          expiresIn: secondsInOneMonth,
        }
      );

      return res.send({
        valid: true,
        message: "Usuario autorizado",
        token: token,
        data: {
          user_name: userFiltered[0].user_name,
          user_email,
          user_id: storedUserId,
        },
      });
    } else {
      return res.send({
        valid: false,
        message: "Usuario no autorizado",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
