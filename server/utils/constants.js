module.exports = {
  TABLES: {
    WISH_LIST: "wish_list",
    USERS: "users",
    DEPARTMENTS: "departments",
  },
  QUERIES: {
    userById: (id) => {
      return `
      SELECT
      u.user_id,
      u.user_name,
      u.user_email,
      u.user_image,
      d.department_id,
      d.department_name
    FROM
      users AS u
      JOIN departments AS d
      ON u.user_id=${id};`;
    },
  },
};
