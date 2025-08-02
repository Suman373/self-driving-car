class Controls {

    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch (type) {
            case "KEYS":
                // keyboard key listeners for player 
                this.#addKeyboardListeners();
                break;
            case "NPC":
                this.forward = true;
                break;
        }

        // if (type == "NPC") {
        //     this.#startRandomNPCBehavior();
        // }
    }

    #startRandomNPCBehavior() {
        const states = [
            { forward: true },
            { forward: true, left: true },
            { forward: true, right: true },
        ];

        const pickNewAction = () => {
            const state = states[Math.floor(Math.random() * states.length)];

            // Reset current state
            this.forward = false;
            this.reverse = false;
            this.left = false;
            this.right = false;

            // Apply new state
            this.forward = !!state.forward;
            this.left = !!state.left;
            this.right = !!state.right;

            console.log("NPC Action:", state);

            // Pick next action in 2–4 seconds
            const delay = 100 + Math.random() * 100;
            setTimeout(pickNewAction, delay);
        };

        pickNewAction();
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