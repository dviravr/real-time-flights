import { createConnection } from 'mysql';

export enum ServicesEnum {
  FLIGHT_RADAR = 'flightRadar24',
  weather = 'weather',
}

export const mysqlConnection = createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'flights_logs',
});

export const connectMysql = () => {
  mysqlConnection.connect((err) => {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
  });
};

export const sendLog = (service: ServicesEnum) => {
  const now = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  const query = `insert into flights_logs.logs(date, service) values('${now}', '${service}');`;
  mysqlConnection.query(query, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
