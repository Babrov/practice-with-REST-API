const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { response, application } = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser:true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model('Article', articleSchema);

// all articles

app.route('/articles')
.get((req,res) => {
  Article.find({}, (err,foundArticles) => {
    !err ? res.send(foundArticles) : res.send(err);
  })
})
.post((req,res) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content
  })
  article.save(err => {
    !err ? res.send('added successfuly') : res.send(err);
  });
})
.delete( (req,res) => {
  Article.deleteMany({},err => {
    !err ? res.send('Deleted') : res.send(err);
  })
})

// specific article

app.route('/articles/:articleTitle')

.get((req,res) => {
  Article.findOne({title: req.params.articleTitle}, (err,foundArticle) => {
    foundArticle ? res.send(foundArticle) : res.send('Cant find that article') 
  })
})
.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})
.patch((req,res) => {
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})
.delete((req,res) => {
  Article.deleteOne({title: req.params.articleTitle},(err) => {
    !err ? res.send('deleted') : res.send(err)
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});