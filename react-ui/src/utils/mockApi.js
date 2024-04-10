export const mockApi = (success, resolveData, timeout = 1000) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (success) {
      resolve(resolveData);
    } else {
      reject({ message: 'Error' });
    }
  }, timeout);
});
