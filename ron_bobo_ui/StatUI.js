
class StatUI {
printStats(blobs) {
  const colony1 = blobs.filter(b => b.currentColony == '1');
  const colony2 = blobs.filter(b => b.currentColony == '2');
  const colony3 = blobs.filter(b => b.currentColony == '3');

   var header1 = document.getElementById("1_header");
   var normal1 = document.getElementById("1_normal");
   var infected1 = document.getElementById("1_infected");
   var recovered1 = document.getElementById("1_recovered");
   var dead1 = document.getElementById("1_dead");
   var count1 = document.getElementById("1_count");
   header1.innerHTML =
   "Colony 1";
   normal1.innerHTML = colony1.filter(b => b.state == "normal").length;
   infected1.innerHTML = colony1.filter(b => b.state == "infected").length;
   recovered1.innerHTML = colony1.filter(b => b.state == "removed").length;
   dead1.innerHTML = colony1.filter(b => b.state == "dead").length;
   count1.innerHTML = colony1.length;

  var header2 = document.getElementById("2_header");
  var normal2 = document.getElementById("2_normal");
  var infected2 = document.getElementById("2_infected");
  var recovered2 = document.getElementById("2_recovered");
  var dead2 = document.getElementById("2_dead");
  var count2 = document.getElementById("2_count");
  header2.innerHTML =
  "Colony 2";
  normal2.innerHTML = colony2.filter(b => b.state == "normal").length;
  infected2.innerHTML = colony2.filter(b => b.state == "infected").length;
  recovered2.innerHTML = colony2.filter(b => b.state == "removed").length;
  dead2.innerHTML = colony2.filter(b => b.state == "dead").length;
  count2.innerHTML = colony2.length;

  var header3 = document.getElementById("3_header");
  var normal3 = document.getElementById("3_normal");
  var infected3 = document.getElementById("3_infected");
  var recovered3 = document.getElementById("3_recovered");
  var dead3 = document.getElementById("3_dead");
  var count3 = document.getElementById("3_count");
  header3.innerHTML =
  "Colony 3";
  normal3.innerHTML = colony3.filter(b => b.state == "normal").length;
  infected3.innerHTML = colony3.filter(b => b.state == "infected").length;
  recovered3.innerHTML =  colony3.filter(b => b.state == "removed").length;
  dead3.innerHTML = colony3.filter(b => b.state == "dead").length;
  count3.innerHTML = colony3.length;

    }
}
export default StatUI;