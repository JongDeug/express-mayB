import http from 'http';

let users = [
  {
    id: 1,
    name: '123',
    age: 12,
  },
];
const server = http.createServer((req, res) => {
  // console.log(req.url);
  // localhost:8000
  if (req.url === '/') {
    res.end('http-server');
  }
  // localhost:8000/users
  else if (req.url.startsWith('/users')) {
    if (req.method === 'GET') {
      const parsedUrl = req.url.split('/');
      // /users
      // /users/~~

      // GET /users
      if (parsedUrl.length === 2) {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8;',
        });
        res.write(JSON.stringify(users));
        res.end();
      }
      // GET /users/:id
      else if (parsedUrl.length >= 2) {
        const id = parsedUrl.at(-1);
        console.log(id);
        if (!id) {
          res.end();
        } else {
          const user = users.find((user) => user.id === +id);

          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8;',
          });
          res.write(JSON.stringify(user));
          res.end();
        }
      }
    } else if (req.method === 'POST') {
      let body = '';
      req
        .on('data', data => {
          console.log({ data });
          body += data;
        })
        .on('end', () => {
          console.log({ body });
          const { age, name } = JSON.parse(body);
          users.push({
            id: new Date().getDate(),
            age,
            name,
          });

          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8;',
          });
          res.write(JSON.stringify(users));
          res.end();
        });

    } else if (req.method === 'DELETE') {
      const parsedUrl = req.url.split('/');
      if (parsedUrl.length <= 2) {
        res.end('wrong url');
      }
      // GET /users/:id
      else if (parsedUrl.length >= 2) {
        const id = parsedUrl.at(-1);
        console.log(id)
        users = users.filter(user => user.id !== +id);

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8;',
        });
        res.write(JSON.stringify(users));
        res.end();
      }
    }
  }
});

server.listen(8000, () => console.log('server start'));
