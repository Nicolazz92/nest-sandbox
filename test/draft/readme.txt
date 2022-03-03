В консоли
sudo nginx -s stop && sudo nginx

В браузере
http://localhost:8080/?useIframe=1

В консоли браузера
window.postMessage({ event: "initIframeDrawIoParams", params: {}})