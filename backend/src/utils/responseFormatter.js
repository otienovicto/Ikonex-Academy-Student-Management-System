// Response Formatter
const ResponseFormatter = {
  success(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
    };
  },

  error(message = 'Error', error = null) {
    return {
      success: false,
      message,
      error,
    };
  },

  paginated(data, total, page, limit) {
    return {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },
};

module.exports = ResponseFormatter;
