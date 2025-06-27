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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Jika ada overlay, gambar overlay di atas foto
        if (currentOverlay) {
            context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
        }
        
        // Simpan foto ke galeri
        const imgData = canvas.toDataURL('image/png');
        capturedImage = imgData; // Simpan gambar yang diambil
        editTab.style.display = 'block'; // Tampilkan tab edit
        const editedContext = editedCanvas.getContext('2d');
        editedCanvas.width = canvas.width;
        editedCanvas.height = canvas.height;
        editedContext.drawImage(canvas, 0, 0); // Tampilkan gambar di canvas edit
    });

    // Ganti overlay saat dipilih
    overlaySelect.addEventListener('change', function() {
        currentOverlay = this.value;
        if (currentOverlay) {
            overlayImage.src = currentOverlay;
        }
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
});
