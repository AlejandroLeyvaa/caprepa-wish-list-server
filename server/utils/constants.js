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
      u.user_description,
      u.user_image,
      d.department_id,
      d.department_name,
      wl.wish_name,
      wl.wish_id,
      wl.wish_price,
      wl.wish_image_url,
      wl.wish_description
    FROM
      users AS u
      JOIN departments AS d
      JOIN wish_list AS wl ON u.user_id = d.department_id
      WHERE u.user_id = ${id}`;
    },
  },
};
