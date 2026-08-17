const jwt = require('jsonwebtoken');
const http = require('http');

const token = jwt.sign({ id: 1, email: 'admin@aula.sg' }, 'aula_super_secure_jwt_secret_2026', { expiresIn: '24h' });

const data = JSON.stringify({
  title: "Test Title",
  subtitle: "Test Subtitle",
  ctaText: "Test CTA",
  ctaLink: "modal",
  mediaType: "video",
  mediaUrl: "http://localhost:5000/uploads/test.mp4",
  trustRate: "100%",
  trustLabel: "Compliance",
  status: "Active"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/hero-banners/2',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer ' + token
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
