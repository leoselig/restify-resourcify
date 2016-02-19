import npmlog from 'npmlog';
import 'source-map-support/register';
import 'babel-polyfill';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(sinonChai);
chai.use(chaiAsPromised);

npmlog.pause();
