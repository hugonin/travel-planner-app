const year = document.getElementById("year");

// Create a new date instance dynamically with JS for the footer
function updateYearOnFooter() {
  year.innerHTML = new Date().getFullYear();
}

//On Load
updateYearOnFooter();
