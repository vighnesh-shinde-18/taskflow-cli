class ApiError extends Error {
    constructor(
        statusCode,
        message = "Internel Server error",
        errors = []
    ) {

        super(message)
        this.statusCode = statusCode
        this.data = null;
        this.message = message
        this.success = false
        this.errors = errors

    }
}

export default ApiError