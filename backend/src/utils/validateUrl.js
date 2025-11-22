const validator = require('validator')

module.exports = function validateUrl(url) {
    // Accept normal URLs
    const isHttp = validator.isURL(url, { require_protocol: true })

    // Accept data:image/... base64 URLs
    const isData = url.startsWith('data:') && url.includes('base64,')

    return isHttp || isData
}
