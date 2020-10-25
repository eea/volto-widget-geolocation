export const getFilteredResults = (results = [], formData) => {
  const { countries = '' } = formData;

  return results.filter((item) => item?.countryName === countries);
};
