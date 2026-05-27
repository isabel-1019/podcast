class FlutterJS {
  async loadEntrypoint(options) {
    const { entrypointUrl = "main.dart.js", onEntrypointLoaded } = options || {};
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = entrypointUrl;
      script.defer = true;
      script.addEventListener("load", () => {
        if (onEntrypointLoaded) {
          onEntrypointLoaded(resolve);
        } else {
          resolve();
        }
      });
      document.body.appendChild(script);
    });
  }
}
window._flutter = { loader: new FlutterJS() };
