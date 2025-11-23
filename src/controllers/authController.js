const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user (profile setup will be completed later)
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          fullName: name,
          displayName: name.split(' ')[0], // Default display name
          profileImage: picture,
          homeClub: 'Not Set', // Default values
          district: 'Not Set',
          isVerified: false, // Need to verify Leo membership
        }
      });
    }

    // Generate JWT token
    const authToken = generateToken(user.id);

    res.status(200).json({
      success: true,
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        displayName: user.displayName,
        profileImage: user.profileImage,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
};

exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, displayName, homeClub, district, leoId } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        displayName,
        homeClub,
        district,
        leoId,
        isVerified: true, // Assuming manual verification for now
      }
    });

    res.status(200).json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: 'Profile update failed' 
    });
  }
};