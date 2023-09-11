import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const formatLogMessage = winston.format.printf((info: winston.Logform.TransformableInfo) => {
  return `${info['timestamp']} ${info['level']}: ${info['context']} ${
    info['message']
  } ${JSON.stringify('metadata')}`;
});

const createWinstonLogger = () => {
  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.cli(),
          winston.format.splat(),
          winston.format.timestamp(),
          formatLogMessage,
          nestWinstonModuleUtilities.format.nestLike('MyApp', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    ],
  });
};

export const createLogger = () => {
  const logger: winston.Logger = createWinstonLogger();

  return logger;
};
