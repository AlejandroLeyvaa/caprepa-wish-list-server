CREATE TABLE wish_list(
  wish_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  department_id INT,
  wish_name VARCHAR(500) NOT NULL,
  wish_price INT(255) NOT NULL,
  wish_image_url varchar(500),
  wish_description TEXT,
  wish_url TEXT,
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE users(
  user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(128) NOT NULL,
  user_image varchar(500),
  user_description text,
  department_id INT,
  user_email VARCHAR(128) NOT NULL UNIQUE,
  user_password VARCHAR(64) NOT NULL DEFAULT '1234',
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(department_id)
) ENGINE = INNODB;

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(128) NOT NULL UNIQUE
) ENGINE = INNODB;

-- INSERT INTO wish_list()
-- VALUES ('');
INSERT INTO
  users(user_name, user_email, department_id)
VALUES
  (
    'Alejandro Leyva Mendoza',
    'alejandro.leyva@bancaprepa.com',
    1
  );

INSERT INTO
  departments(department_name)
VALUES
  ('Sistemas');

-- JOINS
select
  u.user_id,
  u.user_name,
  u.user_email,
  d.department_id,
  d.department_name
from
  users as u
  join departments as d on u.user_id = d.department_id;

SELECT
  u.user_id,
  u.user_name,
  u.user_email,
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
  JOIN `wish_list` AS wl ON u.user_id = d.department_id;