const jwt = require('jsonwebtoken');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || 'talk2any_super_secret_access_key_2026_x98z',
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'talk2any_super_secret_refresh_key_2026_y98z',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const { accessToken, refreshToken } = generateTokens(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  const userSanitized = user.toObject ? user.toObject() : { ...user };
  delete userSanitized.password;
  delete userSanitized.verificationToken;
  delete userSanitized.resetPasswordToken;

  res.status(statusCode).json({
    success: true,
    message,
    token: accessToken,
    refreshToken,
    user: userSanitized,
  });
};

module.exports = {
  generateTokens,
  sendTokenResponse,
};
