export const formatPhoneNumber = (phoneNumber: string| null) => {
  if(!phoneNumber) return 
  const cleanedNumber = phoneNumber.replace(/\s|[-().]/g, '');


  return cleanedNumber;
};
