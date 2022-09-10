import express from 'express';
import { json } from 'body-parser';
import { ProducerService } from 'real-time-flight-lib';
import { connectMysql } from './services/logger.service';
import { sendGoingToDepartureFlights } from './services/offair-flights.service';
import { schedule } from 'node-cron';
import { sendOnAirFlights } from './services/onair-flights.service';
import { sendHistoricalFlights } from './services/landed.service';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

export const producer = new ProducerService();

const app = express();
const port = 5001;
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(json());
app.use(cors());

connectMysql();

io.on('connection', async (socket) => {
  // console.log('server connected. id: ', socket.id);
  // console.log('first emit...');
  sendOnAirFlights(io);
});

schedule('* * * * *', () => { // cron job every minute
  // console.log('emitting flights...');
  sendOnAirFlights(io);
  sendGoingToDepartureFlights();
});

schedule('0 0 * * *', () => { // cron job every day at 00:00
  sendHistoricalFlights();
});

httpServer.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${port}`);
  sendHistoricalFlights();
});
