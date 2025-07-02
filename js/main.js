function generateQR() {
    const canvas = document.getElementById('canvas');
    const name = document.getElementById('name').value.trim();
    const text = document.getElementById('text').value.trim();

    if (!text || !name) {
        Swal.fire({
            title: "Oi, oi, oi",
            text: "Ada yang kurang nihh, lengkapi nama barcode dan linknya ya!",
            icon: "question"
          });
      return;
    }

    QRCode.toCanvas(canvas, text, function (error) {
      if (error) return console.error(error);

      const imgData = canvas.toDataURL("image/png");
      const qrList = JSON.parse(localStorage.getItem("qrHistory")) || [];

      qrList.push({ data: imgData, text, name });
      localStorage.setItem("qrHistory", JSON.stringify(qrList));

      showHistory();
    });
  }

  function downloadQR() {
    const canvas = document.getElementById('canvas');
    const name = document.getElementById('name').value.trim() || 'qrcode';

    const link = document.createElement('a');
    link.download = name + '.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function showHistory() {
    const container = document.getElementById("history");
    container.innerHTML = "";
    const qrList = JSON.parse(localStorage.getItem("qrHistory")) || [];

    qrList.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.id = "history-item";

      const img = document.createElement("img");
      img.src = item.data;
      img.title = item.text;
      img.onclick = () => loadToCanvas(item.data);

      const label = document.createElement("span");
      label.textContent = item.name;

      wrapper.appendChild(img);
      wrapper.appendChild(label);
      container.appendChild(wrapper);
    });
  }

  function loadToCanvas(dataURL) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataURL;
  }

 // Fungsi hapus semua riwayat
 function clearHistory() {
    Swal.fire({
      title: "menghapus riwayat barcode",
      text: "Apakah anda yakin ingin menghapusnya?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
  
        // 1. Hapus data lokal dan tampilkan pesan berhasil
        localStorage.removeItem("qrHistory");
        document.getElementById("history").innerHTML = "";
  
        // 2. Alert berhasil dengan auto-close timer
        let timerInterval;
        Swal.fire({
          title: "Riwayat akan dihapus!",
          html: "Menutup dalam <b></b> ms.",
          timer: 2000,
          icon: "success",
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("Popup tertutup otomatis");
  
            // 3. Tampilkan Drag Me (setelah sukses)
            Swal.fire({
              title: "Masa lalu sudah dihapus :)",
              icon: "success",
              didOpen: (popup) => {
                popup.setAttribute("draggable", true);
                popup.addEventListener("dragstart", (e) => {
                  console.log("Dragging...");
                });
              }
            });
          }
        });
      }
    });
  }
  

  // Saat halaman dibuka, tampilkan riwayat
  showHistory();