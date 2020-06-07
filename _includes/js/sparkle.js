const DEFAULT_OPTIONS = {
  className: ".js-sparkle",
  particles: 6,
  animationDuration: "infinite",
};

class Sparkle {
  static start(options = {}) {
    const instance = new Sparkle(options);

    instance.targets.forEach((target) => {
      instance.pushParticles(target);
    });

    return instance;
  }

  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.targets = document.querySelectorAll(this.options.className);
  }

  pushParticles(target) {
    for (let i = 0; i < this.options.particles; i++) {
      this.generate(target);
    }
  }

  generate(target) {
    const delay = Math.random() + "s";
    const el = document.createElement("div");

    el.textContent = "✨";
    el.className = "sparkle__particle";
    el.style.zIndex = 1;
    el.style.top = this._random() + "%";
    el.style.left = this._random() + "%";
    el.style.animationDelay = delay;
    el.style.animationDuration = this.options.animationDuration;

    target.appendChild(el);

    el.addEventListener("animationend", () => el.remove());
  }

  _random() {
    return Math.random() * 80;
  }
}
