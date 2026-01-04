// server/testRequests.js
// Automated smoke tests: register seller & buyer, login, create product, create order
const base = 'http://localhost:5000';

async function req(path, opts = {}) {
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

async function main() {
  try {
    console.log('1) Registering seller...');
    let r = await req('/api/users/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'test_seller', email: 'test_seller@example.com', password: 'pass123', role: 'seller' })
    });
    console.log('Register seller:', r.status, r.body);

    console.log('2) Login seller...');
    r = await req('/api/users/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test_seller@example.com', password: 'pass123' })
    });
    console.log('Login seller:', r.status, r.body);
    const sellerToken = r.body && r.body.token;
    if (!sellerToken) throw new Error('Seller login failed');

    console.log('3) Create product as seller...');
    r = await req('/api/products', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + sellerToken },
      body: JSON.stringify({ name: 'SmokeTest Product', category: 'Testing', price: 9.99, description: 'Created by automated test', stock: 10 })
    });
    console.log('Create product:', r.status, r.body);
    const productId = r.body && r.body.product && r.body.product._id;

    console.log('4) Register buyer...');
    r = await req('/api/users/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'test_buyer', email: 'test_buyer@example.com', password: 'pass123', role: 'buyer' })
    });
    console.log('Register buyer:', r.status, r.body);

    console.log('5) Login buyer...');
    r = await req('/api/users/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test_buyer@example.com', password: 'pass123' })
    });
    console.log('Login buyer:', r.status, r.body);
    const buyerToken = r.body && r.body.token;
    if (!buyerToken) throw new Error('Buyer login failed');

    console.log('6) Create order as buyer...');
    const orderPayload = {
      products: [ { productId: productId || null, quantity: 1 } ],
      customerName: 'Test Buyer',
      email: 'test_buyer@example.com',
      phone: '1234567890',
      address: '123 Test St'
    };
    r = await req('/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + buyerToken },
      body: JSON.stringify(orderPayload)
    });
    console.log('Create order:', r.status, r.body);

    console.log('Smoke tests completed');
  } catch (err) {
    console.error('Smoke test error:', err);
  }
}

main();
