import request from 'supertest';
import { appCreator } from '../../src/server/appCreator';

describe('Auth endpoints', () => {
  it('GET "/auth/user" response is 200', async () => {
    const app = appCreator();
    const response = await request(app).get('/auth/user');
    expect(response.status).toEqual(200);
  });
  // This is unusual so it bears explaining
  // Normally, you want non-existent routes to 404 out. However, in our case users might share a react router link with friends so they
  //   can jump in together. Since it is a React router link, the endpoint does not exist on the backend. However, when the friend
  //   accessess that route, we want to send the frontend bundle to the friend, then let React Router take care of bringing then to the
  //   right route.
  // TODO: I don't think I need this anymore, we use webpack to address the reload issue
  it('GET "/nonexistentRoute" response is 200', async () => {
    const app = appCreator();
    const response = await request(app).get('/nonexistentRoute');
    expect(response.status).toEqual(200);
  });
});

describe('api endpoints', () => {
  it('GET "/api/markdown/1" response is 200', async () => {
    const app = appCreator();
    const response = await request(app).get('/api/markdown/1');
    expect(response.status).toEqual(200);
  });

  it('GET "/api/markdown/library" response is 200', async () => {
    const app = appCreator();
    const response = await request(app).get('/api/markdown/library');
    expect(response.status).toEqual(200);
  });

  // Jest does not play nice with the global error handler so test is commented out
  // Guess we have to hand it in e2e
  // it('GET "/api/markdown/nonexistent" response is 500', async () => {
  //   const app = appCreator();
  //   const response = await request(app).get('/api/markdown/nonexistent');
  //   expect(response.status).toEqual(500);
  // });
});
