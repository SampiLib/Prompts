import "./login.scss"
import { Codes, Prompt, promptsNameStart, promptsWindowLayer, PromptBaseOptions, createPromptWindow, PromptReturnBase } from "./common";
import { remToPx } from "../ui/common";
import { inputBox, InputBoxOptions, InputBoxTypes } from "../components/inputBox";
import { button } from "../components/button";

/**Defines the return object for a prompt
 * @typedef {Object} PromptLoginReturnInternal
 * @property {string} password password entered
 * @property {string} username username entered
 * @typedef {PromptReturnBase & PromptLoginReturnInternal} PromptLoginReturn*/

/**Defines input prompt options
 * @typedef {Object} PromptLoginBaseOptions
 * @property {string} [usertext] text added above username input box
 * @property {string} [passtext] text added above password input box
 * @property {InputBoxOptions} input the options to pass to the inputbox
 * Defines input prompt options
 * @typedef {PromptBaseOptions & PromptLoginBaseOptions} PromptLoginOptions*/

class Login extends Prompt {
    /**Webcomponent name of prompt
     * @returns {string}*/
    static get elementName() { return promptsNameStart + 'login'; }

    /**Options toggeler
     * @param {PromptLoginOptions} options*/
    options(options) {
        super.options(options);
        this.username = this.appendChild(inputBox({
            text: options.usertext || 'Username',
            value: '',
            type: InputBoxTypes.TEXT
        }));
        this.password = this.appendChild(inputBox({
            text: options.passtext || 'Password',
            value: '',
            type: InputBoxTypes.PASSWORD
        }));
        this.__button = this.appendChild(button({
            text: options.buttonText || 'Login',
            click: () => {
                this.___finish(Codes.ENTER, { password: this.password.value, username: this.username.value });
            }
        }));
    }

    /**Creates an instance of the input prompt
     * @param {PromptLoginOptions} options
     * @returns {Login}*/
    static create(options) {
        if (!options) { console.warn('Parameter must be passed'); return; }
        //Parent is determined must lead to a window manager
        let prom = createPromptWindow(options, Login, { height: 'content', parent, width: remToPx(20), sizeable: false, moveable: false, modal: true, layer: promptsWindowLayer });
        return prom;
    }

    /**This changes the text over the username box
     * @param {string} text*/
    set usertext(text) {
        this.username.text = text;
    }

    /**This changes the text over the password box
     * @param {string} text*/
    set passtext(text) {
        this.password.text = text;
    }

    /**This changes the text of the confirmation button
     * @param {string} text*/
    set buttonText(text) {
        if (typeof text == 'string') {
            this.__button.text = text;
        }
    }

    /**Method handeling key events for prompt
     * @param {KeyboardEvent}
     * @protected */
    __keyboard(e) {
        if (e.key == 'Escape') {
            this.___finish(Codes.CLOSED);
        } else if (e.key == 'Enter') {
            this.___finish(Codes.ENTER, { password: this.password.value, username: this.username.value });
        } else if (!e.path.includes(this.password)) {
            this.username.focus();
        }
    }

    /**Returns a promise for the return from the prompt
     * @returns {Promise<PromptLoginReturn>} */
    get promise() {
        return super.promise;
    }

    focus() {
        this.username.focus();
    }
}
customElements.define(Login.elementName, Login);
export let login = Login.create;