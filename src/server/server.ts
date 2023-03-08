import { appCreator } from './appCreator';
import http from 'http';
import { attachZoomSignalServer } from './zoomSignalServer';
const PORT = 8080;

// create express server
const app = appCreator();

const httpServer = http.createServer(app);

attachZoomSignalServer(httpServer);

httpServer.listen(PORT, () => console.log(`server is running on port ${PORT}`));

// Note really related to anything, but a good explanation of how http servers and express are related
// https://stackoverflow.com/questions/24042697/node-js-routes-adding-route-handlers-to-an-already-instantiated-http-server
