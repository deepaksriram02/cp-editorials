require('dotenv').config()



const express=require('express')
const mysql =require('mysql2')
const app=express()
const cors=require('cors')
const bodyParser=require('body-parser')
const jwt=require('jsonwebtoken')
const bcryptjs=require('bcryptjs')


const db=mysql.createPool({
    // host: 'localhost',
    // user: 'root',
    // password: process.env.LOCAL_DB_PASSWORD,
    // database: 'cpBlogDB'

    host: 'sql6.freemysqlhosting.net',
    user: 'sql6514918',
    password: process.env.DB_PASSWORD,
    database: 'sql6514918'
})


app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())




app.get('/', (req, res)=>{
    res.send('Welcome')
})



function authenticateUser(req, res, next){
    db.query("select * from user where username=?", [req.body.username], (err, result)=>{
        if(result.length===0){
            return res.send({nouser:'no user found'})
        }
        req.hashedPassword=result[0].pword
        next()
    })
}


function authenticateToken(req, res, next){

    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]

    if(token==null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403)
        req.user=user
        next()
    })

}

app.post('/login', authenticateUser, async (req, res)=>{


    try{
        // if(req.body.pword==req.hashedPassword){
        if(await bcryptjs.compare(req.body.pword, req.hashedPassword)){
            //authenticated
            console.log('authenticated')

            const user={username:req.body.username}
            const accessToken=jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            res.send({accessToken, username:req.body.username})
        }else{
            return res.send({nouser: 'no user found'})

        }
    } catch{
        return res.send({nouser: 'no user found'})
    }        

})


app.post('/signup', async (req, res)=>{
    db.query("select username from user where username=?", [req.body.username], (err, result)=>{
        console.log(result)
        if(result.length>0){
            console.log('user exists')
            return res.send({userexists:true})
        }
    })

    const hashedPassword = await bcryptjs.hash(req.body.pword, 3)
    // const hashedPassword = req.body.pword

    console.log(hashedPassword, hashedPassword.length)
    db.query("insert into user (name, username, pword, contribution) values(?,?,?,0)", [req.body.name, req.body.username, hashedPassword], (err, result)=>{
        res.send(result)
    })
    
})




app.get('/users', authenticateToken,(req, res)=>{
    db.query("select username, contribution, name from user order by contribution desc", (err, result)=>{
        res.send(result)
    })
})




app.get('/posts', authenticateToken,(req, res)=>{

    db.query("select * from post order by rating desc", (err, result)=>{
        res.send(result)
    })
})



app.get('/posts/:id',authenticateToken,(req, res)=>{
    // console.log(req.headers)
    // console.log('auth header is', req.headers['authorization'])

    db.query("select * from post where username=? order by rating desc", [req.params.id], (err, result)=>{
        res.send(result)
    })
})


app.get('/post/:id', authenticateToken,(req, res)=>{
    db.query("select * from post where id=?", [req.params.id], (err, result)=>{
        res.send(result)
    })
})


app.get('/liked/:postid/:username',authenticateToken,(req, res)=>{
    // check user 
    if(req.params.username!==req.user.username){
        return res.sendStatus(401)
    }


    db.query("select act from likes where postid=? and username=?", [req.params.postid, req.params.username],(err, result)=>{
        res.send(result)
    })
    
})


app.get('/comments/:postid', authenticateToken,(req, res)=>{
    db.query("select * from comments where postid=? order by id desc", [req.params.postid],(err, result)=>{
        res.send(result)
    })
})




app.post('/create', authenticateToken, (req, res)=>{

    if(req.body.username!==req.user.username){
        return res.sendStatus(401)
    }

    db.query("insert into post (title, content, username,rating, link, codelink, createdat) values(?, ?,?,?, ?, ?, ?)", [req.body.title, req.body.content, req.body.username,0, req.body.link, req.body.codelink, req.body.createdat], (err, result)=>{
        res.send(result)
    })
})


app.post('/liked/:postid/:username', authenticateToken, (req, res)=>{
    if(req.params.username!==req.user.username){
        return res.sendStatus(401)
    }

    function updateAfterLike(err, result){
        db.query("update post p set rating=((select count(*) from likes where postid=p.id and act>0) -(select count(*) from likes where postid=p.id and act<0))", (err, result)=>{
            // update contribution
            db.query("update user u set contribution=(select sum(rating) from post where username=u.username)", (err, result)=>{
                db.query("update user set contribution=? where contribution is null", [0], (err, result)=>{
                    return res.send(result)
                })
            })
        })
    }

    db.query("select * from likes where postid=? and username=?", [req.params.postid, req.params.username], (err, result)=>{

        if(result.length>0 && req.body.act!=0){
            db.query("update likes set act=? where postid=? and username=?", [req.body.act, req.params.postid, req.params.username], updateAfterLike)
        }
        else{
            if(req.body.act==0){
                db.query("delete from likes where postid=? and username=?", [req.params.postid, req.params.username], updateAfterLike)

            }
            else{
                db.query("insert into likes (postid, username, act) values(?,?,?)", [req.params.postid, req.params.username, req.body.act],updateAfterLike)
            }
        }
    })
   
})


app.post('/comments/:postid/:username', authenticateToken,(req, res)=>{

    if(req.params.username!==req.user.username){
        return res.sendStatus(401)
    }

    db.query("insert into comments (postid, username, content) values(?,?,?)", [req.params.postid, req.params.username, req.body.content],(err, result)=>{
        res.send(result)
    })
})



app.delete('/posts/:id', authenticateToken,(req, res)=>{


    db.query("delete from comments where postid=?", [req.params.id], (err, result)=>{
        db.query("delete from likes where postid=?", [req.params.id], (err, result)=>{
            db.query("delete from post where id=?", [req.params.id], (err, result)=>{


                // update posts
                db.query("update post p set rating=((select count(*) from likes where postid=p.id and act>0) -(select count(*) from likes where postid=p.id and act<0))", (err, result)=>{
                    
                    // update cont
                    db.query("update user u set contribution=(select sum(rating) from post where username=u.username)", (err, result)=>{
                        db.query("update user set contribution=? where contribution is null", [0], (err, result)=>{
                            res.send(result)
        
                        })
                    })
                })
            })
        })
        
    })
    
})


app.listen(process.env.PORT || 3001, ()=>{
    console.log(`running on ${process.env.PORT || 3001}`)
})


