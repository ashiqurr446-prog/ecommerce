// testRegistrationLogin.js - Test registration and login flow
const http = require('http');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function test() {
  try {
    console.log('\n=== Testing Registration & Login ===\n');

    // Test 1: Register a new seller
    console.log('1️⃣ Registering new seller...');
    let res = await makeRequest('POST', '/api/users/register', {
      username: 'newseller',
      email: 'newseller@test.com',
      password: 'password123',
      role: 'seller'
    });
    console.log('Status:', res.status);
    console.log('Response:', res.data);

    if (res.status !== 201) {
      console.error('❌ Registration failed');
      return;
    }

    // Test 2: Login with new seller account
    console.log('\n2️⃣ Logging in with new seller...');
    res = await makeRequest('POST', '/api/users/login', {
      email: 'newseller@test.com',
      password: 'password123'
    });
    console.log('Status:', res.status);
    console.log('Response:', res.data);

    if (res.status !== 200) {
      console.error('❌ Login failed');
      return;
    }

    console.log('\n✅ Seller registration & login successful!');

    // Test 3: Register a new buyer
    console.log('\n3️⃣ Registering new buyer...');
    res = await makeRequest('POST', '/api/users/register', {
      username: 'newbuyer',
      email: 'newbuyer@test.com',
      password: 'password123',
      role: 'buyer'
    });
    console.log('Status:', res.status);
    console.log('Response:', res.data);

    if (res.status !== 201) {
      console.error('❌ Buyer registration failed');
      return;
    }

    // Test 4: Login with new buyer account
    console.log('\n4️⃣ Logging in with new buyer...');
    res = await makeRequest('POST', '/api/users/login', {
      email: 'newbuyer@test.com',
      password: 'password123'
    });
    console.log('Status:', res.status);
    console.log('Response:', res.data);

    if (res.status === 200) {
      console.log('\n✅ Both seller and buyer registration & login work!');
    }

  } catch (err) {
    console.error('❌ Test error:', err.message);
  }
}

test();
