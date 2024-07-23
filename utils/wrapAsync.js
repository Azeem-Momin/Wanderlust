module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}
// this is more compact way to write try-catch block