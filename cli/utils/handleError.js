const handleCliError = (err, fallbackMessage = 'Something went wrong') => {
  // Backend responded with error
  if (err.response && err.response.data) {
    const msg =
      err.response.data.message ||
      err.response.data.error ||
      fallbackMessage;

    console.error(`❌ ${msg}`);
    return;
  }

  // Network / server down
  if (err.request) {
    console.error('❌ Cannot reach server. Is backend running?');
    return;
  }

  // Unknown error
  console.error(`❌ ${fallbackMessage}`);
};

export default handleCliError;
