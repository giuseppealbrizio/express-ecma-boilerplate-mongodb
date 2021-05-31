import 'core-js/stable';
import 'regenerator-runtime/runtime';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
});

/**
 * This should be the entrypoint: http://localhost:3000/api/v1
 */
describe('API Entrypoint', () => {
  it('should get an object with status and message', async () => {
    const res = await request(app).get('/api/v1');
    const { status, message } = res.body;
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'API endpoint is ready!');
    expect(res.statusCode).toEqual(200);
    expect(status).toContain('success');
    expect(message).toContain('API');
  });
});
