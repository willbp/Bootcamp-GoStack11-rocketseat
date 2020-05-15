const formatDate = (date: Date): string => {
  const parsedDate = new Date(date.toString());
  const year = parsedDate.getFullYear();
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
  const day = parsedDate.getDate().toString().padStart(2, '0');

  return [day, month, year].join('/');
};

export default formatDate;
