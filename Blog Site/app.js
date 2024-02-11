var express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    app = express(),
    path = require("path");
mongoose.connect("mongodb://localhost/blog_app",{useNewUrlParser:true,useUnifiedTopology: true/*,useFindAndModify:false*/});
const db = mongoose.connection;
db.once('open', _ => {
  console.log('Database connected')
})

db.on('error', err => {
  console.error('connection error:', err)
})
app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(expressSanitizer());
app.use(express.static(path.join(__dirname,"public")))
app.use(methodOverride("_method"));
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:String,
    created:{type:Date,default:Date.now()}
})
var Blog = mongoose.model("Blog",blogSchema)

var defaultCampground = [{title:"CooL",image:"https://us.123rf.com/450wm/studiostoks/studiostoks1511/studiostoks151100112/48470556-stock-vector-cool-comic-book-bubble-text-pop-art-retro-style.jpg?ver=6"
                        ,body:"I am coolllll!!!!!!!!!"}]
for(let i= 0;i<defaultCampground.length;i++){
    Blog.exists(defaultCampground[i],function(err,exists){
        if(err){console.log(err)}
        else{
            if(!exists){
                Blog.create(defaultCampground[i],(err,blog)=>{
                    if(!err){
                        console.log(blog)
                    }
                })
            }
        }
    })
}

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});
// INDEX ROUTE
app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(!err){
            res.render("index",{blogs:blogs});
        }
        else{
            console.log(err);
        }
    });  
})
// CREATE NEW ROUTE
app.post("/blogs",(req,res)=>{
    console.log(req.body)
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log(req.body)
    var blog = req.body.blog;
    console.log(blog)
    Blog.create(blog,(err,thisBlog)=>{
        if(err){
            console.log(err);
            res.render("new");
        }
        else{
            console.log("created");
            console.log(thisBlog)
        }
    })
    res.redirect("/blogs")
})
// NEW POST ROUTE
app.get("/blogs/new",(req,res)=>{
    res.render("new");
})
// SHOW ROUTE
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,thisBlog)=>{
        if(err){
            res.redirect("/blogs");
            console.log(err);
        }
        else{
            console.log(thisBlog);
            res.render("show",{blog:thisBlog});
        }
    })
})
// EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,thisBlog)=>{
        if(err){
            console.log(err);
            res.redirect(`/blogs`)
        }
        else{
            res.render("edit",{blog:thisBlog});
        }
    })
})
//UPDATE ROUTE
app.put("/blogs/:id",(req,res)=>{
    req.body.blog = req.sanitize(req.body.blog);
    console.log(req.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,thisBlog)=>{
        if(err){
            res.redirect(`/blogs`)
            console.log(err);
        }
        else{
            res.redirect(`/blogs/${thisBlog._id}`);
        }
    })
})
// DELETE ROUTE
app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/blogs")
            console.log("Error caught "+err);
        }
        else{
            res.redirect("/blogs")
        }
    })
    
})

var server = app.listen(98,function(){
    console.log(`Server has started: port:${server.address().port}`)
})