//jshint esversion:6

module.exports.getDate = getDate;

function getDate() {
  let today = new Date();
  currentDay = today.getDay();
  let day = "";

  let options = {
      weekday : "long",
      day : "numeric",
      month : "long",
  };
  
  day = today.toLocaleDateString("en-US", options);

  return day;
}


module.exports.getDay = getDay;
function getDay() {
    let today = new Date();
    currentDay = today.getDay();
    let day = "";
  
    let options = {
        weekday : "long",
    };
    
    day = today.toLocaleDateString("en-US", options);
  
    return day;
  }

  console.log(module.exports)