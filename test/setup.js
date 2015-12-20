import npmlog from 'npmlog';
import 'source-map-support/register';
import 'babel-polyfill';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
npmlog.pause();
