const Application = require('spectron').Application
let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')
let electronPath = require('electron')

chai.should()
chai.use(chaiAsPromised)
const timeout = process.env.CI ? 60000 : 10000

describe('Chef Workstation App', function () {
  this.timeout(timeout)
  beforeEach(function () {
    this.app = new Application({
      path: electronPath,
      args: [
        `${__dirname}/..`
      ]
    })
    return this.app.start()
  })

  beforeEach(function () {
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('main process runs on app start', function () {
    return this.app.client
    .waitUntilWindowLoaded()
    .getWindowCount()
    .should.eventually.be.at.least(1)
  })

  it('main window is Chef Workstation App', function () {
    return this.app.client
    .waitUntilWindowLoaded()
    .windowByIndex(0).browserWindow
    .getTitle().should.eventually.equal('Chef Workstation App')
  })
})
