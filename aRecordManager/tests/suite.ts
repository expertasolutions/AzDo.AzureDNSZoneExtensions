import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Sample task tests', ()=> {
  
  before(function() {

  });

  after(() => {

  });

  it('should success with simple inputs', function(done:MochaDone){
    this.timeout(1000);
    let tp = path.join(__dirname, 'success.js');
    let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    tr.run();
    console.log(tr.succeeded);
    assert.equal(tr.succeeded, true, 'should have succeeded');
    assert.equal(tr.warningIssues.length, 0, 'should have no warning');
    assert.equal(tr.errorIssues, 0, 'should have no errors');
    console.log(tr.stdout);
    assert.equal(tr.stdout.indexOf("hello human") >= 0, true, "should display hello human");
    done();
  }); 

  it('it should fail if tool returns 1', function(done:MochaDone) {
    // Add code here !!
  });

});