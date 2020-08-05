const express = require('express');
const postRouter = require('./data/post-router.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
    Hello, post your comments.`)
});

//url = /api/posts 
server.use('/api/posts', postRouter);
//server.use('/clients', clientsRouter);

//post
// {
//     title: "The post title", // String, required
//     contents: "The post contents", // String, required
//     created_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
//     updated_at: Mon Aug 14 2017 12:50:16 GMT-0700 (PDT) // Date, defaults to current date
// }


server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
});



