document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');
    const modal = document.getElementById("contactModal");
    const btn = document.getElementById("contactBtn");
    const span = document.querySelector(".close-btn");

    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('is-active');
    });

    btn.onclick = function() {
        modal.style.display = "flex"; 
        document.body.style.overflow = "hidden"; 
    }

    span.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; 
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});