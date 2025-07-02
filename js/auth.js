const info = document.getElementById("infoJs");

  info.addEventListener("click", function () {
    Swal.fire("Kami sedang mengembangkan fitur rumit ini. Mohon ditunggu saja");
  });
// mengarahkan ke situs lain
function openFromData(button) {
    const url = button.getAttribute("data-url");
    if (url) {
      window.open(url, "_blank"); // buka di tab baru
    }
  }