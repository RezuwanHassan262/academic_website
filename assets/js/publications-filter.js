document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.publication-filters .filter-btn');
    const publicationItems = document.querySelectorAll('.publication-item');

    // Initialize filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter publication items
            publicationItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                } else {
                    const categories = item.getAttribute('data-category');
                    if (categories && categories.includes(filter)) {
                        item.style.display = 'block';
                        item.classList.remove('hidden');
                    } else {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                    }
                }
            });
            
            // Add animation effect
            publicationItems.forEach((item, index) => {
                if (!item.classList.contains('hidden')) {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 100);
                }
            });
        });
    });

    // Initialize all items as visible
    publicationItems.forEach(item => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });

    // Add scroll animation for publication items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe publication items for scroll animation
    publicationItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });

    // Animate items on load
    setTimeout(() => {
        publicationItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, 300);
});