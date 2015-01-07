module.exports = InvalidUidError;

// Define a InvalidUidError that prototypally inherits from the Error constructor.
function InvalidUidError(message) {
  this.name = "InvalidUidError";
  this.message = message || "Invalid Pebbles Uid";
}

InvalidUidError.prototype = new Error();
InvalidUidError.prototype.constructor = InvalidUidError;
