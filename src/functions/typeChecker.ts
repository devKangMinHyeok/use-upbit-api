export const typeChecker = (type: string) => {
  try {
    let isValid = true;
    if (type != 'ticker' && type != 'orderbook' && type != 'trade') {
      isValid = false;
    }
    return isValid;
  } catch (error) {
    console.error(error);
  }
};

export default typeChecker;
