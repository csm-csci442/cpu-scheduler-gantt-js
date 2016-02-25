var os = {};


os.Process = function(index) {
  /**
   * [name description]
   * @type {[type]}
   */
  this.name = String.fromCharCode(65 + index);
  this.service_time = 5;
  this.arrival_time = 0;

  this.ticks = [];
};


os.Process.RUNNING = 'R';

os.Process.ARRIVED = 'A';


/**
 * Controller for doing the stupid process scheduling table.
 */
os.ProcessListCtrl = function() {
  /**
   * @type {number}
   */
  this.num_processes = 5;

  /**
   * @type {number}
   */
  this.dispatch_overhead = 1;

  /**
   * @type {Array<!os.Process>}
   */
  this.processes = [];

  /**
   * @type {number}
   */
  this.ticks = new Array(25);

  // Create the initial array of processes.
  this.update_processes();
};


os.ProcessListCtrl.prototype.update_processes = function() {
  if (!this.num_processes) {
    return;
  }

  var processes = [];

  for (var i = 0; i < this.num_processes; i++) {
    processes[i] = this.processes[i] || new os.Process(i);
  }

  this.processes = processes;
};


angular.module('os', []).controller('ProcessListCtrl', os.ProcessListCtrl);
