const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function populateBOAProject() {
  try {
    console.log('Creating Bank of America tenant...');

    // Create Tenant
    const tenantResponse = await axios.post(`${API_URL}/tenants`, {
      name: 'Bank of America'
    });
    const tenantId = tenantResponse.data.id;
    console.log('✓ Tenant created:', tenantId);

    // Create Project
    console.log('\nCreating OCI Migration project...');
    const projectResponse = await axios.post(`${API_URL}/projects`, {
      name: 'Enterprise OCI Multi-Region Migration',
      description: 'Migration of core banking systems to Oracle Cloud Infrastructure across US-East, US-West, and EU-Frankfurt regions with Oracle Database 19c RAC implementation',
      tenantId: tenantId
    });
    const project = projectResponse.data;
    console.log('✓ Project created:', project.id);

    // Get columns
    const columns = project.columns;
    const businessDevCol = columns.find(c => c.title === 'Business Development');
    const scopingCol = columns.find(c => c.title === 'Scoping');
    const inProgressCol = columns.find(c => c.title === 'In Progress');
    const deliveredCol = columns.find(c => c.title === 'Delivered');

    console.log('\nPopulating cards...');

    // Business Development Cards
    const businessDevCards = [
      'Initial discovery call - understand regulatory compliance requirements (SOX, PCI-DSS, GLBA)',
      'Stakeholder interviews: CISO, CTO, Database Architects, DevOps leads',
      'Document current architecture: 500+ Oracle DB instances, 2PB data volume',
      'Present OCI value proposition: 40% TCO reduction, enhanced security posture',
      'Risk assessment: data sovereignty, disaster recovery, performance SLAs'
    ];

    for (const content of businessDevCards) {
      await axios.post(`${API_URL}/projects/cards`, {
        content,
        columnId: businessDevCol.id
      });
      console.log('  ✓ Added to Business Development:', content.substring(0, 50) + '...');
    }

    // Scoping Cards
    const scopingCards = [
      '📋 Technical Assessment: Map 127 applications to OCI services (OKE, Functions, API Gateway)',
      '🗺️ Multi-Region Strategy: Active-Active in US-East/US-West, DR in Frankfurt (RPO: 5min, RTO: 15min)',
      '💾 Database Migration Plan: Oracle 11g/12c → 19c RAC on Exadata Cloud@Customer',
      '🔐 Security Architecture: Customer-managed encryption keys, Private VCN peering, Bastion hosts',
      '📊 Capacity Planning: 150 OCPUs, 2TB RAM, 500TB block storage per region',
      '🔄 Network Design: FastConnect 10Gbps x2 per region, VCN peering via DRG',
      '📈 Migration Waves: 5 phases over 18 months, prioritized by business criticality',
      '💰 Cost Model: $2.8M annual run rate with 3-year commitment pricing',
      '🧪 Testing Strategy: Shadow production traffic for 30 days pre-cutover',
      '📚 Compliance Mapping: FedRAMP, SOC2, ISO27001 attestations required'
    ];

    for (const content of scopingCards) {
      await axios.post(`${API_URL}/projects/cards`, {
        content,
        columnId: scopingCol.id
      });
      console.log('  ✓ Added to Scoping:', content.substring(0, 50) + '...');
    }

    // In Progress Cards
    const inProgressCards = [
      '⚙️ CURRENT: Provisioning OCI tenancy with identity federation (OKTA SSO integration)',
      '🔧 Setting up Terraform IaC: VCNs, subnets, security lists, route tables across 3 regions',
      '🚀 Wave 1 Migration: Non-prod environments for payment processing system (15 databases)',
      '🔒 Implementing HashiCorp Vault integration for secrets management and key rotation',
      '📡 Configuring OCI GoldenGate for real-time CDC replication from on-prem to cloud',
      '🏗️ Building landing zone: Shared services VCN, egress/ingress DMZ, logging analytics',
      '🧑‍💻 Training DevOps team on OCI CLI, Resource Manager, and monitoring tools',
      '📊 Setting up observability stack: Application Performance Monitoring, Logging Analytics, alerting',
      '🔐 Configuring IAM policies using groups, dynamic groups, and compartment hierarchy',
      '🧪 Performance testing: Simulating 50K TPS load on pilot Oracle RAC cluster'
    ];

    for (const content of inProgressCards) {
      await axios.post(`${API_URL}/projects/cards`, {
        content,
        columnId: inProgressCol.id
      });
      console.log('  ✓ Added to In Progress:', content.substring(0, 50) + '...');
    }

    // Delivered Cards
    const deliveredCards = [
      '✅ POC Completed: Successfully migrated test Oracle DB (2TB) with <30min downtime',
      '✅ Security Review Approved: Penetration testing passed, CISO sign-off obtained',
      '✅ FastConnect Circuits: 2x 10Gbps connections established per region with <2ms latency',
      '✅ Disaster Recovery Drills: Achieved RTO of 12 minutes (under 15min target)',
      '✅ Compliance Audit: SOC2 Type II report issued for OCI infrastructure',
      '✅ Cost Optimization: Implemented auto-scaling, saved $180K/year vs initial forecast',
      '✅ Runbook Documentation: 250+ pages covering operations, troubleshooting, rollback procedures',
      '✅ Training Program: 45 engineers certified on OCI Architect Associate/Professional',
      '✅ Backup Strategy: Cross-region replication tested, 99.999999999% durability achieved',
      '✅ Change Management: CAB approval process integrated with ServiceNow workflows'
    ];

    for (const content of deliveredCards) {
      await axios.post(`${API_URL}/projects/cards`, {
        content,
        columnId: deliveredCol.id
      });
      console.log('  ✓ Added to Delivered:', content.substring(0, 50) + '...');
    }

    console.log('\n🎉 Successfully populated Bank of America OCI Migration project!');
    console.log(`\nProject Details:`);
    console.log(`- Client: Bank of America`);
    console.log(`- Project: ${project.name}`);
    console.log(`- Total Cards: ${businessDevCards.length + scopingCards.length + inProgressCards.length + deliveredCards.length}`);
    console.log(`\n📋 View at: http://localhost:5173/projects/${project.id}`);

  } catch (error) {
    console.error('Error populating data:', error.response?.data || error.message);
  }
}

populateBOAProject();
