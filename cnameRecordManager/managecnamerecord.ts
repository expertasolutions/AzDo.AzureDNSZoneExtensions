import tl = require('azure-pipelines-task-lib/task');
import msRestAzure = require('ms-rest-azure');
import dnsManagementClient = require('azure-arm-dns');

async function run() {
  try {
    
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
  }
}

run();