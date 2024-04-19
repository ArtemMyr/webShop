const express = require('express');
const session = require('express-session');
const app = express();
const con = require("./module/mysql");

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'djkfgbi23FDG',
    resave: false,
    saveUninitialized: false
}))

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.get('/profile', (req, res) => {
        if (req.session.user && req.session.user.isAuthenticated) {
            res.sendFile(__dirname + '/public/profile.html');
        } else {
            res.sendFile(__dirname + '/public/login.html');
        }
})

// app.get('/', (req, res) => {
//     if (req.session.user && req.session.user.isAuthenticated) {
//         res.sendFile(__dirname + '/public/welcome.html');
//     } else {
//         res.send('Please log in to access this page');
//     }
// })

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/public/welcome.html');
})

app.post('/register', (req, res) => {
    let Login = req.body.loginL;
    let Email = req.body.emailL;
    let Password = req.body.passwordL;

    con.query(`select * from user where login = '${Login}' or email = '${Email}'`, (err, result) => {
        if (err) {
            console.log(err);
        };

        if (result.length > 0) {
            console.log('err', err);
        } else {
            function userPage() {
                req.session.user = {
                    login: Login,
                    email: Email,
                    password: Password,
                    isAuthenticated: true
                };
                res.redirect('/');
            }
            let sql = `insert into user (login, email, password) values ('${Login}', '${Email}', '${Password}')`;
            con.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    userPage();
                };
            })
        }
    })
})


app.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    con.query(`select * from user where login = '${login}' and password = '${password}'`, (err, result) => {
        if (err) {
            console.log(err);
        };

        function userPage() {
            req.session.user = {
                login: login,
                email: result[0].email,
                password: password,
                isAuthenticated: true
            };
            res.redirect('/')
        };

        
        if (result.length > 0) {
            userPage();
            console.log(`Пользователь ${req.session.user.login},${req.session.user.isAuthenticated} успешно зашёл`);
        }else{
            console.log(false)
        }
    })
})



con.connect((err) => {
    if (err) {
        console.log(err);
    }else{
        app.listen(4000, () => {
            console.log("http://localhost:4000");
        })
    }
})