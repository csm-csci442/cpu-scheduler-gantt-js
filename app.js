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


os.Process.prototype.reset_from_tick = function(tick) {
  this.ticks.splice(tick);
};


os.Process.prototype.remaining_time = function() {
  var executed_t = this.ticks.filter(function(v) {return v === 'R'}).length;

  return this.service_time - executed_t;
};


os.Process.prototype.finished = function() {
  return this.remaining_time() === 0;
};


os.Process.prototype.finish_time = function() {
  if (!this.finished()) {
    return '-';
  }

  for (var i = this.ticks.length; i >= 0; i--) {
    if (this.ticks[i] === 'R') {
      return i + 1;
    }
  }
};


os.Process.prototype.start_time = function() {
  for (var i = 0; i < this.ticks.length; i++) {
    if (this.ticks[i] === 'R') {
      return i;
    }
  }

  return null;
};


os.Process.prototype.turnaround_time = function() {
  if (!this.finished()) {
    return '-';
  }

  return this.finish_time() - this.arrival_time;
};



os.Process.prototype.response_time = function() {
  if (this.start_time() === null) {
    return '-';
  }

  return this.start_time() - this.arrival_time;
};


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
  this.ticks = new Array(50);

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


os.ProcessListCtrl.prototype.toggle_process = function(tick, pid) {
  var p = this.processes[pid];

  if (tick < p.arrival_time) {
    return;
  }

  for (var i = 0; i < this.processes.length; i++) {
    if (i === pid) {
      continue;
    }

    this.processes[i].reset_from_tick(tick);
  }

  switch (p.ticks[tick]) {
    case 'R':
      p.ticks[tick] = 'D';
      break;
    case 'D':
      p.ticks[tick] = null;
      break;
    default:
      if (p.finished()) {
        return;
      }
      p.ticks[tick] = 'R';
  }
};


os.ProcessListCtrl.prototype.clear_chart = function() {
  for (var i = 0; i < this.processes.length; i++) {
    this.processes[i].reset_from_tick(0);
  }
};


angular.module('os', []).controller('ProcessListCtrl', os.ProcessListCtrl);
