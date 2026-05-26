require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const router = require("./router")

app.use(express.json());
app.use('/', router);
app.use('/api', router );

app.use(( req, res, next) =>  {
	const start = Date.now();
	res.on('finish', () => {
	const duration = Date.now() - start;
	console.log(`${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
	});
	next();
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
