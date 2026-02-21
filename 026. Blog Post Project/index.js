import express from 'express';
import bodyParser from 'body-parser';
import { posts as _posts } from './posts.js';

const app = express();
const port = 3000;

let posts = [..._posts];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const getBlog = (id) => {
  const blog = posts.find((post) => post.id === Number(id));
  return blog;
};

const createBlog = (title, author, description) => {
  const blog = {
    id: posts.length + 1,
    title: title,
    author: author,
    description: description,
  };
  posts.push(blog);
  console.log(`Added a new blog post: ${JSON.stringify(blog, null, 2)}`);
};

const deleteBlog = (id) => {
  posts = posts.filter((post) => post.id !== Number(id));
  console.log(`Successfully delete blog post: id=${id}`);
};

app.get('/', (req, res) => {
  res.render('index.ejs', {
    posts: posts,
  });
});

app.get('/create-blog', (req, res) => {
  res.render('createBlog.ejs');
});

app.get('/blog/:id', (req, res) => {
  const { id } = req.params;
  const blog = getBlog(id);
  res.render('blog.ejs', {
    id: blog.id,
    title: blog.title,
    author: blog.author,
    description: blog.description,
  });
});

app.post('/submit-create-blog', (req, res) => {
  const { title, author, description } = req.body;

  createBlog(title, author, description);
  res.redirect(303, '/');
});

app.post('/delete-blog-post', (req, res) => {
  const { id } = req.body;
  deleteBlog(id);

  res.redirect(303, '/');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`Open the app at: http://localhost:${port}`);
});
