require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const Sentry = require('@sentry/node');
// const cors = require('cors');
const { PORT = 3000, SENTRY_DSN, RAILWAY_ENVIRONMENT_NAME } = process.env;

// app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/images', express.static('public/images'));
app.use('/videos', express.static('public/videos'));
app.use('/documents', express.static('public/documents'));


Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    environment: RAILWAY_ENVIRONMENT_NAME
  });

app.get('/', (req, res) => {
    console.log(name);
    return res.json({
        status: true,
        message: 'OK',
        error: null,
        data: {
            env: RAILWAY_ENVIRONMENT_NAME
        }
    })
})

const mediaRouter = require('./routes/media.routes.js');
app.use('/api/v1', mediaRouter);

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: 'Not Found',
        error: null
    })
});

app.use((err, req, res, next)=>{
    res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        error: err.message,
        data: {
            env: RAILWAY_ENVIRONMENT_NAME
        }
    })
});

app.listen(PORT, () => console.log('Listening on port', PORT));
