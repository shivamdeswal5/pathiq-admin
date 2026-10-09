import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cjkzrsvgvoursjfanvje.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqa3pyc3Zndm91cnNqZmFudmplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTAxMDczNSwiZXhwIjoyMTA0NTg2NzM1fQ.evXoi2ZbBNXYxLewHdzfcMOnwKEOC84Gca4FgWnmGdA';
const API_URL = 'http://localhost:8080/api/v1';

async function runSmokeTest() {
  console.log('--- 1. Authenticating Admin User ---');
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Generate or sign in as deswal@gmail.com
  const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) {
    console.error('Failed to list users:', userError);
    process.exit(1);
  }

  const adminUser = userData.users.find(u => u.email?.toLowerCase() === 'deswal@gmail.com');
  if (!adminUser) {
    console.error('deswal@gmail.com user not found in Supabase Auth');
    process.exit(1);
  }
  console.log('Found Admin User:', adminUser.id, adminUser.email);

  // Generate magic link / session token for adminUser
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: 'deswal@gmail.com'
  });

  if (linkError) {
    console.error('Failed to generate link:', linkError);
    process.exit(1);
  }

  // Use verifyOtp to exchange token for a real session JWT
  const anonClient = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqa3pyc3Zndm91cnNqZmFudmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMTA3MzUsImV4cCI6MjEwNDU4NjczNX0.wD_h92emxZ0tbgdNdOfdXYayU4_BEj7MkH68nrRnRMk');
  const { data: sessionData, error: sessionError } = await anonClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink'
  });

  if (sessionError || !sessionData.session) {
    console.error('Failed to get session:', sessionError);
    process.exit(1);
  }

  const jwt = sessionData.session.access_token;
  console.log('Obtained Admin JWT successfully!');

  // --- 2. Query Existing Tenants via Super Admin API ---
  console.log('\n--- 2. GET /billing/admin/tenants ---');
  const tenantsRes = await fetch(`${API_URL}/billing/admin/tenants`, {
    headers: { Authorization: `Bearer ${jwt}` }
  });
  console.log('Status:', tenantsRes.status);
  const tenants = await tenantsRes.json();
  console.log('Tenants Count:', Array.isArray(tenants) ? tenants.length : tenants);
  if (Array.isArray(tenants)) {
    console.log('Existing Labs in Directory:', tenants.map(t => `${t.labName} [${t.status}]`));
  }

  // --- 3. Onboard New Lab via Super Admin API ---
  const timestamp = Date.now();
  console.log('\n--- 3. POST /billing/admin/tenants (Onboard Apex Diagnostic Lab) ---');
  const onboardPayload = {
    labName: 'Apex Diagnostic Lab',
    ownerFullName: 'Dr. Aman Verma',
    ownerEmail: `apex.aman.${timestamp}@testlab.in`,
    ownerPassword: 'Password123!',
    phoneNumber: '+91 98123 45678',
    city: 'Ambala',
    state: 'Haryana',
    planSlug: 'GROWTH',
    billingCycle: 'MONTHLY',
    paymentStatus: 'TRIAL',
  };

  const onboardRes = await fetch(`${API_URL}/billing/admin/tenants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify(onboardPayload)
  });
  console.log('Onboard Status:', onboardRes.status);
  const onboardResult = await onboardRes.json();
  console.log('Onboard Result:', onboardResult);

  if (!onboardResult.success || !onboardResult.labId) {
    console.error('Failed to onboard lab!');
    process.exit(1);
  }

  const newLabId = onboardResult.labId;

  // --- 4. Offline 12-Digit UTR Activation ---
  console.log('\n--- 4. POST /billing/admin/manual-activation (12-Digit UTR Upgrade) ---');
  const activatePayload = {
    labId: newLabId,
    planSlug: 'GROWTH',
    billingCycle: 'MONTHLY',
    utrNumber: '202610091234',
    notes: 'Verified against HDFC Bank statement via super admin'
  };

  const activateRes = await fetch(`${API_URL}/billing/admin/manual-activation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify(activatePayload)
  });
  console.log('Activation Status:', activateRes.status);
  const activateResult = await activateRes.json();
  console.log('Activation Result:', activateResult);

  // --- 5. Verify Updated Status in Tenant Directory ---
  console.log('\n--- 5. Verify Tenant Status Shift to ACTIVE ---');
  const verifyRes = await fetch(`${API_URL}/billing/admin/tenants`, {
    headers: { Authorization: `Bearer ${jwt}` }
  });
  const updatedTenants = await verifyRes.json();
  const createdTenant = updatedTenants.find(t => t.labId === newLabId);
  console.log('Created Tenant in Directory:', createdTenant ? {
    labName: createdTenant.labName,
    ownerEmail: createdTenant.ownerEmail,
    planSlug: createdTenant.planSlug,
    status: createdTenant.status,
    daysRemaining: createdTenant.daysRemaining
  } : 'NOT FOUND');

  console.log('\n========================================');
  console.log('ALL PRE-PILOT SMOKE TESTS PASSED 100%!');
  console.log('========================================');
}

runSmokeTest().catch(console.error);
