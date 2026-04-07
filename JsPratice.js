// const users = [
//   { name: "A", age: 18 },
//   { name: "B", age: 25 },
//   { name: "C", age: 30 },
//   { name: "D", age: 15 }
// ];

// const names = users.filter(num =>num.age < 25 )
//                     .map(username => username.name)
// console.log(names);

// const flight = {
//   flightNo: "AI101",
//   origin: "DEL",
//   destination: "DXB"
// };
// console.log(flight.flightNo);
// console.log(Object.keys(flight));
// console.log(Object.values(flight));

// const data = {
//   flight: "AI101",
//   passengers: [
//     { name: "John", meal: "Veg" },
//     { name: "Sara", meal: "Non-Veg" }
//   ]
// };
// console.log(data.passengers.map(passname => passname.name));
// console.log(data.passengers.filter(meals => meals.meal === "Veg" )
//                             .map(passenger => passenger.name));
// console.log(data.passengers.filter(nmeals => nmeals.meal === "Non-Veg" )
//                             .length);

// const flights = [
//   { flight: "AI101", status: "On Time" },
//   { flight: "AI102", status: "Delayed" },
//   { flight: "AI103", status: "On Time" }
// ];
// console.log(flights.filter(flightStatus => flightStatus.status === "Delayed" )
//                     .map(flightName => flightName.flight ));



// const input = document.getElementById("input");
// const btn = document.getElementById("addBtn");
// const list = document.getElementById("list");
// const getBtn = document.getElementById("getBtn");

// btn.addEventListener("click", ()=>{
// const value = input.value;
// if (value === "") return;
// const li = document.createElement("li");
// li.innerText = value;
// list.appendChild(li);
// input.value = "";

// });


// getBtn.addEventListener("click", ()=>{
//     loadUsers();
// });

// const loadUsers = async () => {
//   try {
//     const response = await fetch("https://jsonplaceholder.typicode.com/users");
//     const users = await response.json(); 
//     users.forEach(user => {
//         const li =document.createElement("li");
//         li.innerText = user.name;
//         list.appendChild(li);   
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//   }   
// };



