// Initialize scroll effect for each section
initializeScrollEffect('#news', 3);
initializeScrollEffect('#partners', 4.5);

// Function to initialize scroll effect for a section by ID
function initializeScrollEffect(sectionId, indicatorMultiplier) {
    // Get elements specific to the section
    const section = document.querySelector(sectionId);
    const scrollContainer = section.querySelector('.scroll-container');
    const scrollIndicator = section.querySelector('.scroll-indicator');
    const postWidth = scrollContainer.scrollWidth / scrollContainer.childElementCount; // Width of each post

    // Set initial width of the scroll indicator based on the number of posts and custom multiplier
    scrollIndicator.style.width = `${(100 / scrollContainer.childElementCount) * indicatorMultiplier}%`;

    // Variables for swipe functionality
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;
    let startTime = 0;
    const minSwipeDistance = 50; // Minimum distance for a valid swipe in pixels
    const tapThreshold = 10; // Threshold in pixels to detect a tap instead of a swipe

    // Variables for dragging the scrollbar
    let isDraggingIndicator = false;
    let indicatorStartX = 0;
    let indicatorScrollLeft = 0;

    // Add touch event listeners for mobile swipe
    scrollContainer.addEventListener('touchstart', touchStart, { passive: true });
    scrollContainer.addEventListener('touchmove', touchMove, { passive: true });
    scrollContainer.addEventListener('touchend', touchEnd);

    // Add mouse events for desktop swipe support
    scrollContainer.addEventListener('mousedown', touchStart);
    scrollContainer.addEventListener('mousemove', touchMove);
    scrollContainer.addEventListener('mouseup', touchEnd);
    scrollContainer.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    // Add mouse events for dragging the scroll indicator
    scrollIndicator.addEventListener('mousedown', (event) => {
        isDraggingIndicator = true;
        indicatorStartX = event.pageX;
        indicatorScrollLeft = scrollContainer.scrollLeft;
        event.preventDefault(); // Prevents text selection during drag
    });

    document.addEventListener('mousemove', (event) => {
        if (!isDraggingIndicator) return;
        
        // Calculate the change in position
        const deltaX = event.pageX - indicatorStartX;
        const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const indicatorWidth = scrollIndicator.parentElement.clientWidth - scrollIndicator.clientWidth;

        // Calculate the new scroll position based on indicator drag
        const newScrollLeft = indicatorScrollLeft + (deltaX / indicatorWidth) * scrollWidth;
        scrollContainer.scrollLeft = newScrollLeft;

        updateScrollIndicator();
    });

    document.addEventListener('mouseup', () => {
        isDraggingIndicator = false;
    });

    // Functions for swipe events
    function touchStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        scrollLeft = scrollContainer.scrollLeft;
        startTime = new Date().getTime();
        event.preventDefault(); // Prevents text selection during drag
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentX = getPositionX(event);
        const deltaX = currentX - startX;
        scrollContainer.scrollLeft = scrollLeft - deltaX;
    }

    function touchEnd(event) {
        isDragging = false;
        const currentX = getPositionX(event);
        const deltaX = currentX - startX;
        const elapsedTime = new Date().getTime() - startTime;

        // Check swipe speed and distance for a valid swipe action
        if (Math.abs(deltaX) > minSwipeDistance || (Math.abs(deltaX) > 10 && elapsedTime < 500)) {
            if (deltaX < 0) {
                // Swipe left: scroll to the next item
                scrollContainer.scrollLeft += postWidth;
            } else {
                // Swipe right: scroll to the previous item
                scrollContainer.scrollLeft -= postWidth;
            }
        }

        updateScrollIndicator();
    }

    // Helper function to get the X position for touch and mouse events
    function getPositionX(event) {
        if (event.type.includes('mouse')) {
            return event.pageX;
        } else {
            return event.touches[0].clientX;
        }
    }

    // Update the custom scrollbar position based on scroll position
    function updateScrollIndicator() {
        const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScrollLeft = scrollContainer.scrollLeft;
        const scrollPercent = (currentScrollLeft / scrollWidth) * 100;

        scrollIndicator.style.transform = `translateX(${scrollPercent}%)`;
    }

    // Call updateScrollIndicator on scroll to keep the indicator in sync
    scrollContainer.addEventListener('scroll', updateScrollIndicator);
}
