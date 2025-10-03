const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Потрібна авторизація' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role, email }
    next();
  } catch {
    return res.status(401).json({ message: 'Невірний токен' });
  }
};

exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Потрібна авторизація' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Немає прав' });
  next();
};
