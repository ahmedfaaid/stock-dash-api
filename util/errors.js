const handleSignupErrors = (err) => {
  let errors = { firstName: "", lastName: "", email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "That email address is already registered";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

exports.handleSignupErrors = handleSignupErrors;
