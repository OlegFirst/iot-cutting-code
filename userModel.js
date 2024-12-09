const DataBase = require('../DataBase');

const { createDate } = require('../common/utils');

const dataBase = new DataBase();
const tableName = 'users';

const get = () => {
  return new Promise((resolve, reject) => {
    dataBase.executeQuery(`SELECT * FROM ${tableName}`, (data) => {			
      resolve(data);
    });
  });
};

const findOne = (data) => {
  const searchAlies = Object.entries(data)[0][0];
  const searchValue = Object.entries(data)[0][1];

  const queryData = `SELECT * FROM ${tableName} WHERE ${searchAlies}='${searchValue}'`;

  return new Promise((resolve, reject) => {
    dataBase.executeQuery(queryData, (data) => {			
      resolve(data.result);
    });
  });
};

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    dataBase.executeQuery(`SELECT * FROM ${tableName} WHERE email='${email}'`, (data) => {			
      resolve(data.result);
    });
  });
};

const findByEmailAndPassword = (data) => {
  const { email, password } = data;

  return new Promise((resolve, reject) => {
    dataBase.executeQuery(`SELECT * FROM ${tableName} WHERE email='${email}' AND password='${password}'`, (data) => {			
      resolve(data.result);
    });
  });
};

// @result 'id' of the inserted user
const insertNewUser = (data) => {
  const { name, email, password } = data;
  const createdAt = createDate();

  return new Promise((resolve, reject) => {		
    const queryData = `
      INSERT INTO ${tableName}
      (name, email, password, createdAt, isActive, activationLink) 
      VALUES
      ('${name}', '${email}', '${password}', '${createdAt}', '0', 'null');

      SELECT MAX(id) AS id FROM ${tableName}
    `;

    dataBase.executeQuery(queryData, (data) => {      
      resolve({ error: data.error, id: data.result[1][0].id });
    });
  });
};

module.exports = {
  get,
  findOne,
  findByEmail,
  findByEmailAndPassword,
  insertNewUser
};