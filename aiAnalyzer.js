exports.checkProxySpeed = function(speed) {
    if (speed < 200) return 9.5; // Super cepat
    if (speed < 500) return 8.0; // Cepat
    if (speed < 1000) return 6.0; // Lumayan
    return 3.0; // Lambat
};
