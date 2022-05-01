const express = require('express'); 
const req = require('express/lib/request');
const res = require('express/lib/response');
const app=express();
const User = require('./models/user');
const Branch = require('./models/branch');
const bcrypt = require('bcrypt');
const session = require('express-session');
var today = new Date();
const mongoose = require("mongoose");
const { use } = require('bcrypt/promises');
const { text } = require('express');
let alert = require('alert');
const user = require('./models/user');
const Admin = require('./models/admin');
const crypto = require("crypto");
mongoose.connect("mongodb+srv://atm:atm@cluster0.miu5u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, () => { 
    console.log('connected to database') 
})

//To Generate Unique Number


app.set('view engine','ejs');//To view the ejs file (HTML file)
app.set('views','views');
app.use( express.static( "public" ) );//To store images in the public dir
app.use(express.urlencoded({extended: true}));
app.use(session({secret:'notagoodsecret'})) 

app.get('/',(req,res)=>{
    res.render("home");
})

app.get('/adminregister',(req,res)=>{
    res.render("register")
})

app.get('/adminlogin',(req,res)=>{
    res.render("adminlogin");
})

app.get('/customerlogin',(req,res)=>{
    res.render("customerlogin");
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.get('/newaccount',(req,res)=>{
    res.render("newaccount")
})

app.get('/customer',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    user.findOne({username:req.session.user_id},(err,data)=>{
        res.render('customer',{
            question: data
        })
    })
})

app.get('/ministatement',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    else{
        user.findOne({username:req.session.user_id},(err,data)=>{
            res.render('ministatement',{
                question: data
            })
        })
    }
})

app.get('/addbranch',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/adminlogin');
    } 
    Branch.find({},(err,data)=>{
        res.render('addbranch',{
            question: data
        })
    })
})


app.get('/addmoney',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    user.findOne({username:req.session.user_id},(err,data)=>{
        res.render('addmoney',{
            question:data
        })
    })
})

app.get('/changepin',(req,res)=>{
    res.render("changepin");
})

app.get('/reducemoney',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    user.findOne({username:req.session.user_id},(err,data)=>{
        res.render('withdrawcash',{
            question:data
        })
    })
})

app.get('/editcustomer',(req,res)=>{
    if(!req.session.user_id){
        res.render('adminlogin');
    }
    res.render('editcustomer');
})

app.get('/logout',(req,res)=>{
    req.session.user_id=null;
    res.redirect('/');
})

app.get('/changepassword',(req,res)=>{
    res.render("changepassword");
})
// Functions

app.get('/admin',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/adminlogin');
    }
    user.find({},(err,data)=>{
        res.render('admin',{
            question: data
        })
    })
})

app.get('/allusers',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    else{
        user.find({},(err,data)=>{
            res.render('allusers',{
                question: data
            })
        })
    }
})

app.get('/fastcash',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    } user.findOne({username:req.session.user_id},(err,data)=>{
        res.render('fastcash',{
            question:data
        })
    })
})

app.post('/findbranch',(req,res)=>{
    i=0;
    const {name}=req.body;
    Branch.find({name:{$all:[name]}},(err,data)=>{
        // res.send(data)
        res.render('addbranch',{
            question:data
        })
    })
})

app.post('/addmoney',async(req,res)=>{
    const{username,amount,cheque}=req.body;
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const question=await User.findOneAndUpdate({username:username},
        {$inc:{amount:amount},$set:{cheque:cheque,date:date,time:time}},
        (err,data)=>{
            if(err){
                alert("Cheque Bounced");
                res.redirect("/customer");
            }
            res.redirect("/customer");
        })
    await question.save();
})

app.post('/reducemoney',async(req,res)=>{
    const{username,availablebalance,amount,pin,}=req.body;
    let q1=parseInt(availablebalance);
    let q2=parseInt(amount);
    if(q1-q2>=200){

        const question=await User.findOneAndUpdate(
            {username:username}&&{pin:pin},
            {$inc:{amount:-amount}},
            (err,data)=>{
                if(err){
                    alert("Server Down");
                    res.redirect("/customer");
                }
                res.redirect("/customer");
            })
        await question.save();

    }
    else{
        alert("Insufficient Fund");
        res.redirect('/customer');
    }
})

app.post('/changepin',async (req,res)=>{
    const{username,pin,newpin}=req.body;
    const user = await User.findOneAndUpdate(
        {username:username}&&{pin:pin},
        {$set:{pin:newpin}},(err,data)=>{
            if(err){
                alert("Invalid Username or Pin");
                res.redirect('/changepin');
            } else{
                alert("Password Updated");
                res.redirect('/customer');
            }
        })
    await user.save();
})


app.post('/editcustomer',async (req,res)=>{
    const{firstname,lastname,gender,address,username,mobile,branch,branchid,Accountno}=req.body;
    const user = await User.findOneAndUpdate(
        {Accountno:Accountno},
        {$set:{firstname:firstname,lastname:lastname,gender:gender,address:address,username:username,mobile:mobile,branch:branch,branchid:branchid}},
        (err,data)=>{
            if(err){
                alert("Invalid Account Number");
                res.redirect('/editcustomer');
            } else{
                alert("Details Updated");
                res.redirect('/allusers');
            }
        }
    )
})

app.post('/changepassword',async (req,res)=>{
    const{username,password,mobile}=req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate(
        {username:username}&&{mobile:mobile},
        {$set:{password:hash}},(err,data)=>{
            if(err){
                alert("Invalid username or mobile");
                res.redirect('/changepassword');
            } else{
                alert("Password Updated");
                res.redirect('/login');
            }
        })
    await user.save();
})

app.post('/deletebranch',async(req,res)=>{
    const{id}=req.body;
    Branch.deleteOne({id},(err,data)=>{
        res.redirect('/addbranch');
    })
})

app.post('/setpin',async(req,res)=>{
    const{username,pin}=req.body;
    const question=await User.updateOne({username:username},
        {$set:{pin:pin}},
        (err,data)=>{
            if(err){
                alert("Pin Cannot be Character");
                res.redirect("/customer");
            }
            res.redirect("/customer");
        })
})

app.post('/setuser',async(req,res)=>{
    const id = crypto.randomBytes(7).toString("hex");
    const{branchid,branch,username}=req.body;
    const question =await User.updateOne({username:username},
        {$set:{branchid:branchid,branch:branch,Accountno: id}},
        (err,data)=>{
        if(err){
            alert("Branch Id Should be Number")
            res.redirect('/admin')
        }
        res.redirect('/admin')
    })
    await question.save();
})


app.post('/adminlogin',async(req,res)=>{
    const {username,password}=req.body;
    const admin = await Admin.findOne({username});
    if(!admin){
        alert("Admin not found");
        res.redirect('/adminlogin');
    } 
    else{
        const validPassword = await bcrypt.compare(password,admin.password);
        if(!validPassword){
            alert("Incorrect Password");
            res.redirect('/adminlogin');
        }
        else{
            req.session.user_id=username;
            res.redirect('/admin');
        }
    }
})

app.post('/login',async(req,res)=>{
    const{username,password}=req.body;
    const user= await User.findOne({username});
    if(!user){
        alert("User Not Found");
        res.redirect('/login');
    }else{
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            alert("Incorrect Password");
            res.redirect('/login');
        }
        else{
            req.session.user_id=username;
            res.redirect('/customer');
        }
    }
    
})

app.post('/register',async(req,res)=>{
    const {firstname, lastname, gender,username, password} = req.body;
    const hash = await bcrypt.hash(password,12);

    const userExists = await Admin.findOne({username:username});
    if(userExists!=null){
        alert("User Already Exists");
        res.redirect('/adminregister');
    }
    else{
        const admin = new Admin({
            firstname,
            lastname,
            gender,
            username,
            password:hash
        })

        await admin.save();
        res.redirect('/adminlogin');

    }
})

app.post('/addbranch',async(req,res)=>{
    const {state,city,name}=req.body;


    const branch = new Branch({
        state,
        city,
        name,
        id:Math.floor((Math.random() * 10000) + 1)
    })
    await branch.save();
    res.redirect('/admin');
})

app.post('/newaccount',async(req,res)=>{
    const {firstname,lastname,gender,address,username,password,mobile} = req.body;
    const hash = await bcrypt.hash(password, 12);

    const userExists= await User.findOne({username});
    if(userExists!=null){
        alert("User Already Exists");
        res.redirect("/studentregister");
    }
    else{
        const user = new User({
            firstname,
            lastname,
            gender,
            address,
            username,
            password: hash,
            mobile
        }) 
    
        await user.save();
        res.redirect('/login');
    }
})

app.post('/deleteuser',async(req,res)=>{
    const {username}=req.body;
    User.deleteOne({ username }, function (err, results) {
        res.redirect('/allusers');
    });

})


app.listen(process.env.PORT || 2300, process.env.IP, function(req, res) {
    console.log("Server has been started");
});

