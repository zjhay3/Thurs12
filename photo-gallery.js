document.addEventListener("DOMContentLoaded", function () {
    // Toggle sidebar functionality
    const container = document.querySelector('.container');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const toggleSidebar = document.getElementById('toggleSidebar');

    function toggleSidebarState() {
        sidebar.classList.toggle('collapsed');
        container.classList.toggle('sidebar-collapsed');
    }

    sidebarToggle.addEventListener('click', toggleSidebarState);
    toggleSidebar.addEventListener('click', toggleSidebarState);

    // Set active menu item
    const menuItems = document.querySelectorAll('.sidebar-menu li a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.sidebar-menu li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Filter gallery based on category (to be implemented)
            const category = this.getAttribute('href').substring(1);
            filterGallery(category);
        });
    });

    // Filter gallery function (placeholder)
    function filterGallery(category) {
        console.log('Filtering gallery by:', category);
        // Implementation for filtering would go here
    }

    // List of available images
    const allImages = [
        "gallery1.jpg", "gallery2.jpg", "gallery3.jpg", "gallery4.jpg",
        "gallery5.jpg", "gallery6.jpg", "gallery7.jpg", "gallery8.jpg",
        "gallery9.jpg", "gallery10.jpg", "gallery11.jpg", "gallery12.jpg",
        "gallery13.jpg", "gallery14.jpg", "gallery15.jpg",
        "gallery16.jpg", "gallery17.jpg", "gallery18.jpg", "gallery19.jpg",
        "gallery20.jpg", "gallery21.jpg", "gallery22.jpg", "gallery23.jpg",
        "gallery24.jpg", "gallery25.jpg", "gallery26.jpg", "gallery27.jpg",
        "gallery28.jpg", "gallery29.jpg", "gallery30.jpg"
    ];

    // Sample category distribution (you would replace this with your actual categorization)
    const imageCategories = {
        "collaterals": ["gallery1.jpg", "gallery5.jpg", "gallery9.jpg", "gallery13.jpg", "gallery17.jpg", "gallery21.jpg", "gallery25.jpg", "gallery29.jpg"],
        "special": ["gallery2.jpg", "gallery6.jpg", "gallery10.jpg", "gallery14.jpg", "gallery18.jpg", "gallery22.jpg", "gallery26.jpg", "gallery30.jpg"],
        "standard": ["gallery3.jpg", "gallery7.jpg", "gallery11.jpg", "gallery15.jpg", "gallery19.jpg", "gallery23.jpg", "gallery27.jpg"],
        "upgraded": ["gallery4.jpg", "gallery8.jpg", "gallery12.jpg", "gallery16.jpg", "gallery20.jpg", "gallery24.jpg", "gallery28.jpg"]
    };

    // Setup the gallery rows
    const galleryRows = document.querySelectorAll(".gallery-row");

    // Setup each row
    galleryRows.forEach((row, index) => {
        // Store original styles
        const computedStyle = window.getComputedStyle(row);
        const originalGap = computedStyle.columnGap || '50px';
        
        // Select random images
        let shuffled = [...allImages].sort(() => 0.5 - Math.random());
        let selectedImages = shuffled.slice(0, 6);
        
        // Create image elements HTML
        let baseImagesHTML = '';
        selectedImages.forEach(img => {
            baseImagesHTML += `<img src="images/${img}" alt="Gallery Image" data-fullsize="images/${img}">`;
        });
        
        // Duplicate the images enough times to fill the screen width multiple times
        row.innerHTML = baseImagesHTML.repeat(10);
        
        // Wait for images to load to get accurate measurements
        setTimeout(() => {
            const imageElements = row.querySelectorAll('img');
            
            // Preserve the original gap between images
            const gapSize = parseInt(originalGap) || 50;
            row.style.columnGap = `${gapSize}px`;
            
            // Calculate the width of a single set (all unique images + gaps)
            let singleSetWidth = 0;
            for (let i = 0; i < selectedImages.length; i++) {
                singleSetWidth += imageElements[i].offsetWidth;
                // Add gap after each image except the last one
                if (i < selectedImages.length - 1) {
                    singleSetWidth += gapSize;
                }
            }
            
            // Direction alternates by row index
            const goingRight = index % 2 === 0;
            
            // Set initial position
            let currentPosition = goingRight ? 0 : -singleSetWidth;
            row.style.transform = `translateX(${currentPosition}px)`;
            
            // Speed varies by row (pixels per frame)
            const speed = goingRight ? 0.9 : -0.9;
            
            // Store pause state
            let isPaused = false;
            let lastFrameTime = 0;
            
            // Animation function for seamless scrolling
            function animateRow(timestamp) {
                // Throttle to reasonable frame rate for smoother animation
                if (timestamp - lastFrameTime < 16) { // ~60fps
                    requestAnimationFrame(animateRow);
                    return;
                }
                
                lastFrameTime = timestamp;
                
                if (!isPaused) {
                    // Move the row
                    currentPosition += speed;
                    
                    // Check if we need to reset (invisibly)
                    if (goingRight) { // Moving right
                        // Apply the movement with CSS transform
                        row.style.transform = `translateX(${currentPosition}px)`;
                        
                        if (currentPosition >= 0) {
                            // When position reaches start, jump back one set width with transition disabled
                            row.style.transition = 'none';
                            currentPosition = -singleSetWidth;
                            row.style.transform = `translateX(${currentPosition}px)`;
                            // Force reflow to apply the transform immediately
                            row.offsetHeight;
                            // Re-enable transition
                            row.style.transition = 'transform 20ms linear';
                        }
                    } else { // Moving left
                        // Apply the movement
                        row.style.transform = `translateX(${currentPosition}px)`;
                        
                        if (currentPosition <= -2 * singleSetWidth) {
                            // When position reaches end, jump forward one set width with transition disabled
                            row.style.transition = 'none';
                            currentPosition = -singleSetWidth;
                            row.style.transform = `translateX(${currentPosition}px)`;
                            // Force reflow
                            row.offsetHeight;
                            // Re-enable transition
                            row.style.transition = 'transform 20ms linear';
                        }
                    }
                }
                
                // Continue animation
                requestAnimationFrame(animateRow);
            }
            
            // Initialize smooth transitions
            row.style.transition = 'transform 20ms linear';
            
            // Start animation
            requestAnimationFrame(animateRow);
            
            // Set up hover effect for individual images
            imageElements.forEach(img => {
                img.addEventListener("mouseenter", () => {
                    isPaused = true;
                    // Add hover effect styling if needed
                    img.style.transform = "scale(1.05)";
                    img.style.transition = "transform 0.3s ease";
                    img.style.zIndex = "5";
                });
                
                img.addEventListener("mouseleave", () => {
                    isPaused = false;
                    // Remove hover effect styling
                    img.style.transform = "scale(1)";
                    img.style.zIndex = "1";
                });
                
                // Add click event for viewing full-size image
                img.addEventListener("click", () => {
                    openLightbox(img.getAttribute('data-fullsize'));
                });
            });
            
            // Also keep the original row hover behavior
            row.addEventListener("mouseenter", () => {
                isPaused = true;
            });
            
            row.addEventListener("mouseleave", () => {
                isPaused = false;
                // Reset any scale effects when leaving the row
                imageElements.forEach(img => {
                    img.style.transform = "scale(1)";
                    img.style.zIndex = "1";
                });
            });
        }, 300); // Delay to ensure images have time to load properly
    });

    // Lightbox functionality
    function openLightbox(imageSrc) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        
        const lightboxContent = document.createElement('div');
        lightboxContent.classList.add('lightbox-content');
        
        const closeButton = document.createElement('span');
        closeButton.classList.add('close-lightbox');
        closeButton.innerHTML = '&times;';
        
        const image = document.createElement('img');
        image.src = imageSrc;
        
        // Assemble and add to document
        lightboxContent.appendChild(closeButton);
        lightboxContent.appendChild(image);
        lightbox.appendChild(lightboxContent);
        document.body.appendChild(lightbox);
        
        // Add event listeners
        closeButton.addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
            }
        });
        
        // Add lightbox styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            
            .lightbox-content img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
            }
            
            .close-lightbox {
                position: absolute;
                top: -40px;
                right: 0;
                color: white;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    // Function to update gallery based on selected category
    function filterGallery(category) {
        // If 'all' is selected, show random images
        if (category === 'all') {
            setupRandomGallery();
            return;
        }
        
        // Otherwise filter by category
        const filteredImages = imageCategories[category] || [];
        
        if (filteredImages.length > 0) {
            galleryRows.forEach((row, index) => {
                // Clear existing content
                row.innerHTML = '';
                
                // Create filtered images HTML
                let imagesHTML = '';
                
                // Use modulo to distribute images evenly among rows
                const rowImages = filteredImages.filter((_, i) => i % galleryRows.length === index);
                
                rowImages.forEach(img => {
                    imagesHTML += `<img src="images/${img}" alt="Gallery Image" data-fullsize="images/${img}">`;
                });
                
                // Duplicate images to fill the row
                row.innerHTML = imagesHTML.repeat(Math.ceil(10 / rowImages.length));
                
                // Reset animation and hover effects (simplified - you'd need to reinitialize properly)
                const imageElements = row.querySelectorAll('img');
                imageElements.forEach(img => {
                    img.addEventListener("click", () => {
                        openLightbox(img.getAttribute('data-fullsize'));
                    });
                });
            });
        }
    }

    // Setup random gallery initially
    function setupRandomGallery() {
        galleryRows.forEach((row, index) => {
            // Clear existing content
            row.innerHTML = '';
            
            // Select random images
            let shuffled = [...allImages].sort(() => 0.5 - Math.random());
            let selectedImages = shuffled.slice(0, 6);
            
            // Create image elements HTML
            let baseImagesHTML = '';
            selectedImages.forEach(img => {
                baseImagesHTML += `<img src="images/${img}" alt="Gallery Image" data-fullsize="images/${img}">`;
            });
            
            // Duplicate the images enough times to fill the screen width multiple times
            row.innerHTML = baseImagesHTML.repeat(10);
        });
    }
});