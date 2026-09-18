// ============================================================
// IT Service Management Platform — Comprehensive Mock Data
// ============================================================

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  IT_ADMIN: 'it_admin',
  TRAINEE: 'trainee',
  ZOOM_REQUESTER: 'zoom_requester',
};

export const USERS = [
  { id: 'U001', name: 'SuperAdmin', username: 'SuperAdmin', role: ROLES.SUPER_ADMIN, email: 'superadmin@mohe.gov.mv', division: 'IT Department', active: true, avatar: 'SA' },
  { id: 'U002', name: 'ITAdmin', username: 'ITAdmin', role: ROLES.IT_ADMIN, email: 'itadmin@mohe.gov.mv', division: 'IT Department', active: true, avatar: 'IA' },
  { id: 'U003', name: 'Sachin', username: 'Sachin', role: ROLES.TRAINEE, email: 'sachin@mohe.gov.mv', division: 'IT Department', active: true, avatar: 'SA' },
  { id: 'U004', name: 'Hirantha', username: 'Hirantha', role: ROLES.TRAINEE, email: 'hirantha@mohe.gov.mv', division: 'IT Department', active: true, avatar: 'HI' },
  { id: 'U005', name: 'Shalom', username: 'Shalom', role: ROLES.TRAINEE, email: 'shalom@mohe.gov.mv', division: 'IT Department', active: true, avatar: 'SH' },
  { id: 'U006', name: 'Savishka', username: 'Savishka', role: ROLES.TRAINEE, email: 'savishka@mohe.gov.mv', division: 'IT Department', active: true, avatar: 'SV' },
  { id: 'U007', name: 'ZoomRequester', username: 'ZoomRequester', role: ROLES.ZOOM_REQUESTER, email: 'zoomrequester@mohe.gov.mv', division: 'Academic Affairs Division', active: true, avatar: 'ZR' },
];

export const DIVISIONS = [
  'IT Department', 'Academic Affairs Division', 'Finance Division',
  'HR Division', 'Legal Division', 'Planning & Statistics Division',
  'Administration Division', 'Minister\'s Office', 'Quality Assurance Division',
];

// ============================================================
// ASSETS
// ============================================================
export const ASSETS = [
  { id: 'PC001', type: 'PC', tag: 'MOHE-PC-0001', serial: 'SN-DELL-001', brand: 'Dell', model: 'OptiPlex 7090', cpu: 'Intel Core i7-11700', ram: '16GB DDR4', storage: '512GB NVMe SSD', os: 'Windows 11 Pro', division: 'IT Department', officer: 'Hirantha', ip: '192.168.1.10', location: 'Server Room', status: 'Active', purchaseDate: '2022-03-15' },
  { id: 'PC002', type: 'PC', tag: 'MOHE-PC-0002', serial: 'SN-HP-001', brand: 'HP', model: 'EliteDesk 800 G8', cpu: 'Intel Core i5-11500', ram: '8GB DDR4', storage: '256GB SSD', os: 'Windows 10 Pro', division: 'Finance Division', officer: 'Sachin', ip: '192.168.1.25', location: 'Finance Block', status: 'Active', purchaseDate: '2021-07-20' },
  { id: 'PC003', type: 'PC', tag: 'MOHE-PC-0003', serial: 'SN-LENOVO-001', brand: 'Lenovo', model: 'ThinkCentre M80q', cpu: 'Intel Core i5-10400', ram: '8GB DDR4', storage: '256GB SSD', os: 'Windows 10 Pro', division: 'HR Division', officer: 'Savishka', ip: '192.168.1.30', location: 'HR Block', status: 'Maintenance', purchaseDate: '2020-11-10' },
  { id: 'LT001', type: 'Laptop', tag: 'MOHE-LT-0001', serial: 'SN-DELL-LT-001', brand: 'Dell', model: 'Latitude 5520', cpu: 'Intel Core i7-1165G7', ram: '16GB DDR4', storage: '512GB NVMe', os: 'Windows 11 Pro', division: 'IT Department', officer: 'Sachin', ip: '192.168.1.50', location: 'IT Office', status: 'Active', purchaseDate: '2022-01-05' },
  { id: 'LT002', type: 'Laptop', tag: 'MOHE-LT-0002', serial: 'SN-HP-LT-001', brand: 'HP', model: 'EliteBook 840 G8', cpu: 'Intel Core i5-1135G7', ram: '8GB DDR4', storage: '256GB SSD', os: 'Windows 10 Pro', division: 'Academic Affairs Division', officer: 'Shalom', ip: '192.168.1.55', location: 'Academic Block', status: 'Active', purchaseDate: '2021-09-12' },
  { id: 'LT003', type: 'Laptop', tag: 'MOHE-LT-0003', serial: 'SN-LENOVO-LT-001', brand: 'Lenovo', model: 'ThinkPad T14s', cpu: 'AMD Ryzen 5 PRO 5650U', ram: '16GB DDR4', storage: '512GB SSD', os: 'Windows 11 Pro', division: 'Planning & Statistics Division', officer: 'Hirantha', ip: '192.168.1.60', location: 'Planning Block', status: 'Active', purchaseDate: '2023-02-18' },
  { id: 'PR001', type: 'Printer', tag: 'MOHE-PR-0001', serial: 'SN-CANON-001', brand: 'Canon', model: 'imageRUNNER 2630i', serialNum: 'CIR2630-0001', inventoryTag: 'MOHE-PR-0001', location: 'Finance Division', connectionType: 'Network', ipAddress: '192.168.1.100', status: 'Active', purchaseDate: '2021-03-10' },
  { id: 'PR002', type: 'Printer', tag: 'MOHE-PR-0002', serial: 'SN-HP-PR-001', brand: 'HP', model: 'LaserJet Pro MFP M428', serialNum: 'HPLJ-M428-001', inventoryTag: 'MOHE-PR-0002', location: 'HR Division', connectionType: 'USB', ipAddress: null, status: 'Maintenance', purchaseDate: '2020-08-22' },
];

// ============================================================
// STOCK
// ============================================================
export const STOCK_ITEMS = [
  { id: 'ST001', category: 'HDD', name: 'Seagate 1TB HDD (2.5")', quantity: 8, minThreshold: 3, unit: 'units', status: 'Available', lastUpdated: '2026-09-10', updatedBy: 'Sachin' },
  { id: 'ST002', category: 'HDD', name: 'WD 2TB HDD (3.5")', quantity: 2, minThreshold: 3, unit: 'units', status: 'Low Stock', lastUpdated: '2026-09-12', updatedBy: 'Sachin' },
  { id: 'ST003', category: 'RAM', name: 'Kingston 8GB DDR4 2666MHz', quantity: 12, minThreshold: 5, unit: 'sticks', status: 'Available', lastUpdated: '2026-09-08', updatedBy: 'Savishka' },
  { id: 'ST004', category: 'RAM', name: 'Corsair 16GB DDR4 3200MHz', quantity: 0, minThreshold: 2, unit: 'sticks', status: 'Not Available', lastUpdated: '2026-09-01', updatedBy: 'Sachin' },
  { id: 'ST005', category: 'Mouse', name: 'Logitech M100 Wired Mouse', quantity: 15, minThreshold: 5, unit: 'units', status: 'Available', lastUpdated: '2026-09-05', updatedBy: 'Savishka' },
  { id: 'ST006', category: 'Keyboard', name: 'HP K1500 Wired Keyboard', quantity: 10, minThreshold: 4, unit: 'units', status: 'Available', lastUpdated: '2026-09-05', updatedBy: 'Savishka' },
  { id: 'ST007', category: 'Wi-Fi Adapter', name: 'TP-Link AC1300 USB Adapter', quantity: 4, minThreshold: 2, unit: 'units', status: 'Available', lastUpdated: '2026-09-03', updatedBy: 'Sachin' },
  { id: 'ST008', category: 'Network Cable', name: 'Cat6 Network Cable (3m)', quantity: 25, minThreshold: 10, unit: 'pcs', status: 'Available', lastUpdated: '2026-08-28', updatedBy: 'Savishka' },
  { id: 'ST009', category: 'Network Cable', name: 'Cat6 Network Cable (1m)', quantity: 8, minThreshold: 10, unit: 'pcs', status: 'Low Stock', lastUpdated: '2026-09-11', updatedBy: 'Sachin' },
  { id: 'ST010', category: 'Power Cable', name: 'Standard IEC Power Cable (1.5m)', quantity: 20, minThreshold: 8, unit: 'pcs', status: 'Available', lastUpdated: '2026-08-30', updatedBy: 'Savishka' },
  { id: 'ST011', category: 'HDMI Cable', name: 'HDMI 2.0 Cable (1.5m)', quantity: 0, minThreshold: 5, unit: 'pcs', status: 'Not Available', lastUpdated: '2026-09-14', updatedBy: 'Sachin' },
  { id: 'ST012', category: 'VGA Cable', name: 'VGA to VGA Cable (1.8m)', quantity: 7, minThreshold: 3, unit: 'pcs', status: 'Available', lastUpdated: '2026-09-09', updatedBy: 'Savishka' },
];

// ============================================================
// TICKETS
// ============================================================
export const TICKETS = [
  { id: 'TKT-2026-001', category: 'Hardware', title: 'PC not powering on', description: 'The PC in Finance Block Room 203 is not starting up at all. The power button shows no response.', assetId: 'PC002', division: 'Finance Division', reportedBy: 'U002', assignedTo: 'U003', status: 'In Progress', priority: 'High', createdAt: '2026-09-14T08:30:00', updatedAt: '2026-09-14T10:00:00', notes: 'PSU suspected. Checking power supply unit.', partsUsed: [], reassignmentRequest: null },
  { id: 'TKT-2026-002', category: 'Software', title: 'Microsoft Office license expired', description: 'Office 365 license has expired on the planning division laptop. User cannot open Word or Excel.', assetId: 'LT003', division: 'Planning & Statistics Division', reportedBy: 'U002', assignedTo: 'U004', status: 'Resolved', priority: 'Medium', createdAt: '2026-09-13T09:15:00', updatedAt: '2026-09-13T14:30:00', notes: 'License renewed through IT Admin portal. Tested successfully.', partsUsed: [], reassignmentRequest: null },
  { id: 'TKT-2026-003', category: 'Network', title: 'No internet access — HR Division', description: 'Multiple computers in the HR Division lost internet access simultaneously. Suspected switch or DHCP issue.', assetId: null, division: 'HR Division', reportedBy: 'U002', assignedTo: 'U005', status: 'Pending Parts', priority: 'High', createdAt: '2026-09-15T07:45:00', updatedAt: '2026-09-15T09:30:00', notes: 'Switch port issue. Replacement switch module required.', partsUsed: [], reassignmentRequest: { id: 'RR-001', requestedBy: 'U005', reason: 'Network hardware replacement requires specialized skills I am not yet trained in.', requestedAt: '2026-09-15T10:00:00', status: 'Pending' } },
  { id: 'TKT-2026-004', category: 'PC/Printer', title: 'Printer offline — Canon iR 2630i', description: 'The Canon printer in Finance Division is showing offline. Users unable to print.', assetId: 'PR001', division: 'Finance Division', reportedBy: 'U002', assignedTo: 'U006', status: 'New', priority: 'Medium', createdAt: '2026-09-16T08:00:00', updatedAt: '2026-09-16T08:00:00', notes: '', partsUsed: [], reassignmentRequest: null },
  { id: 'TKT-2026-005', category: 'Hardware', title: 'Laptop screen flickering', description: 'Dell Latitude 5520 screen flickers intermittently. Suspected display cable loose.', assetId: 'LT001', division: 'IT Department', reportedBy: 'U002', assignedTo: 'U004', status: 'Assigned', priority: 'Low', createdAt: '2026-09-12T11:00:00', updatedAt: '2026-09-12T13:00:00', notes: '', partsUsed: [], reassignmentRequest: null },
  { id: 'TKT-2026-006', category: 'Software', title: 'Windows update stuck at 87%', description: 'PC in HR Division stuck on Windows update. System unresponsive after restart.', assetId: 'PC003', division: 'HR Division', reportedBy: 'U002', assignedTo: 'U003', status: 'Closed', priority: 'Medium', createdAt: '2026-09-10T14:00:00', updatedAt: '2026-09-11T09:00:00', notes: 'Safe mode recovery used. Update re-run successfully.', partsUsed: [], reassignmentRequest: null },
];

// ============================================================
// EXTERNAL REPAIRS
// ============================================================
export const REPAIRS = [
  { id: 'REP-2026-001', assetId: 'PC003', assetTag: 'MOHE-PC-0003', assetDescription: 'Lenovo ThinkCentre M80q — HR Division', vendorId: 'VEN-001', vendorName: 'TechFix Maldives', dispatchDate: '2026-09-05', expectedReturn: '2026-09-15', gatePass: 'GP-2026-053', forReason: 'Motherboard failure — system not booting past POST screen', initialDiagnosis: 'Suspected fried capacitor on motherboard', status: 'Overdue', assignedTo: 'U002', totalCost: null, invoice: null, whatReplaced: null, notes: 'Awaiting component arrival from supplier' },
  { id: 'REP-2026-002', assetId: 'PR002', assetTag: 'MOHE-PR-0002', assetDescription: 'HP LaserJet Pro MFP M428 — HR Division', vendorId: 'VEN-002', vendorName: 'Office Solutions Pvt Ltd', dispatchDate: '2026-08-20', expectedReturn: '2026-09-01', gatePass: 'GP-2026-041', forReason: 'Paper jam mechanism failure and drum unit worn out', initialDiagnosis: 'Drum unit and pickup rollers require replacement', status: 'Closed', assignedTo: 'U002', totalCost: 450.00, invoice: 'INV-REP-2026-002.pdf', whatReplaced: 'Drum Unit (HP CF217A), Pickup Rollers (RM2-5452)', notes: 'Repaired and returned. Tested 50 pages — working fine.' },
];

export const VENDORS = [
  { id: 'VEN-001', name: 'TechFix Maldives', contact: 'Ali Hassan', phone: '+960 300-1234', email: 'ali@techfix.mv', address: 'Male, Maldives', specialization: 'PC, Laptops, Servers' },
  { id: 'VEN-002', name: 'Office Solutions Pvt Ltd', contact: 'Ibrahim Rauf', phone: '+960 300-5678', email: 'info@officesolutions.mv', address: 'Male, Maldives', specialization: 'Printers, Photocopiers' },
  { id: 'VEN-003', name: 'NetWorld Technologies', contact: 'Fathimath Isha', phone: '+960 300-9012', email: 'networld@mv.net', address: 'Male, Maldives', specialization: 'Network Equipment, Switches' },
];

// ============================================================
// ZOOM REQUESTS
// ============================================================
export const ZOOM_REQUESTS = [
  { id: 'ZM-2026-001', meetingName: 'Higher Education Budget Review 2027', meetingLink: 'https://zoom.us/j/123456789', location: 'Main Conference Hall — 3rd Floor', meetingLevel: 'Critical', requiredEquipment: ['Projector', 'HDMI Cable', 'Laptop', 'Microphone', 'Screen'], requestedBy: 'U007', assignedTo: 'U004', status: 'Confirmed', scheduledDate: '2026-09-18T09:00:00', createdAt: '2026-09-14T10:00:00' },
  { id: 'ZM-2026-002', meetingName: 'Academic Council Meeting', meetingLink: '', location: 'Boardroom — 5th Floor', meetingLevel: 'Medium', requiredEquipment: ['Laptop', 'HDMI Cable', 'Webcam'], requestedBy: 'U007', assignedTo: 'U005', status: 'Pending', scheduledDate: '2026-09-20T14:00:00', createdAt: '2026-09-15T09:00:00' },
  { id: 'ZM-2026-003', meetingName: 'IT Infrastructure Planning Session', meetingLink: 'https://zoom.us/j/111222333', location: 'IT Training Room — 1st Floor', meetingLevel: 'Medium', requiredEquipment: ['Laptop', 'Projector', 'VGA Cable'], requestedBy: 'U007', assignedTo: 'U002', status: 'Completed', scheduledDate: '2026-09-10T10:00:00', createdAt: '2026-09-08T11:00:00' },
];

// ============================================================
// PUBLICATIONS
// ============================================================
export const PUBLICATIONS = [
  { id: 'PUB-2026-001', title: 'Scholarship Application Portal Launch Notice', content: 'Official notice regarding the opening of the 2027 Scholarship Applications portal...', publishedBy: 'U002', approvedBy: 'U001', requestedBy: 'U007', status: 'Published', publishedAt: '2026-09-10T12:00:00', requestedAt: '2026-09-08T09:00:00', attachments: ['scholarship_notice_2027.pdf'] },
  { id: 'PUB-2026-002', title: 'Ministry Annual Report 2025 — Web Upload', content: 'Annual report document for public portal...', publishedBy: null, approvedBy: null, requestedBy: 'U008', status: 'Pending Review', publishedAt: null, requestedAt: '2026-09-15T14:00:00', attachments: ['annual_report_2025.pdf', 'summary_2025.docx'] },
  { id: 'PUB-2026-003', title: 'Updated Contact Directory', content: 'Updated divisional contacts and phone directory...', publishedBy: 'U003', approvedBy: 'U001', requestedBy: 'U007', status: 'Published', publishedAt: '2026-09-05T11:00:00', requestedAt: '2026-09-03T10:00:00', attachments: [] },
];

// ============================================================
// TASKS
// ============================================================
export const TASKS = [
  {
    id: 'TSK-2026-001', title: 'Network Infrastructure Upgrade — Finance Block', description: 'Complete Cat6 cabling replacement and switch installation across Finance Block (3 floors, 45 ports)', priority: 'High', status: 'In Progress', startDate: '2026-09-01', dueDate: '2026-09-30', assignees: ['U003', 'U004'], createdBy: 'U002', department: 'IT Department', project: 'Network Upgrade 2026',
    subtasks: [
      { id: 'SUB-001-1', title: 'Floor 1 cabling survey & labeling', assignee: 'U003', dueDate: '2026-09-05', status: 'Completed', completedAt: '2026-09-04T16:00:00' },
      { id: 'SUB-001-2', title: 'Floor 2 cabling installation', assignee: 'U004', dueDate: '2026-09-15', status: 'Completed', completedAt: '2026-09-14T15:30:00' },
      { id: 'SUB-001-3', title: 'Floor 3 cabling installation', assignee: 'U003', dueDate: '2026-09-22', status: 'In Progress', completedAt: null },
      { id: 'SUB-001-4', title: 'Switch configuration and testing', assignee: 'U004', dueDate: '2026-09-28', status: 'To Do', completedAt: null },
      { id: 'SUB-001-5', title: 'Documentation and sign-off', assignee: 'U003', dueDate: '2026-09-30', status: 'To Do', completedAt: null },
    ],
    createdAt: '2026-09-01T08:00:00', updatedAt: '2026-09-15T10:00:00',
  },
  {
    id: 'TSK-2026-002', title: 'PC Asset Tagging & Inventory Audit', description: 'Physical audit of all PCs and laptops across Ministry divisions. Update asset register with current status.', priority: 'Medium', status: 'In Progress', startDate: '2026-09-10', dueDate: '2026-09-25', assignees: ['U005', 'U006'], createdBy: 'U002', department: 'IT Department', project: 'Asset Management',
    subtasks: [
      { id: 'SUB-002-1', title: 'Audit IT Department assets', assignee: 'U005', dueDate: '2026-09-12', status: 'Completed', completedAt: '2026-09-11T15:00:00' },
      { id: 'SUB-002-2', title: 'Audit Finance Division assets', assignee: 'U006', dueDate: '2026-09-18', status: 'In Progress', completedAt: null },
      { id: 'SUB-002-3', title: 'Audit HR Division assets', assignee: 'U005', dueDate: '2026-09-22', status: 'To Do', completedAt: null },
      { id: 'SUB-002-4', title: 'Update database and generate report', assignee: 'U006', dueDate: '2026-09-25', status: 'To Do', completedAt: null },
    ],
    createdAt: '2026-09-10T09:00:00', updatedAt: '2026-09-12T11:00:00',
  },
  {
    id: 'TSK-2026-003', title: 'IT Security Policy Documentation', description: 'Draft and finalize the Ministry IT Security Policy document including password policy, device usage, and incident response.', priority: 'Urgent', status: 'To Do', startDate: '2026-09-16', dueDate: '2026-09-20', assignees: ['U003', 'U004', 'U005', 'U006'], createdBy: 'U001', department: 'IT Department', project: 'IT Governance 2026',
    subtasks: [
      { id: 'SUB-003-1', title: 'Draft password & access policy', assignee: 'U003', dueDate: '2026-09-17', status: 'To Do', completedAt: null },
      { id: 'SUB-003-2', title: 'Draft device usage policy', assignee: 'U004', dueDate: '2026-09-18', status: 'To Do', completedAt: null },
      { id: 'SUB-003-3', title: 'Draft incident response procedure', assignee: 'U005', dueDate: '2026-09-19', status: 'To Do', completedAt: null },
      { id: 'SUB-003-4', title: 'Review and finalize document', assignee: 'U001', dueDate: '2026-09-20', status: 'To Do', completedAt: null },
    ],
    createdAt: '2026-09-15T14:00:00', updatedAt: '2026-09-15T14:00:00',
  },
  {
    id: 'TSK-2026-004', title: 'Server Room Cable Management', description: 'Organize and label all server room cables. Install cable trays and proper cable management solutions.', priority: 'Low', status: 'Completed', startDate: '2026-09-01', dueDate: '2026-09-08', assignees: ['U006'], createdBy: 'U002', department: 'IT Department', project: 'Infrastructure Maintenance',
    subtasks: [
      { id: 'SUB-004-1', title: 'Remove old unused cables', assignee: 'U006', dueDate: '2026-09-02', status: 'Completed', completedAt: '2026-09-02T14:00:00' },
      { id: 'SUB-004-2', title: 'Install cable trays', assignee: 'U006', dueDate: '2026-09-05', status: 'Completed', completedAt: '2026-09-05T16:00:00' },
      { id: 'SUB-004-3', title: 'Label and document all cables', assignee: 'U006', dueDate: '2026-09-08', status: 'Completed', completedAt: '2026-09-08T12:00:00' },
    ],
    createdAt: '2026-09-01T07:30:00', updatedAt: '2026-09-08T12:00:00',
  },
];

// ============================================================
// AUDIT LOGS
// ============================================================
export const AUDIT_LOGS = [
  { id: 'AUD-001', timestamp: '2026-09-16T08:30:15', userId: 'U002', username: 'ITAdmin', action: 'CREATE', entityType: 'Ticket', entityId: 'TKT-2026-004', description: 'Created new ticket: Printer offline — Canon iR 2630i', module: 'Helpdesk' },
  { id: 'AUD-002', timestamp: '2026-09-16T08:35:22', userId: 'U002', username: 'ITAdmin', action: 'ASSIGN', entityType: 'Ticket', entityId: 'TKT-2026-004', description: 'Assigned ticket TKT-2026-004 to Shalom (U004)', module: 'Helpdesk' },
  { id: 'AUD-003', timestamp: '2026-09-15T14:22:10', userId: 'U001', username: 'SuperAdmin', action: 'CREATE', entityType: 'Task', entityId: 'TSK-2026-003', description: 'Created task: IT Security Policy Documentation', module: 'Task Management' },
  { id: 'AUD-004', timestamp: '2026-09-15T10:05:44', userId: 'U006', username: 'hassan.waheed', action: 'REASSIGN_REQUEST', entityType: 'Ticket', entityId: 'TKT-2026-003', description: 'Submitted reassignment request for TKT-2026-003 — Network issue beyond trainee skill level', module: 'Helpdesk' },
  { id: 'AUD-005', timestamp: '2026-09-14T11:30:00', userId: 'U002', username: 'ITAdmin', action: 'UPDATE', entityType: 'Stock', entityId: 'ST011', description: 'Marked HDMI Cable stock as "Not Available" — quantity: 0', module: 'Stock' },
  { id: 'AUD-006', timestamp: '2026-09-14T10:15:33', userId: 'U002', username: 'ITAdmin', action: 'STATUS_CHANGE', entityType: 'Ticket', entityId: 'TKT-2026-001', description: 'Changed ticket status from Assigned → In Progress', module: 'Helpdesk' },
  { id: 'AUD-007', timestamp: '2026-09-13T15:45:22', userId: 'U001', username: 'SuperAdmin', action: 'PRIVILEGE_CHANGE', entityType: 'User', entityId: 'U004', description: 'Increased privileges for Shalom — granted asset editing access', module: 'User Management' },
  { id: 'AUD-008', timestamp: '2026-09-13T14:30:00', userId: 'U005', username: 'ibrahim.nimal', action: 'RESOLVE', entityType: 'Ticket', entityId: 'TKT-2026-002', description: 'Marked ticket TKT-2026-002 as Resolved — Office license renewed', module: 'Helpdesk' },
  { id: 'AUD-009', timestamp: '2026-09-12T09:00:00', userId: 'U002', username: 'ITAdmin', action: 'DISPATCH', entityType: 'Repair', entityId: 'REP-2026-001', description: 'Dispatched PC003 (MOHE-PC-0003) to TechFix Maldives for motherboard repair', module: 'External Repairs' },
  { id: 'AUD-010', timestamp: '2026-09-10T12:00:00', userId: 'U002', username: 'ITAdmin', action: 'PUBLISH', entityType: 'Publication', entityId: 'PUB-2026-001', description: 'Published: Scholarship Application Portal Launch Notice', module: 'Web Publication' },
  { id: 'AUD-011', timestamp: '2026-09-10T08:00:00', userId: 'U002', username: 'ITAdmin', action: 'CREATE', entityType: 'Task', entityId: 'TSK-2026-002', description: 'Created task: PC Asset Tagging & Inventory Audit', module: 'Task Management' },
  { id: 'AUD-012', timestamp: '2026-09-08T10:00:00', userId: 'U001', username: 'SuperAdmin', action: 'LOGIN', entityType: 'Session', entityId: 'U001', description: 'Super Admin logged in from 192.168.1.5', module: 'Authentication' },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================
export const getUser = (id) => USERS.find(u => u.id === id);
export const getAsset = (id) => ASSETS.find(a => a.id === id);

export const calcTaskProgress = (task) => {
  if (!task.subtasks || task.subtasks.length === 0) {
    return task.status === 'Completed' ? 100 : 0;
  }
  const completed = task.subtasks.filter(s => s.status === 'Completed').length;
  return Math.round((completed / task.subtasks.length) * 100);
};

export const getTicketStats = () => ({
  total: TICKETS.length,
  open: TICKETS.filter(t => ['New', 'Assigned', 'In Progress', 'Pending Parts'].includes(t.status)).length,
  resolved: TICKETS.filter(t => t.status === 'Resolved').length,
  closed: TICKETS.filter(t => t.status === 'Closed').length,
  byCategory: {
    Hardware: TICKETS.filter(t => t.category === 'Hardware').length,
    Software: TICKETS.filter(t => t.category === 'Software').length,
    Network: TICKETS.filter(t => t.category === 'Network').length,
    'PC/Printer': TICKETS.filter(t => t.category === 'PC/Printer').length,
  },
  pendingReassignment: TICKETS.filter(t => t.reassignmentRequest?.status === 'Pending').length,
});

export const getTaskStats = (userId = null) => {
  const tasks = userId ? TASKS.filter(t => t.assignees.includes(userId)) : TASKS;
  const today = new Date();
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    toDo: tasks.filter(t => t.status === 'To Do').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < today && t.status !== 'Completed').length,
    dueSoon: tasks.filter(t => {
      const due = new Date(t.dueDate);
      const diff = (due - today) / (1000 * 60 * 60);
      return diff > 0 && diff <= 48 && t.status !== 'Completed';
    }).length,
  };
};

export const STATUS_COLORS = {
  'New': 'badge-blue',
  'Assigned': 'badge-purple',
  'In Progress': 'badge-amber',
  'Pending Parts': 'badge-orange',
  'Resolved': 'badge-green',
  'Closed': 'badge-gray',
  'Active': 'badge-green',
  'Maintenance': 'badge-amber',
  'Inactive': 'badge-gray',
  'Available': 'badge-green',
  'Low Stock': 'badge-amber',
  'Not Available': 'badge-red',
  'Overdue': 'badge-red',
  'Pending': 'badge-amber',
  'Confirmed': 'badge-green',
  'Completed': 'badge-green',
  'Critical': 'badge-red',
  'Medium': 'badge-blue',
  'High': 'badge-red',
  'Urgent': 'badge-red',
  'Low': 'badge-gray',
  'To Do': 'badge-blue',
  'On Hold': 'badge-purple',
  'Published': 'badge-green',
  'Pending Review': 'badge-amber',
  'Draft': 'badge-gray',
};
