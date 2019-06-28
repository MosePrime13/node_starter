import {uncaughtLogger, unhandledLogger} from '../server';

export default function(){
    process.on('uncaughtException', (ex) => {
        uncaughtLogger.error(ex);
        process.exit(1);
    });
  
    process.on('unhandledRejection', (ex) => {
        unhandledLogger.error(ex);
        process.exit(1);
    });
}