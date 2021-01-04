exports.getDate= function(){


  let Today = new Date();
  let options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year:"numeric"
};

let day = Today.toLocaleDateString("en-US", options);
return day;
}
exports.getDay=function (){


  let Today = new Date();
  let options = {
  weekday: "long"
};

let day = Today.toLocaleDateString("en-US", options);
return day;
}
