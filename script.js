const Resources = (function (loader, global) {
  if (global.document) {
    return (...resources) => new loader(resources);
  }
})(function (resourceURLs, counter = 0) {
  const allowed_pattern = new RegExp(`[.]*.(jpg|png|jpeg|webp|gif)$`);
  const callbacks = new Set();
  const resources = new Set();

  const verifyResources = () => {
    for (const resource of resourceURLs) {
      if (allowed_pattern.test(resource)) {
        console.log(`Loading resource [${resource}]`);
        resources.add(resource);
        continue;
      }

      console.warn(`Resource [${resource}] didn't satisfy allowed pattern!`);
    }
  };

  const execCallbacks = () => {
    for (const callback of callbacks) {
      callback.call(this, resources, counter);
    }
  };

  /**
   * Public function to register load event
   * @param {Function} fn
   * @returns {this}
   */
  this.onLoad = function (fn) {
    if (typeof fn !== "function") {
      throw new Error(
        `Callback is expected to be a function type. Type: [${typeof fn}] found instead!`
      );
    }

    callbacks.add(fn);

    return this;
  };

  verifyResources();

  for (const resource of resources) {
    const image = new Image();
    image.src = resource;
    image.onload = () => {
      counter++;
      execCallbacks();
      console.log(`Resource [${resource}] loaded!`);
    };
    image.onerror = () => {
      counter++;
      execCallbacks();
      console.warn(`Resource [${resource}] was not able to load!`);
    };
  }
}, window);
