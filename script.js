// Все скрипты из тега <script> в оригинальном HTML
// Вставьте сюда весь JavaScript из файла PreDec.txt

// Cookie Consent
(() => {
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieAccept = document.getElementById('cookie-accept');
    
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieConsent.classList.remove('hidden');
        }, 2000);
    }
    
    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.classList.add('hidden');
    });
})();

// Form Validation
(() => {
    const form = document.getElementById('calc-form');
    const fileInput = document.getElementById('file-upload');
    const emailInput = document.getElementById('email');
    const consentCheckbox = document.getElementById('consent');
    const calculateBtn = document.getElementById('calculate-btn');
    const dropArea = document.getElementById('drop-area');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const removeFile = document.getElementById('remove-file');
    
    function validateForm() {
        const isFileSelected = fileInput.files.length > 0;
        const isEmailValid = emailInput.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,
