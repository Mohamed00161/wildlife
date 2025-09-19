  document.addEventListener("DOMContentLoaded", () => {

  // SIGN UP
  const signupForm = document.getElementById('signup-container');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmpassword = document.getElementById('confirm-password').value;

      if (password !== confirmpassword) {
        alert("Passwords do not match ❌");
        return;
      }

      const object = { name, email, password };

      fetch('https://backend-ml27.onrender.com/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(object)
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to save data");
          return res.json();
        })
        .then(data => {
          console.log("Saved:", data);
          alert("Account created ✅");
          signupForm.reset();
        })
        .catch(err => console.error("Error:", err));
    });
  }

  // SIGN IN
  const signinForm = document.getElementById('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;

      fetch(`https://backend-ml27.onrender.com/form?email=${email}&password=${password}`)
        .then(res => res.json())
        .then(users => {
          if (users.length > 0) {
            alert("Login successful 🎉");
            console.log("Logged in user:", users[0]);
            window.location.href = "Dashboard/admin.html"; 
            
          } else {
            alert("Invalid email or password ❌");
          }
        })
        .catch(err => console.error("Error:", err));
    });
  }

// Booking form submission
document.addEventListener("submit", function (e) {
  e.preventDefault(); 

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    package: document.getElementById("package").value,
    date: document.getElementById("date").value,
    guests: document.getElementById("guests").value,
    requests: document.getElementById("requests").value,
  };

  fetch('https://backend-ml27.onrender.com/POSTS', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(data => {
    addTable(data); // immediately add to table after saving
    
  });
});

// Fetch existing posts on load
fetch('https://backend-ml27.onrender.com/POSTS')
  .then(res => res.json())
  .then(POSTS => {
    POSTS.forEach(addTable);
  });

function addTable(forms){
  let div = document.getElementById("tableBody");
  let row = document.createElement("tr");

  row.innerHTML = `
    <td class="name">${forms.name}</td>
    <td class="email">${forms.email}</td>
    <td class="phone">${forms.phone}</td>
    <td class="package">${forms.package}</td>
    <td class="date">${forms.date}</td>
    <td class="guests">${forms.guests}</td>
    <td class="requests">${forms.requests}</td>
    <td><button class="deleteBtn">Delete</button></td>
    
  `;

  div.appendChild(row);

  // DELETE FUNCTIONALITY
  row.querySelector('.deleteBtn').addEventListener('click', function(){
    fetch(`https://backend-ml27.onrender.com/POSTS/${forms.id}`, {
      method: "DELETE"
    })
    .then(() => {
      row.remove(); // remove from table only after successful delete
    });
  });

  // UPDATE FUNCTIONALITY
  row.querySelector('.updateBtn').addEventListener('click', function(){
    // Fill form with row data for editing
    document.getElementById("name").value = forms.name;
    document.getElementById("email").value = forms.email;
    document.getElementById("phone").value = forms.phone;
    document.getElementById("package").value = forms.package;
    document.getElementById("date").value = forms.date;
    document.getElementById("guests").value = forms.guests;
    document.getElementById("requests").value = forms.requests;

    // Change form submit to UPDATE instead of POST
    const form = document.querySelector("form");
    form.onsubmit = function(e){
      e.preventDefault();

      const updatedData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        package: document.getElementById("package").value,
        date: document.getElementById("date").value,
        guests: document.getElementById("guests").value,
        requests: document.getElementById("requests").value,
      };

      fetch(`https://backend-ml27.onrender.com/POSTS/${forms.id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(updatedData)
      })
      .then(res => res.json())
      .then(updated => {
        // update row in table
        row.querySelector(".name").textContent = updated.name;
        row.querySelector(".email").textContent = updated.email;
        row.querySelector(".phone").textContent = updated.phone;
        row.querySelector(".package").textContent = updated.package;
        row.querySelector(".date").textContent = updated.date;
        row.querySelector(".guests").textContent = updated.guests;
        row.querySelector(".requests").textContent = updated.requests;

        // Reset form submit back to POST mode
        form.onsubmit = null;
        form.reset();
      });
    };
  });
  
} 
})



// contact form
document.addEventListener("submit", function (e) {
  e.preventDefault(); 

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
    
  };

  fetch('https://backend-ml27.onrender.com/message', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(data => {
    addTable(data); // immediately add to table after saving
  });
});

// Fetch existing posts on load
fetch('https://backend-ml27.onrender.com/message')
  .then(res => res.json())
  .then(message => {
    message.forEach(addTable);
  });

function addTable(forms){
  let div = document.getElementById("userTable");
  let row = document.createElement("tr");

  row.innerHTML = `
    <td class="name">${forms.name}</td>
    <td class="email">${forms.email}</td>
    <td class="message">${forms.message}</td>
    <td><button class="deleteBtn">Delete</button></td>
    <td><button class="updateBtn">Update</button></td>
  `;

  div.appendChild(row);

  // DELETE FUNCTIONALITY
  row.querySelector('.deleteBtn').addEventListener('click', function(){
    fetch(`https://backend-ml27.onrender.com/message/${forms.id}`, {
      method: "DELETE"
    })
    .then(() => {
      row.remove(); // remove from table only after successful delete
    });
  });

// UPDATE FUNCTIONALITY
row.querySelector('.updateBtn').addEventListener('click', function () {
  // Fill form with row data for editing
  document.getElementById("name").value = forms.name;
  document.getElementById("email").value = forms.email;
  document.getElementById("message").value = forms.message;

  const form = document.querySelector("form");

  // Remove any previous submit handler to avoid duplicates
  form.onsubmit = function (e) {
    e.preventDefault();

    const updatedData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    fetch(`https://backend-ml27.onrender.com/message/${forms.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(updated => {
        // Update row in table
        row.querySelector(".name").textContent = updated.name;
        row.querySelector(".email").textContent = updated.email;
        row.querySelector(".message").textContent = updated.message;

        // Reset form
        form.reset();

        // Restore form to POST mode (new entries)
        form.onsubmit = defaultPostHandler; // <-- define your normal POST function
      })
      .catch(err => console.error("Update failed:", err));
  };
});
}











































































































































































































































































































































































































// document.getElementById('booking-form').addEventListener("submit",addforms);
// function addforms(e){
//   e.preventDefault()

//   let name = document.getElementById('name')
//   let email = document.getElementById('email')
//   let phone = document.getElementById('phone')
//   let package = document.getElementById('package')
//   let date = document.getElementById('date')
//   let guests = document.getElementById('guests')
//   let requests = document.getElementById('requests')


// let object ={
//   name:name.value,
//   email:email.value,
//   phone:phone.value,
//   package:package.value,
//   date:date.value,
//   guests:guests.value,
//   requests:requests.value,

// }
// fetch("https://backend-ml27.onrender.com/POSTS",{
//   method:"POST",
//   headers:{
//     'content-type':'application/json'
//   },
//   body:JSON.stringify(object)

// })
// }
//         function  getPOSTS(){           
//         fetch("https://backend-ml27.onrender.com/POSTS")
//             .then(response => response.json())
//             .then(POSTS => {
//                 POSTS.forEach(POSTS) // Get the table body element


            
//         })
      
//             .catch(error => console.error('Error fetching data:', error));
//     POSTS.forEach(item => {
//         const row = document.createElement('tr');
//         // Example for specific columns
//         const cell1 = document.createElement('td');
//         cell1.textContent = item.name; 
//         row.appendChild(cell1);

//         const cell2 = document.createElement('td');
//         cell2.textContent = item.email; 
//         row.appendChild(cell2);

//         const cell3 = document.createElement('td');
//         cell3.textContent = item.phone; 
//         row.appendChild(cell3);

//         const cell4 = document.createElement('td');
//         cell4.textContent = item.package; 
//         row.appendChild(cell4);

//         const cell5 = document.createElement('td');
//         cell5.textContent = item.date; 
//         row.appendChild(cell5);

//         const cell6 = document.createElement('td');
//         cell6.textContent = item.guests; 
//         row.appendChild(cell6);

//         const cell7 = document.createElement('td');
//         cell7.textContent = item.requests; 
//         row.appendChild(cell7);
        

//         tableBody.appendChild(row);
//     });
//   }

  // const bookingForm = document.getElementById('booking-form');
  // const tableBody = document.querySelector('tbody');

  // const apiUrl = 'https://backend-ml27.onrender.com/POSTS'; // Change if your endpoint is different

  // // Submit form
  // bookingForm.addEventListener('submit', async (event) => {
  //   event.preventDefault();

  //   // Collect form data
  //   const booking = {
  //     name: document.getElementById('name').value.trim(),
  //     email: document.getElementById('email').value.trim(),
  //     phone: document.getElementById('phone').value.trim(),
  //     package: document.getElementById('package').value,
  //     date: document.getElementById('date').value,
  //     guests: document.getElementById('guests').value,
  //     requests: document.getElementById('requests').value.trim()
  //   };

  //   // Save to server
  //   await fetch(apiUrl, {
  //     method: 'POST',
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(booking)
  //   });

  //   // Refresh table
  //   loadBookings();

  //   // Clear form
  //   bookingForm.reset();
  // });

  // // Load data into table
  // async function loadBookings() {
  //   tableBody.innerHTML = ""; // Clear old rows
  //   const response = await fetch(apiUrl);
  //   const bookings = await response.json();

  //   bookings.forEach(booking => {
  //     const row = document.createElement('tr');
  //     row.innerHTML = `
  //       <td>${booking.name}</td>
  //       <td>${booking.email}</td>
  //       <td>${booking.phone}</td>
  //       <td>${booking.package}</td>
  //       <td>${booking.date}</td>
  //       <td>${booking.guests}</td>
  //       <td>${booking.requests}</td>
  //     `;
  //     tableBody.appendChild(row);
  //   });
  // }

  // // Load existing bookings on page load
  // loadBookings();