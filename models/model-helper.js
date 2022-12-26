const getRowsQuery = async function (db,query) {
    return await new Promise(function (resolve,reject) {
        db.query(query, function (err, rows) {
            if (err) {
                reject(err)
            } else {
                resolve(rows);
            }
        });
    });
}

const runQuery = async function (db,query) {
    return await new Promise(function (resolve,reject) {
        db.query(query, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(true);
            }
        });
    })
}

const saveRowQuery = async function (db,table, data, id, action, key_where) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    let query = '';
    if (action === "ADD") {
        let qValue = '';
        for (var i = 0; i < values.length; i++) {
            qValue += '?';
            if (values.length > (i + 1)) {
                qValue += ',';
            }
        }
        query = `INSERT INTO ${table} (${fields.toString()}) VALUES (${qValue})`;
    } else {
        let key = '';
        for (var i = 0; i < fields.length; i++) {
            key += `${fields[i]} = ?`;
            if (fields.length > (i + 1)) {
                key += ',';
            }
        }
        query = `UPDATE ${table} SET ${key} WHERE ${key_where} = '${id}'`;
    }


    return await new Promise(function (resolve,reject) {
        db.query(query, values, function (err, rows) {
            if (err) {
                reject(err)
            } else {
                resolve({id:rows.insertId});
            }
        });
    });
}

module.exports = {
    getRowsQuery, runQuery, saveRowQuery
}