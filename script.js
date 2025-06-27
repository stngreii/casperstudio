document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const editedCanvas = document.getElementById('edited-canvas');
    const captureBtn = document.querySelector('.capture-btn');
    const overlaySelect = document.getElementById('overlay-select');
    const editOverlaySelect = document.getElementById('edit-overlay-select');
    const overlayImage = new Image();
    let currentOverlay = '';
    let capturedImage = null;
    const photoboothFrame = document.getElementById('photobooth');
    const editTab = document.querySelector('.edit-tab');
    const startBtn = document.querySelector('.start-btn');
    const infoSection = document.querySelector('.info');
    const homeSection = document.querySelector('.hero');
    const navLinks = document.querySelectorAll('.nav-link');

    // Minta izin akses kamera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream; // Tampilkan aliran video di elemen video
            console.log("Kamera diizinkan");
        })
        .catch(function(err) {
            console.error("Kamera ditolak: ", err);
        });

    // Tampilkan frame photobooth saat tombol Start ditekan
    startBtn.addEventListener('click', function() {
        photoboothFrame.style.display = 'block';
        setTimeout(() => {
            photoboothFrame.style.opacity = 1; // Fade in effect
        }, 10);
    });

    // Ambil foto saat tombol ditekan
    captureBtn.addEventListener('click', function() {
        // Mengatur ukuran kanvas menjadi 1080 x 1920
        canvas.width = 1080;
        canvas.height = 1920;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Jika ada overlay, gambar overlay di atas foto
        if (currentOverlay) {
            overlayImage.src = currentOverlay;
            overlayImage.onload = function() {
                context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
                // Simpan foto ke galeri setelah overlay digambar
                const imgData = canvas.toDataURL('image/png');
                capturedImage = imgData; // Simpan gambar yang diambil
                showEditTab();
            };
        } else {
            // Simpan foto ke galeri jika tidak ada overlay
            const imgData = canvas.toDataURL('image/png');
            capturedImage = imgData; // Simpan gambar yang diambil
            showEditTab();
        }
    });

    function showEditTab() {
        editTab.style.display = 'block'; // Tampilkan tab edit
        const editedContext = editedCanvas.getContext('2d');
        editedCanvas.width = canvas.width;
        editedCanvas.height = canvas.height;
        editedContext.drawImage(canvas, 0, 0); // Tampilkan gambar di canvas edit
    }

    // Ganti overlay saat dipilih
    overlaySelect.addEventListener('change', function() {
        currentOverlay = this.value;
    });

    // Ganti overlay saat dipilih di tab edit
    editOverlaySelect.addEventListener('change', function() {
        const editedContext = editedCanvas.getContext('2d');
        editedContext.clearRect(0, 0, editedCanvas.width, editedCanvas.height); // Hapus gambar sebelumnya
        const img = new Image();
        img.src = capturedImage; // Gambar yang diambil
        img.onload = function() {
            editedContext.drawImage(img, 0, 0); // Gambar di canvas edit
            if (this.value) {
                overlayImage.src = this.value; // Gambar overlay
                overlayImage.onload = function() {
                    editedContext.drawImage(overlayImage, 0, 0, editedCanvas.width, editedCanvas.height); // Gambar overlay
                };
            }
        };
    });

    // Simpan foto
    document.querySelector('.save-btn').addEventListener('click', function() {
        const link = document.createElement('a');
        link.href = editedCanvas.toDataURL('image/png');
        link.download = 'captured-photo.png';
        link.click();
    });

    // Navigasi antara Home dan Info
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah perilaku default
            const target = this.getAttribute('href'); // Mendapatkan target dari href

            if (target === '#home') {
                homeSection.style.display = 'block'; // Tampilkan Home
                infoSection.style.display = 'none'; // Sembunyikan Info
                photoboothFrame.style.display = 'none'; // Sembunyikan frame kamera
                editTab.style.display = 'none'; // Sembunyikan tab edit
            } else if (target === '#info') {
                homeSection.style.display = 'none'; // Sembunyikan Home
                infoSection.style.display = 'block'; // Tampilkan Info
                window.scrollTo(0, infoSection.offsetTop); // Scroll ke bagian Info
            }
        });
    });
});
