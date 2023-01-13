const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog')

// express app
const app = express();

mongoose.set('strictQuery', true); // to remove deprication warning

// connect to db
const dbURI = 'mongodb+srv://root:manas1234@node-db.espa2k8.mongodb.net/node-db?retryWrites=true&w=majority';
mongoose.connect(dbURI) // asynchronous method so it takes some time to fire
    .then((result) =>{
        // Listen for request
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    })


// register view engine
app.set('view engine', 'ejs');

// using reditmate middleware and static files i.e to display style files
app.use(express.static('publics'));
app.use(express.urlencoded({extended: true})); // to encode the contents which are filled up in the browser
// use morgan (3rd party middleware)
app.use(morgan('dev'));


// // mongoose and mongo sandbox routes
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'new blog',
//         snippet: 'about my new blog',
//         body: 'more about blog'
//     });
//     blog.save()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });


app.get('/', (req, res) => {
    // const blogs = [
    //     {title : 'Pikachu', snippet : 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat, totam.'},
    //     {title : 'Scizor', snippet : 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat, totam.'},
    //     {title : 'Cindrace', snippet : 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat, totam.'}
    // ];
    // res.render('index', {title : "Home" , blogs});
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', {title : "About"});
});

app.get('/blogs/create', (req, res) => {
    res.render('create', {title : "Create"});
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt : -1})
        .then((result) => {
            res.render('index', {title: 'All Blogs', blogs: result});
        })
        .catch((err) => {
            console.log(err);
        })
});

// app.get('/blogs/:id', (req, res) => {
//     console.log(req.id);
// });


app.post('/blogs', (req, res) => {
    // console.log(req.body);
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs')
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', {blog: result, title: 'Blog Details'});
        })
        .catch((err) => {
            console.log(err);
        })
});

app.delete('/blogs/:id', (req, res) => {
    const id =req.params.id;
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({redirect: '/blogs'});
        })
        .catch((err) => {
            console.log(err);
        })
})




app.use((req, res) => {
    res.render('404', {title : "404"});
});


