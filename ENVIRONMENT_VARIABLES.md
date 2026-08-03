# Environment Variables Reference

Below is the complete list of environment variables used by the Talk2Any backend:

| Variable | Description | Example Value | Required |
|---|---|---|---|
| `PORT` | HTTP & Socket server port | `5000` | Yes |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` | Yes |
| `CLIENT_URL` | Frontend origin for CORS policy | `http://localhost:5173` | Yes |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/talk2any` | Yes |
| `JWT_ACCESS_SECRET` | Secret key for signing Access Tokens | `talk2any_super_secret_access_key` | Yes |
| `JWT_REFRESH_SECRET` | Secret key for signing Refresh Tokens | `talk2any_super_secret_refresh_key` | Yes |
| `JWT_ACCESS_EXPIRE` | Expiration duration for Access Tokens | `15m` | Optional |
| `JWT_REFRESH_EXPIRE` | Expiration duration for Refresh Tokens | `7d` | Optional |
| `EMAIL_FROM` | Sender address for system emails | `no-reply@talk2any.com` | Optional |
