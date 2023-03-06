import { appCreator } from './appCreator';
import http from 'http';
import { attachZoomSignalServer } from './zoomSignalServer';
const PORT = 8080;

// create express server
const app = appCreator();

const httpServer = http.createServer(app);

attachZoomSignalServer(httpServer);

httpServer.listen(PORT, () => console.log(`server is running on port ${PORT}`));
