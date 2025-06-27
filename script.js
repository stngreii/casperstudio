// script.js

document.addEventListener('DOMContentLoaded', function () {
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
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'user',
            width: { ideal: 1080 },
            height: { ideal: 1920 },
            aspectRatio: 9 / 16
        }
    }).then(function (stream) {
        video.srcObject = stream;
        console.log("Kamera diizinkan");
    }).catch(function (err) {
        console.error("Kamera ditolak: ", err);
    });

    // Tampilkan frame photobooth saat tombol Start ditekan
    startBtn.addEventListener('click', function () {
        photoboothFrame.style.display = 'block';
        setTimeout(() => {
            photoboothFrame.style.opacity = 1;
        }, 10);
    });

    // Ambil foto saat tombol ditekan
    captureBtn.addEventListener('click', function () {
        const videoAspect = video.videoWidth / video.videoHeight;
        const targetAspect = 9 / 16;
        const context = canvas.getContext('2d');

        // Crop agar pas dengan rasio overlay
        let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;
        if (videoAspect > targetAspect) {
            // video lebih lebar → crop sisi kiri-kanan
            sWidth = video.videoHeight * targetAspect;
            sx = (video.videoWidth - sWidth) / 2;
        } else if (videoAspect < targetAspect) {
            // video lebih tinggi → crop atas-bawah
            sHeight = video.videoWidth / targetAspect;
            sy = (video.videoHeight - sHeight) / 2;
        }

        canvas.width = 1080;
        canvas.height = 1920;

        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1); // flip horizontal agar tidak mirror
        context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        context.restore();

        if (currentOverlay) {
            overlayImage.src = currentOverlay;
            overlayImage.onload = function () {
                context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
                const imgData = canvas.toDataURL('image/png');
                capturedImage = imgData;
                showEditTab();
            };
        } else {
            const imgData = canvas.toDataURL('image/png');
            capturedImage = imgData;
            showEditTab();
        }
    });

    function showEditTab() {
        editTab.style.display = 'block';
        const editedContext = editedCanvas.getContext('2d');
        editedCanvas.width = canvas.width;
        editedCanvas.height = canvas.height;
        editedContext.drawImage(canvas, 0, 0);
    }

    const liveOverlay = document.getElementById('live-overlay');
    overlaySelect.addEventListener('change', function () {
        currentOverlay = this.value;
        if (currentOverlay) {
            liveOverlay.src = currentOverlay;
            liveOverlay.style.display = 'block';
        } else {
            liveOverlay.style.display = 'none';
        }
    });

    editOverlaySelect.addEventListener('change', function () {
        const editedContext = editedCanvas.getContext('2d');
        editedContext.clearRect(0, 0, editedCanvas.width, editedCanvas.height);
        const img = new Image();
        img.src = capturedImage;
        img.onload = function () {
            editedContext.drawImage(img, 0, 0);
            if (this.value) {
                overlayImage.src = this.value;
                overlayImage.onload = function () {
                    editedContext.drawImage(overlayImage, 0, 0, editedCanvas.width, editedCanvas.height);
                };
            }
        };
    });

    document.querySelector('.save-btn').addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = editedCanvas.toDataURL('image/png');
        link.download = 'captured-photo.png';
        link.click();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const target = this.getAttribute('href');

            if (target === '#home') {
                homeSection.style.display = 'block';
                infoSection.style.display = 'none';
                photoboothFrame.style.display = 'none';
                editTab.style.display = 'none';
            } else if (target === '#info') {
                homeSection.style.display = 'none';
                infoSection.style.display = 'block';
                window.scrollTo(0, infoSection.offsetTop);
            }
        });
    });
});
