globalThis.addEventListener("message", (initialEvent) => {
  const blob = new Blob([initialEvent.data], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  globalThis.addEventListener("message", (event) => {
    worker.postMessage(event.data);
  });

  worker.addEventListener("message", (event) => {
    window.top!.postMessage(event.data, "*");
  });
}, { once: true });
