
exports.dayDate = function() {
  const options = {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long'
  };
  
  const dateString = new Date().toLocaleDateString('en-US', options);

  return dateString;
}

exports.shortDate = function() {
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }

  const dateString = new Date().toLocaleTimeString('en-US', options);

  return dateString;
}