const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendTokenResponse, generateTokens } = require('../utils/generateTokens');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate unique permanent 6-digit User Tag ID (e.g. ID-849201)
const generateUniqueTagId = async () => {
  let tagId;
  let exists = true;
  while (exists) {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    tagId = `ID-${random6}`;
    const found = await User.findOne({ tagId });
    if (!found) exists = false;
  }
  return tagId;
};

// Register User (Disabled - Google Sign-In only)
exports.register = catchAsync(async (req, res, next) => {
  return next(new AppError('Direct registration is disabled. Please sign in with Google.', 403));
});

// Google Sign-In
exports.googleLogin = catchAsync(async (req, res, next) => {
  const { credential, token, email: mockEmail, name: mockName, picture: mockPicture, sub: mockSub } = req.body;
  const idToken = credential || token;

  let email, name, picture, sub;

  if (idToken) {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (clientId) {
        const client = new OAuth2Client(clientId);
        const ticket = await client.verifyIdToken({
          idToken,
          audience: clientId,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
        sub = payload.sub;
      } else {
        const decoded = jwt.decode(idToken);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name;
          picture = decoded.picture;
          sub = decoded.sub;
        }
      }
    } catch (err) {
      console.warn('Google ID token verification warning:', err.message);
      try {
        const decoded = jwt.decode(idToken);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name;
          picture = decoded.picture;
          sub = decoded.sub;
        }
      } catch (e) {
        console.warn('Google ID token fallback decode error:', e.message);
      }
    }
  }

  // Fallback if provided directly
  email = email || mockEmail;
  name = name || mockName;
  picture = picture || mockPicture;
  sub = sub || mockSub || `google_${Date.now()}`;

  if (!email) {
    return next(new AppError('Google authentication failed: Email address is required', 400));
  }

  // Derive username from email address (the part before @)
  let cleanUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
  if (cleanUsername.length < 3) {
    cleanUsername = `user_${cleanUsername || Math.floor(100 + Math.random() * 900)}`;
  }
  if (cleanUsername.length > 25) {
    cleanUsername = cleanUsername.slice(0, 25);
  }

  let user = await User.findOne({
    $or: [{ googleId: sub }, { email: email.toLowerCase() }],
  });

  if (!user) {
    let usernameCandidate = cleanUsername;
    let counter = 1;
    while (await User.findOne({ username: usernameCandidate })) {
      usernameCandidate = `${cleanUsername}${counter}`;
      counter++;
    }

    const newTagId = await generateUniqueTagId();

    user = await User.create({
      username: usernameCandidate,
      email: email.toLowerCase(),
      googleId: sub,
      tagId: newTagId,
      avatar: picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(usernameCandidate)}`,
      isVerified: true,
      status: 'online',
      country: 'Global',
      languages: { spoken: ['English'], learning: [] },
      achievements: [
        {
          title: 'Pioneer',
          description: 'Joined Talk2Any platform via Google',
          icon: '🚀',
        },
      ],
    });
  } else {
    if (!user.googleId) {
      user.googleId = sub;
    }
    if (!user.tagId) {
      user.tagId = await generateUniqueTagId();
    }
    if (picture) {
      user.avatar = picture;
    }
    user.status = 'online';
    await user.save({ validateBeforeSave: false });
  }

  sendTokenResponse(user, 200, res, 'Google Sign-In successful');
});

// Login User
exports.login = catchAsync(async (req, res, next) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return next(new AppError('Please provide email/username and password', 400));
  }

  const user = await User.findOne({
    $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }],
  }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect credentials', 401));
  }

  if (user.isBanned) {
    return next(new AppError(`Your account is banned: ${user.banReason || 'Policy violation'}`, 403));
  }

  user.status = 'online';
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
});

// Logout User
exports.logout = catchAsync(async (req, res, next) => {
  if (req.user) {
    req.user.status = 'offline';
    await req.user.save({ validateBeforeSave: false });
  }

  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Refresh Token
exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return next(new AppError('Refresh token required', 401));
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'talk2any_super_secret_refresh_key_2026_y98z'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    const tokens = generateTokens(user._id);

    res.status(200).json({
      success: true,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }
});

// Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Password reset token generated successfully (Mock email sent)',
    resetToken,
    resetUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`,
  });
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successfully');
});

// Verify Email Token
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Verification token is invalid or expired', 400));
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully!',
  });
});

const { sendEmailOtp } = require('../services/emailService');

// Send 6-Digit OTP Verification Code to Logged-in User's Email
exports.sendVerificationOtp = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User not found', 404));

  // Generate 6-digit random code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.emailVerificationOtp = otpCode;
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  await user.save({ validateBeforeSave: false });

  // Send Email OTP
  await sendEmailOtp(user.email, otpCode);

  res.status(200).json({
    success: true,
    message: `6-digit verification code sent to ${user.email}`,
    email: user.email,
    // Return OTP code in development for easy testing
    devOtp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
  });
});

// Verify 6-Digit OTP Code
exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  if (!otp || otp.toString().trim().length !== 6) {
    return next(new AppError('Please enter a valid 6-digit verification code', 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User not found', 404));

  if (!user.emailVerificationOtp || !user.otpExpiresAt) {
    return next(new AppError('No verification code requested. Please click "Send Verification Code".', 400));
  }

  if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
    return next(new AppError('Verification code has expired. Please request a new 6-digit code.', 400));
  }

  if (user.emailVerificationOtp !== otp.toString().trim()) {
    return next(new AppError('Incorrect 6-digit verification code. Please check your email and try again.', 400));
  }

  user.isVerified = true;
  user.emailVerificationOtp = undefined;
  user.otpExpiresAt = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Congratulations! Email ${user.email} has been verified successfully. Full call room access unlocked!`,
    user,
  });
});

// Get Current User
exports.getMe = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user.id)
    .populate('followers', 'username avatar tagId')
    .populate('following', 'username avatar tagId');

  if (user && !user.tagId) {
    user.tagId = await generateUniqueTagId();
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    success: true,
    user,
  });
});
