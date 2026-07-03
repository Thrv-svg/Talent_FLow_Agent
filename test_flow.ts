import axios from 'axios';

async function testFlow() {
  try {
    const api = axios.create({ baseURL: 'http://localhost:3000' });
    
    // Test login hr
    const loginRes = await api.post('/api/login', { email: 'hr@dummy.com', password: 'hr123' });
    console.log('Login HR:', loginRes.data.success);
    
    const token = loginRes.data.token;
    
    // Test fetch candidates
    const adminRes = await api.get('/api/admin/candidates', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Candidates length:', adminRes.data.candidates.length);
    
  } catch (err: any) {
    console.error('Flow failed:', err.response?.status, err.response?.data, err.message);
  }
}
testFlow();
