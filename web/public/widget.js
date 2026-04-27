(function() {
  'use strict';

  const scriptTag = document.currentScript || document.querySelector('script[data-widget-key]');
  const widgetKey = scriptTag ? scriptTag.getAttribute('data-widget-key') : null;

  if (!widgetKey) {
    console.error('[maagic] Missing data-widget-key attribute on script tag.');
    return;
  }

  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'maagic-chat-widget';
  widgetContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999;';
  document.body.appendChild(widgetContainer);

  // Create iframe for the chat widget
  const iframe = document.createElement('iframe');
  const baseUrl = scriptTag ? new URL(scriptTag.src).origin : window.location.origin;
  iframe.src = baseUrl + '/widget/' + widgetKey;
  iframe.style.cssText = 'width: 400px; height: 600px; border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: none;';
  iframe.id = 'maagic-chat-iframe';
  widgetContainer.appendChild(iframe);

  // Create floating button
  const button = document.createElement('button');
  button.innerHTML = '💬';
  button.style.cssText = 'width: 60px; height: 60px; border-radius: 50%; background: #3b82f6; color: white; border: none; cursor: pointer; font-size: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s;';
  button.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
  button.onmouseout = function() { this.style.transform = 'scale(1)'; };

  let isOpen = false;
  button.onclick = function() {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.style.display = 'block';
      button.style.display = 'none';
    } else {
      iframe.style.display = 'none';
      button.style.display = 'block';
    }
  };

  // Close button inside iframe area
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '✕';
  closeButton.style.cssText = 'position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-radius: 50%; background: rgba(0,0,0,0.5); color: white; border: none; cursor: pointer; font-size: 18px; display: none; z-index: 10000;';
  closeButton.onclick = function() {
    isOpen = false;
    iframe.style.display = 'none';
    button.style.display = 'block';
    closeButton.style.display = 'none';
  };
  widgetContainer.appendChild(closeButton);

  // Show close button when iframe is visible
  const observer = new MutationObserver(function() {
    if (iframe.style.display === 'block') {
      closeButton.style.display = 'block';
    } else {
      closeButton.style.display = 'none';
    }
  });
  observer.observe(iframe, { attributes: true, attributeFilter: ['style'] });

  widgetContainer.appendChild(button);

  // Listen for messages from iframe to close
  window.addEventListener('message', function(event) {
    if (event.data === 'maagic-close-widget') {
      isOpen = false;
      iframe.style.display = 'none';
      button.style.display = 'block';
      closeButton.style.display = 'none';
    }
  });
})();
