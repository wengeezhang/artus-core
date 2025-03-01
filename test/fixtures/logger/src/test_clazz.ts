import { Inject, Injectable } from '@artus/injection';
import { ArtusLogger, LoggerLevel } from '../../../../src/logger';

@Injectable()
export default class TestLoggerClazz {
  @Inject()
  private logger!: ArtusLogger;

  public testLog(level: LoggerLevel, message: string|Error, ...args: any[]) {
    this.logger.log({
      level,
      message,
      args,
    });
  }

  public testTrace(message: string, ...args: any[]) {
    this.logger.trace(message, ...args);
  }

  public testDebug(message: string, ...args: any[]) {
    this.logger.debug(message, ...args);
  }

  public testInfo(message: string, ...args: any[]) {
    this.logger.info(message, ...args);
  }

  public testWarn(message: string, ...args: any[]) {
    this.logger.warn(message, ...args);
  }

  public testError(message: string|Error, ...args: any[]) {
    this.logger.error(message, ...args);
  }
}
