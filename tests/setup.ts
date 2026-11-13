// jsdom does not implement scrolling; the app calls it on screen change.
window.scrollTo = () => {};
