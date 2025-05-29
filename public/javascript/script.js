// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
      })
  })();



  // $('.alert').alert();

// Responsive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu enhancements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            // Add smooth animation for mobile menu
            navbarCollapse.style.transition = 'all 0.3s ease';
        });
    }

    // Responsive card adjustments
    function adjustCardLayout() {
        const cards = document.querySelectorAll('.card');
        const screenWidth = window.innerWidth;

        cards.forEach(card => {
            if (screenWidth < 768) {
                card.style.marginBottom = '1rem';
            } else {
                card.style.marginBottom = '2rem';
            }
        });
    }

    // Call on load and resize
    adjustCardLayout();
    window.addEventListener('resize', adjustCardLayout);
});

// Search functionality enhancements
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('input');
    const searchForm = document.querySelector('form[action="/listings"]');

    if (searchInput && searchForm) {
        // Add search suggestions or auto-complete functionality here if needed
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchForm.submit();
            }
        });

        // Clear search functionality
        if (searchInput.value) {
            const clearButton = document.createElement('button');
            clearButton.type = 'button';
            clearButton.className = 'btn btn-outline-secondary';
            clearButton.innerHTML = '<i class="fas fa-times"></i>';
            clearButton.style.marginLeft = '5px';
            clearButton.onclick = function() {
                searchInput.value = '';
                window.location.href = '/listings';
            };
            searchInput.parentNode.appendChild(clearButton);
        }
    }
});