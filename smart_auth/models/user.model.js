const sql = require("./db");
const { NotFoundError } = require("../helpers/utility");

// constructor
const User = function(user) {
    if (typeof user.id != 'undefined') {
        this.id = user.id;
    }
    this.email = user.email;
    this.username = user.username;
    this.password = user.password;
    this.role = user.role;
    if (typeof user.access_token != 'undefined') {
        this.access_token = user.access_token;
    }
    if (typeof user.created_at != 'undefined') {
        this.created_at = user.created_at;
    }
    if (typeof user.updated_at != 'undefined') {
        this.updated_at = user.updated_at;
    }
};

User.create = async (newUser) => {
    try {
        let insert = await sql.query("INSERT INTO user SET ?", newUser);

        if (insert.insertId) {
            return insert.insertId;
        } else {
            return;
        }
    } catch (e) {
        console.log(e)
        return;
    }
};

User.findAll = async () => {
    let users = await sql.query(`SELECT * FROM user`);

    if (users.length) {
        // Remove password field
        users = users.map(item => {
            delete item.password;
            delete item.accessToken;
            return item;
        });

        return users;
    } else {
        throw new NotFoundError("User does not exist");
    }
};

User.findBy = async (field, value, removePassword = true) => {
    let row = await sql.query(`SELECT * FROM user WHERE ${field} = ?`, value);

    if (row.length) {
        let user = row[0];
        if (removePassword) {
            delete user.password;
        }

        return user;
    } else {
        throw new NotFoundError("User does not exist");
    }
};

User.findById = async (id) => {
    return User.findBy( 'id', id)
};

User.findByIdAndUpdate = async (id, accessToken) => {
    await sql.query("UPDATE user SET access_token = ? WHERE id = ?", [accessToken, id])
};

User.login = async (value) => {
    let row = await sql.query(`SELECT * FROM user WHERE mobile = ? OR email = ?`, [value, value]);
    if (row.length) {
        return row[0];
    } else {
        throw new NotFoundError("User does not exist");
    }
};

User.getAll = async (start, limit, return_total, sort_data) => {
    let str_query = "SELECT SQL_CALC_FOUND_ROWS * FROM user";
    let param_data = [];

    param_data.push(parseInt(start));
    param_data.push(parseInt(limit));

    str_query += " ORDER BY " + sort_data.sort_by + " " + sort_data.sort_dir + " LIMIT ?, ?";

    if (return_total) {
        str_query += "; SELECT FOUND_ROWS() AS total_rows;"
    }

    let rows = await sql.query(str_query, param_data);
    let return_data = null;
    let users = [];

    if (return_total) {
        users = rows[0];
        return_data = {total_rows: rows[1][0].total_rows};
    } else {
        users = rows;
    }

    // Handle no user found
    if (users.length == 0) {
        return_data.rows = users;
        return return_data;
    }

    // Remove password field
    users = users.map(item => {
        delete item.password;
        return item;
    });

    //console.log('rows', users);

    return_data.rows = users;

    return return_data;
};

module.exports = User;
