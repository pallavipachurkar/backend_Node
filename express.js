//  npm install express --save
//  npm install mysql
//  npm i body-parser
// const multer = require('multer’);
var mysql = require('mysql');

const bodyParser = require('body-parser');
var cors = require('cors')
const express = require('express');
var app = express();

const multer = require('multer');
const path = require('path');

// body-parser middleware use
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
var port = 8082;

// Create Database Connection

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Pass to next layer of middleware
    next();
});

app.use(
    cors({ origin: ['http://localhost:8082', 'http://127.0.0.1:8082'] })
);

//

//  login api
app.post('/login', async function (req, res) {
    // console.log("SELECT * from users where email='"+req.body.email+"' and password='"+req.body.password+"'");
    // console.log(req);
    con.query("SELECT * from users where email='" + req.body.email + "' and password='" + req.body.password + "'", (err, rows, fields) => {
        if (err) {
            throw err;
        }
        console.log("rows")
        console.log(rows.length)

        if (rows.length > 0) {
            res.send({
                'success': true,
                'user_details': rows
            });
        }
        else {
            res.send({
                'success': false
            })
        }

    });
}
);

//insert product
app.post('/insert_product', async function (req, res) {

    let query = `INSERT INTO products 
    (product_name, product_price, quantity, product_description, product_image,category_id,discount,final_price) VALUES (?,?,?,?,?, ?,?,?);`;

    const value = [req.body.product_name, req.body.product_price, req.body.quantity, req.body.product_description, req.body.product_image, req.body.category_id, req.body.discount, req.body.final_price];
    console.log(req.body.product_description)
    console.log(req.body.category_id)
    console.log(req.body.discount)


    con.query(query, value, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        console.log("Row inserted with id = "
            + rows.insertId);
        if (rows.affectedRows > 0) {
            res.send({
                'success': true,
            });
        }
        else {
            res.send({
                'success': false
            })
        }

        // res.send(rows);
    });
});

//insert category
app.post('/add_category', async function (req, res) {

    let query = `INSERT INTO category 
    (category_name) VALUES (?);`;

    const value = [req.body.category_name];

    con.query(query, value, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        console.log("Row inserted with id = "
            + rows.insertId);
        if (rows.affectedRows > 0) {
            res.send({
                'success': true,
            });
        }
        else {
            res.send({
                'success': false
            })
        }

        res.send(rows);
    });
});
//place_order
app.post('/order_place', async function (req, res) {
    let createDate = new Date()

    let query = `INSERT INTO orders (user_id, order_details, total_payable,date) VALUES (?,?,?,?);`;

    const value = [req.body.user_id, req.body.order_details, req.body.total_payable, createDate];

    con.query(query, value, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        console.log("Row inserted with id = "
            + rows.insertId);
        if (rows.affectedRows > 0) {
            res.send({
                'success': true,
            });
        }
        else {
            res.send({
                'success': false
            })
        }

        // res.send(rows);
    });
});
//order_status
app.post('/order_status', async function (req, res) {


    let query = `UPDATE orders set order_status=? WHERE order_id=?;`;

    const value = [req.body.order_status, req.body.order_id];

    con.query(query, value, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        console.log(rows);

        if (rows.affectedRows > 0) {
            res.send({ "success": true });

        } else {
            res.send({ "success": false });
        }
        // res.send(rows);
    });
}
);

//after order place delete cart items
app.post('/delete_all', async function (req, res) {

    let query = `delete FROM cart WHERE user_id=?`;

    const value = [req.body.user_id];

    mysqlConnection.query(query, value, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        if (rows.affectedRows > 0) {
            res.send({ "success": true });
        } else {
            res.send({ "success": false });
        }
        // console.log("Row inserted with id = "
        // + rows.insertId);
        // res.send(rows);
    });
}
);
//show Reports
app.post('/report', async function (req, res) {
    let start_date = req.body.start_date + " 00:00:00";
    let end_date = req.body.end_date + " 23:59:59";
    let query = `SELECT users.first_name,users.last_name,users.mobile_number,orders.* from orders 
    inner join users 
       on 
       users.id= orders.user_id
    where
    orders.date >= ?
    and
    orders.date <= ? and user_id=?`;
    console.log(query)

    const value = [start_date, end_date, req.body.user_id];

    con.query(query, value, (err, rows, fields) => {
        console.log(con.sql)

        if (err) throw err;

        console.log("rows")
        // if (rows.affectedRows > 0) {

        //     res.send({ "success": true })
        // } else {
        //     res.send({ "success": false });
        // }
        console.log(rows);
        res.send(rows);
        // res.send(rows);
    });
}
);

// get products
app.get('/get_product_list', async function (req, res) {
    let query = 'SELECT * from products'
    // const value = [req.body.category_id];
    // console.log(req.body.category_id)
    con.query(query, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
}
);
//update product
app.post("/update_product", (req, res) => {
    const query = `UPDATE products SET product_name = ?, product_price = ?, quantity = ?, product_description = ?, product_image = ?, category_id = ? WHERE product_id = ?`
    console.log(query)
    const value = [req.body.product_name, req.body.product_price, req.body.quantity, req.body.product_description, req.body.product_image, req.body.category_id, req.body.product_id];

    con.query(query, value, (err, rows, fields) => {

        // console.log(err)   

        if (err) throw err;

        console.log("rows")
        if (rows.affectedRows > 0) {

            res.send({ "success": true })
        } else {
            res.send({ "success": false });
        }
        // res.send(rows);

        // console.log("Number of records deleted: " + res.affectedRows);
    });
});
// delete product

app.post('/delete_product', async function (req, res) {

    let query = `delete FROM products WHERE product_id=?`;

    const value = [req.body.product_id];

    con.query(query, value, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        if (rows.affectedRows > 0) {
            res.send({ "success": true });
        } else {
            res.send({ "success": false });
        }
        // console.log("Row inserted with id = "
        // + rows.insertId);
        // res.send(rows);
    });
}
);
// search product by name
app.post('/search_product', async function (req, res) {

    let query = 'SELECT * FROM products WHERE product_name LIKE "%' + req.body.search + '%"'

    con.query(query, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.send(rows);

    });

}
);
//search category 
app.post('/search_category', async function (req, res) {
    let query = 'SELECT * FROM products WHERE category_id =?'
    const value = [req.body.category_id];
    // console.log(req.body.category_id);

    // console.log('SELECT * FROM products WHERE category_id =?');

    con.query(query, value, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
        res.send(rows);

    });

}
);

// add to cart
app.post('/add_cart', async function (req, res) {

    let query = `INSERT INTO cart 
    (product_id) VALUES (?);`;

    const value = [req.body.product_id, req.body.user_id];
    console.log(req.body.product_id)

    con.query(query, value, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        console.log("Row inserted with id = "
            + rows.insertId);
        res.send(rows);
    });
});


app.post('/show_cart', async function (req, res) {
    let query = 'SELECT COUNT( products.product_id) as count,products.* FROM products join cart on cart.product_id=products.product_id GROUP BY products.product_id';
    // let query = 'SELECT products.* FROM products join cart on cart.product_id=products.product_id';
    console.log(query);

    con.query(query, (err, rows, fields) => {
        if (err) {
            throw err;
        }

        res.send(rows);
    });
}
);

//show category
app.get('/show_category', async function (req, res) {

    let query = 'SELECT * from category'
    con.query(query, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
}
);

//update category
app.post("/update_category", (req, res) => {
    const query = `UPDATE category SET category_name = ? WHERE category_id = ?`

    console.log(query)
    const value = [req.body.category_name, req.body.category_id];

    console.log([req.body.category_id])
    console.log([req.body.category_name])


    con.query(query, value, (err, rows, fields) => {

        // console.log(err)   

        if (err) throw err;

        console.log("rows")
        if (rows.affectedRows > 0) {

            // console.log(res.send({ "success": true }))
            res.send({ "success": true })
        } else {
            res.send({ "success": false });
        }
        // res.send(rows);

        // console.log("Number of records deleted: " + res.affectedRows);
    });
});

//get_category
app.post('/get_category', async function (req, res) {

    let query = 'SELECT * from category where category_id = ?';
    console.log(query);

    const value = [req.body.category_id];
    console.log(value);

    con.query(query, value, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("Row inserted with id = "
            + rows.insertId);
        res.send(rows);
    });
}
);

//delete cart 
app.post("/delete_cart_single_product", (req, res) => {
    const query = "DELETE FROM cart WHERE product_id = ? limit 1";
    console.log(query)
    const value = [req.body.product_id];
    console.log([req.body.product_id])

    con.query(query, value, (err, rows, fields) => {

        // console.log(err)   

        if (err) throw err;

        console.log("rows")
        console.log(rows)
        if (rows.affectedRows > 0) {

            //     // console.log(res.send({ "success": true }))
            res.send({ "success": true })
        } else {
            res.send({ "success": false });
        }
        // res.send(rows);

        // console.log("Number of records deleted: " + res.affectedRows);
    });
});

app.post("/delete_cart_by_product_id", (req, res) => {
    let query = 'delete FROM cart WHERE product_id = ?';
    const value = [req.body.product_id];

    con.query(query, value, (err, rows, fields) => {
        // if (err) {
        //     throw err;
        // }
        if (rows.affectedRows > 0) {
            res.send({ "success": true });
        } else {
            res.send({ "success": false });
        }
        // res.send(rows);

        // console.log("Number of records deleted: " + result.affectedRows);
    });
});

//delete category
app.post("/delete_category", (req, res) => {
    let query = 'delete FROM category WHERE category_id = ? limit 1';
    const value = [req.body.category_id];

    con.query(query, value, (err, rows, fields) => {
        // if (err) {
        //     throw err;
        // }
        if (rows.affectedRows > 0) {
            res.send({ "success": true });
        } else {
            res.send({ "success": false });
        }
        // res.send(rows);

        // console.log("Number of records deleted: " + result.affectedRows);
    });
});

//signup user
app.post('/signup_user', async function (req, res) {

    let query = `INSERT INTO users 
    (first_name, last_name, email, password, address,mobile_number,pincode) VALUES (?, ?, ?,?,?,?,?);`;

    const value = [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.address, req.body.mobile_number, req.body.pincode];

    con.query(query, value, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        console.log("Row inserted with id = "
            + rows.insertId);
        if (rows.affectedRows > 0) {
            res.send({
                'success': true,
            });
        }
        else {
            res.send({
                'success': false
            })
        }

        // res.send(rows);

    });
});
app.post('/get_product', async function (req, res) {

    let query = 'select * from products where product_id= ?';
    console.log(query);

    const value = [req.body.product_id];
    console.log([req.body.product_id]);
    con.query(query, value, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        // console.log("Row inserted with id = "
        //     + rows.insertId);
        res.send(rows);
    });
}
);

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
