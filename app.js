require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
// const cors = require('cors');
const { PORT = 3000 } = process.env;

// app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/images', express.static('public/images'));
app.use('/videos', express.static('public/videos'));
app.use('/documents', express.static('public/documents'));

app.get('/', (req, res) => {
    return res.json({
        status: true,
        message: 'OK',
        error: null
    })
})

const mediaRouter = require('./routes/media.routes.js');
app.use('/api/v1', mediaRouter);


app.listen(PORT, () => console.log('Listening on port', PORT));
