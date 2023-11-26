import {createLogger, transports, format} from "winston";

export const logger = createLogger({
  format: format.printf(({level, message}) => {
    const date = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
    return `${date} / ${level} -> ${message}`;
  }),
  transports: [
    new transports.Console(),
    new transports.File({filename: 'combined.log'})
  ]
});
