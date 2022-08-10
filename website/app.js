// Create a new date instance dynamically with JS for the footer
const year = document.getElementById("year");

function updateYearOnFooter() {
  year.innerHTML = new Date().getFullYear();
}

//On Load

updateYearOnFooter();
