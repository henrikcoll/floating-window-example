let windows = [];
let drag = null;

const defaultWidth = 800;
const defaultHeight = 600;

class UiElement {
	constructor(name, type, classes) {
		this.name = name;

		this.el = document.createElement(type);
		this.el.classList.add(classes);

		this.children = [];
		this.parent = null;
	}

	appendChild(uiElement) {
		this.el.appendChild(uiElement.el);
		this.children.push(uiElement);
		uiElement.setParent(this);
	}

	setParent(uiElement) {
		this.parent = uiElement;
	}

	getChild(name) {
		return this.children.find(uiElement => uiElement.name === name);
	}

	removeChild(child) {
		let index = null;
		if (typeof (child) === 'string') {
			index = this.children.findIndex(uiElement => uiElement.name === child);
		} else {
			index = this.children.findIndex(uiElement => uiElement === child);
		}

		if (index !== null) {
			this.el.removeChild(this.children[index].el);
			return this.children.splice(index, 1);
		}
	}
}

class WindowHeaderExitButton extends UiElement {
	constructor() {
		super('exit-button', 'button', 'window-header-exit');

		this.el.innerHTML = 'X';

		this.el.addEventListener('click', event => {
			event.preventDefault()
			this.parent.parent.parent.removeWindow(this.parent.parent);
		});
	}
}

class WindowHeaderTitle extends UiElement {
	constructor() {
		super('title', 'span', 'window-header-title');
	}

	setTitle(title) {
		this.el.innerText = title
	}
}

class WindowHeader extends UiElement {
	constructor() {
		super('header', 'div', 'window-header');

		this.appendChild(new WindowHeaderTitle());
		this.appendChild(new WindowHeaderExitButton());

		this.el.addEventListener('mousedown', event => {
			event.preventDefault();

			this.parent.el.classList.add('dragging');

			drag = {
				offset: {
					x: this.parent.el.offsetLeft - event.clientX,
					y: this.parent.el.offsetTop - event.clientY
				},
				window: this.parent
			}
		});
	}

	setTitle(title) {
		this.getChild('title').setTitle(title)
	}
}

class WindowBody extends UiElement {
	constructor() {
		super('body', 'div', 'window-body');
	}
}

class Window extends UiElement {
	constructor(title) {
		super('window', 'div', 'window');

		this.el.style.width = `${defaultWidth}px`;
		this.el.style.height = `${defaultHeight}px`;

		this.appendChild(new WindowHeader());
		this.appendChild(new WindowBody());

		this.setTitle(title);

		this.el.addEventListener('mousedown', event => {
			this.parent.setFocus(this);
		})
	}

	setTitle(title) {
		this.getChild('header').setTitle(title);
	}

	setZIndex(zIndex) {
		this.el.style.zIndex = zIndex;
	}
}

class Display extends UiElement {
	constructor() {
		super('display', 'div', 'display');
		this.focus = [];
	}

	addWindow() {
		let window = new Window();
		let index = this.children.length + 1;
		window.setTitle(`Window ${index}`)
		this.appendChild(window)
	}

	removeWindow(child) {
		let childIndex = this.children.findIndex(el => el == child);
		let focusIndex = this.focus.findIndex(i => i === childIndex);

		this.focus.splice(focusIndex, 1);
		this.removeChild(child);
	}

	updateZIndexes() {
		for (let focusIndex in this.focus) {
			console.log(focusIndex, 10);
			console.log(focusIndex + 10)
			this.children[this.focus[focusIndex]].setZIndex(focusIndex + 10);
		}
	}

	setFocus(child) {
		let childIndex = this.children.findIndex(el => el == child);

		if (childIndex === -1)
			return;

		let focusIndex = this.focus.findIndex(i => i === childIndex);

		if (focusIndex !== -1)
			this.focus.splice(focusIndex, 1)
		this.focus.push(childIndex);

		this.updateZIndexes();
	}
}

const display = new Display();
document.body.appendChild(display.el);

function addWindow() {
	display.addWindow();
}

document.addEventListener('mousemove', event => {
	if (drag) {
		event.preventDefault();
		// set the position
		drag.window.el.style.top = (drag.offset.y + event.clientY) + "px";
		drag.window.el.style.left = (drag.offset.x + event.clientX) + "px";
	}
});

document.addEventListener('mouseup', event => {
	if (drag) {
		event.preventDefault();
		drag.window.el.classList.remove('dragging');
		drag = null;
	}
})

document.getElementById("add-new").addEventListener('click', () => addWindow());