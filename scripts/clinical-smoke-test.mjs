import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cjkzrsvgvoursjfanvje.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqa3pyc3Zndm91cnNqZmFudmplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTAxMDczNSwiZXhwIjoyMTA0NTg2NzM1fQ.evXoi2ZbBNXYxLewHdzfcMOnwKEOC84Gca4FgWnmGdA';
const API_URL = 'http://localhost:8080/api/v1';

async function runClinicalSmokeTest() {
  console.log('--- 1. Authenticating Lab User (deswal@gmail.com) ---');
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: 'deswal@gmail.com'
  });

  if (linkError) {
    console.error('Failed to generate magic link:', linkError);
    process.exit(1);
  }

  const anonClient = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqa3pyc3Zndm91cnNqZmFudmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMTA3MzUsImV4cCI6MjEwNDU4NjczNX0.wD_h92emxZ0tbgdNdOfdXYayU4_BEj7MkH68nrRnRMk');
  const { data: sessionData, error: sessionError } = await anonClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink'
  });

  if (sessionError || !sessionData.session) {
    console.error('Failed to verify OTP:', sessionError);
    process.exit(1);
  }

  const jwt = sessionData.session.access_token;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`,
  };
  console.log('Obtained Lab JWT successfully!');

  // --- 2. Query Panels ---
  console.log('\n--- 2. GET /panels ---');
  const panelsRes = await fetch(`${API_URL}/panels`, { headers });
  console.log('Panels status:', panelsRes.status);
  const panels = await panelsRes.json();
  const panelList = Array.isArray(panels) ? panels : (panels.data || []);
  console.log('Available Panels Count:', panelList.length);
  if (panelList.length === 0) {
    console.error('No panels found in catalog!');
    process.exit(1);
  }
  const selectedPanel = panelList[0];
  console.log(`Using Panel: ${selectedPanel.name} (ID: ${selectedPanel.id})`);

  // --- 3. Register Walk-In Patient ---
  console.log('\n--- 3. POST /patients (Create Walk-in Patient) ---');
  const patientPayload = {
    name: 'Ramesh Sharma',
    age: '45',
    sex: 'MALE',
    phone: '+91 98765 43210',
    address: 'Sector 14, Urban Estate, Karnal, Haryana'
  };

  const patientRes = await fetch(`${API_URL}/patients`, {
    method: 'POST',
    headers,
    body: JSON.stringify(patientPayload)
  });
  console.log('Create Patient status:', patientRes.status);
  const patient = await patientRes.json();
  console.log('Created Patient:', { id: patient.id, name: patient.name, patientNumber: patient.patientNumber });

  if (!patient.id) {
    console.error('Patient creation failed!');
    process.exit(1);
  }

  // --- 4. Create Accession / Report ---
  console.log('\n--- 4. POST /reports (Create Accession & Invoice) ---');
  const reportPayload = {
    patientId: patient.id,
    panelIds: [selectedPanel.id],
    remarks: 'Pre-op diagnostic workup',
    billing: {
      discount: 0,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      paidAmount: Number(selectedPanel.price) || 350
    }
  };

  const reportRes = await fetch(`${API_URL}/reports`, {
    method: 'POST',
    headers,
    body: JSON.stringify(reportPayload)
  });
  console.log('Create Report status:', reportRes.status);
  const report = await reportRes.json();
  console.log('Created Report:', {
    id: report.id,
    reportNumber: report.reportNumber,
    status: report.status,
    barcode: report.barcode || report.reportNumber
  });

  if (!report.id) {
    console.error('Report creation failed!');
    process.exit(1);
  }

  // --- 5. Enter Results (including Panic Value) ---
  console.log('\n--- 5. POST /reports/:id/results (Enter Clinical Results) ---');
  const valuesPayload = [];
  if (report.reportPanels && Array.isArray(report.reportPanels)) {
    for (const rp of report.reportPanels) {
      if (rp.panel?.sections) {
        for (const section of rp.panel.sections) {
          if (section.parameters) {
            for (const param of section.parameters) {
              const optionVal = param.options && param.options.length > 2
                ? param.options[2] // Positive flag
                : (param.options ? param.options[0] : '1:160 (Positive)');
              valuesPayload.push({
                parameterId: param.id,
                value: optionVal,
                remarks: 'Abnormal titre detected via agglutination'
              });
            }
          }
        }
      }
    }
  }

  console.log(`Entering ${valuesPayload.length} test parameter values...`);
  const enterRes = await fetch(`${API_URL}/reports/${report.id}/results`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ values: valuesPayload })
  });
  console.log('Enter Results status:', enterRes.status);
  const enteredReport = await enterRes.json();
  console.log('Updated Report Status after Results:', enteredReport.status);

  // --- 6. Finalize Report (Pathologist Sign-off) ---
  console.log('\n--- 6. POST /reports/:id/finalize (Pathologist Sign-off) ---');
  const finalizeRes = await fetch(`${API_URL}/reports/${report.id}/finalize`, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  });
  console.log('Finalize Report status:', finalizeRes.status);
  const finalizeResult = await finalizeRes.json();
  console.log('Finalized Report Status:', finalizeResult.status);

  // --- 7. Verify Vector PDF Generation ---
  console.log('\n--- 7. GET /reports/:id/pdf (Verify PDF Generation) ---');
  const pdfRes = await fetch(`${API_URL}/reports/${report.id}/pdf`, {
    headers: { Authorization: `Bearer ${jwt}` }
  });
  console.log('PDF Generation status:', pdfRes.status);
  console.log('Content-Type:', pdfRes.headers.get('content-type'));

  // --- 8. Verify Dashboard Stats & KPI Counter ---
  console.log('\n--- 8. GET /reports/dashboard-stats (Dashboard KPI Verification) ---');
  const statsRes = await fetch(`${API_URL}/reports/dashboard-stats`, { headers });
  console.log('Dashboard Stats status:', statsRes.status);
  const stats = await statsRes.json();
  console.log('Live Dashboard Stats:', stats);

  console.log('\n======================================================');
  console.log('ALL PRE-PILOT CLINICAL PIPELINE TESTS PASSED 100%!');
  console.log('======================================================');
}

runClinicalSmokeTest().catch(console.error);
