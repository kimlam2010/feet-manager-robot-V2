export const isEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  // Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export const isPhoneNumber = (phone: string): boolean => {
  // Số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
  const re = /^0\d{9}$/;
  return re.test(phone);
}; 