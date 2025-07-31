class Controls {

    constructor() {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        this.#addKeyboardListeners(); // private method for listening to keystrokes
    }

    #addKeyboardListeners() {
        // action on key press
        document.onkeydown = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
                case 'ArrowUp':
                    this.forward = true;
                    break;
                case 'ArrowDown':
                    this.reverse = true;
                    break;
            }
            // console.table(this);
        }
        // no action on key release
        document.onkeyup = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
                case 'ArrowUp':
                    this.forward = false;
                    break;
                case 'ArrowDown':
                    this.reverse = false;
                    break;
            }
            // console.table(this);
        }
    }

}