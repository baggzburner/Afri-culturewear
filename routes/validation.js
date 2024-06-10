function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
}

module.exports = { isValidEmail, isValidPassword };
