function isOnline() {
    return new Promise((resolve) => {
        if (!navigator.onLine) return resolve(false);

        
        fetch('https://www.google.com/favicon.ico', { method: 'HEAD', mode: 'no-cors' })
            .then(() => resolve(true))
            .catch(() => resolve(false));
    });
}

module.exports = { isOnline };