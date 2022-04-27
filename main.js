let dragggingWindowEl = null;

let dragOffset = { x: null, y: null };

const defaultWidth = 800;
const defaultHeight = 600;

function addWindow() {
	// Make the header element
	const windowHeaderEl = document.createElement('div');
	windowHeaderEl.classList.add('window-header');

	// Make the exit button element
	const windowHeaderExitEl = document.createElement('button');
	windowHeaderExitEl.classList.add('window-header-exit')
	windowHeaderExitEl.innerHTML = 'X';

	// Put the exit button inside the header
	windowHeaderEl.appendChild(windowHeaderExitEl);

	// Make the body element
	const windowBodyEl = document.createElement('div');
	windowBodyEl.classList.add('window-body');

	// Make the window container.
	const windowEl = document.createElement('div');

	// Put the header and the body inside the window container.
	windowEl.appendChild(windowHeaderEl);
	windowEl.appendChild(windowBodyEl);

	windowEl.classList.add('window');
	windowEl.style.width = `${defaultWidth}px`;
	windowEl.style.height = `${defaultHeight}px`;

	// Remove the window when you press the exit button
	windowHeaderExitEl.addEventListener('click', () => {
		document.body.removeChild(windowEl);
	});

	// start dragging
	windowHeaderEl.addEventListener('mousedown', event => {
		event.preventDefault();

		// Add the dragging class
		windowEl.classList.add('dragging');

		// Set the current dragging window
		dragggingWindowEl = windowEl;

		// Set the offset where the drag started (relative to the window container)
		dragOffset.x = windowEl.offsetLeft - event.clientX;
		dragOffset.y = windowEl.offsetTop - event.clientY;
	});

	windowEl.addEventListener('mousedown', event => {
		event.preventDefault();

		// Put the last clicked at the top (and all others at the bottom).
		document.querySelectorAll('.window').forEach(el => el.style.zIndex = 10);
		windowEl.style.zIndex = 20;
	})

	// Add the window to the document body.
	document.body.appendChild(windowEl);
}

// Move the current dragging window
document.addEventListener('mousemove', event => {
	if (dragggingWindowEl) {
		event.preventDefault();
		// set the position
		dragggingWindowEl.style.top = (dragOffset.y + event.clientY) + "px";
		dragggingWindowEl.style.left = (dragOffset.x + event.clientX) + "px";
	}
});

// stop dragging
document.addEventListener('mouseup', event => {
	if (dragggingWindowEl) {
		event.preventDefault();
		dragggingWindowEl.classList.remove('dragging');
		dragggingWindowEl = null;
	}
})

// make new window when the button is pressed
document.getElementById("add-new").addEventListener('click', () => addWindow());