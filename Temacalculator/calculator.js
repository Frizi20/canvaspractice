const calc = document.getElementsByClassName("calc");
// console.log(calc);
const erase = document.getElementById("erase");
const equalsign = document.getElementById("equalsign");

for (let i = 0; i < calc.length; i++) {
  calc[i].addEventListener("click", function () {
    val = calc[i].value;
    document.getElementById("result").value += val;
  });
}

erase.addEventListener("click", function () {
  document.getElementById("result").value = "";
});

equalsign.addEventListener("click", function () {
  var x = document.getElementById("result").value;
  console.log(x)
  var y = eval(x);
  document.getElementById("result").value = y;
});
