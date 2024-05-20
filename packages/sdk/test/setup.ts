/* External Imports */
import chai = require('chai')
import chaiAsPromised from 'chai-as-promised'
import Mocha from 'mocha'

chai.use(chaiAsPromised)
const should = chai.should()
const expect = chai.expect

export { expect, Mocha,should }
