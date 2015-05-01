
// Ensure a "sails" can be located:
(function() {
  var sails;
  try {
    sails = require('sails');
  } catch (e) {
    console.error('error: cannot find sails module');
    return;
  }

  // Try to get `rc` dependency
  var rc;
  try {
    rc = require('rc');
  } catch (e0) {
    try {
      rc = require('sails/node_modules/rc');
    } catch (e1) {
      console.error('error: Could not find rc module in sails/node_modules/rc ');
      rc = function () { return {}; };
    }
  }


  // Start server
  sails.lift(rc('sails'));
})();
