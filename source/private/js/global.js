/* https://www.cssscript.com/animated-svg-loading-spinner/ */

const click_block = {
    container: null,
    body: null,
    cssClass: 'click_block',
    check: function () {
        if (this.body == null) {
            this.body = document.getElementsByTagName('body')[0];
        }
    },
    open: function () {
        this.check();
        if (!this.isOpen()) {
            this.container = document.createElement('div');
            this.container.setAttribute('id', 'click_block');
            this.body.append(this.container);
            this.body.classList.add(this.cssClass);
        }
        return this;
    },
    close: function () {
        this.check();
        if (this.isOpen()) {
            this.body.classList.remove(this.cssClass);
            this.container.remove();
        }
        return this;
    },
    isOpen: function () {
        this.check();
        return this.body.classList.contains(this.cssClass);
    }
};

const loading_animation = {
    container: document.getElementById("loading"),
    on: function () {
        this.container.style.opacity = "1";
    },
    off: function () {
        this.container.style.opacity = "0";
    }
};
