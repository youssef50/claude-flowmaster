#!/bin/bash

API_URL="http://localhost:3001/api"

echo "Creating Bank of America tenant..."
TENANT_RESPONSE=$(curl -s -X POST "$API_URL/tenants" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bank of America"}')

TENANT_ID=$(echo $TENANT_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
echo "✓ Tenant created: $TENANT_ID"

echo -e "\nCreating OCI Migration project..."
PROJECT_RESPONSE=$(curl -s -X POST "$API_URL/projects" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Enterprise OCI Multi-Region Migration\",\"description\":\"Migration of core banking systems to Oracle Cloud Infrastructure across US-East, US-West, and EU-Frankfurt regions with Oracle Database 19c RAC implementation\",\"tenantId\":\"$TENANT_ID\"}")

PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"id":"[^"]*' | head -1 | grep -o '[^"]*$')
echo "✓ Project created: $PROJECT_ID"

# Extract column IDs
BD_COL=$(echo $PROJECT_RESPONSE | grep -o '"id":"[^"]*","title":"Business Development"' | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
SCOPING_COL=$(echo $PROJECT_RESPONSE | grep -o '"id":"[^"]*","title":"Scoping"' | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
PROGRESS_COL=$(echo $PROJECT_RESPONSE | grep -o '"id":"[^"]*","title":"In Progress"' | grep -o '"id":"[^"]*' | grep -o '[^"]*$')
DELIVERED_COL=$(echo $PROJECT_RESPONSE | grep -o '"id":"[^"]*","title":"Delivered"' | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

echo -e "\nPopulating cards..."

# Business Development Cards
echo "Adding Business Development cards..."
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"Initial discovery call - understand regulatory compliance requirements (SOX, PCI-DSS, GLBA)\",\"columnId\":\"$BD_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"Stakeholder interviews: CISO, CTO, Database Architects, DevOps leads\",\"columnId\":\"$BD_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"Document current architecture: 500+ Oracle DB instances, 2PB data volume\",\"columnId\":\"$BD_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"Present OCI value proposition: 40% TCO reduction, enhanced security posture\",\"columnId\":\"$BD_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"Risk assessment: data sovereignty, disaster recovery, performance SLAs\",\"columnId\":\"$BD_COL\"}" > /dev/null
echo "  ✓ Added 5 cards"

# Scoping Cards
echo "Adding Scoping cards..."
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"📋 Technical Assessment: Map 127 applications to OCI services (OKE, Functions, API Gateway)\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🗺️ Multi-Region Strategy: Active-Active in US-East/US-West, DR in Frankfurt (RPO: 5min, RTO: 15min)\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"💾 Database Migration Plan: Oracle 11g/12c → 19c RAC on Exadata Cloud@Customer\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🔐 Security Architecture: Customer-managed encryption keys, Private VCN peering, Bastion hosts\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"📊 Capacity Planning: 150 OCPUs, 2TB RAM, 500TB block storage per region\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🔄 Network Design: FastConnect 10Gbps x2 per region, VCN peering via DRG\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"📈 Migration Waves: 5 phases over 18 months, prioritized by business criticality\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"💰 Cost Model: \$2.8M annual run rate with 3-year commitment pricing\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🧪 Testing Strategy: Shadow production traffic for 30 days pre-cutover\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"📚 Compliance Mapping: FedRAMP, SOC2, ISO27001 attestations required\",\"columnId\":\"$SCOPING_COL\"}" > /dev/null
echo "  ✓ Added 10 cards"

# In Progress Cards
echo "Adding In Progress cards..."
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"⚙️ CURRENT: Provisioning OCI tenancy with identity federation (OKTA SSO integration)\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🔧 Setting up Terraform IaC: VCNs, subnets, security lists, route tables across 3 regions\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🚀 Wave 1 Migration: Non-prod environments for payment processing system (15 databases)\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🔒 Implementing HashiCorp Vault integration for secrets management and key rotation\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"📡 Configuring OCI GoldenGate for real-time CDC replication from on-prem to cloud\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🏗️ Building landing zone: Shared services VCN, egress/ingress DMZ, logging analytics\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🧑‍💻 Training DevOps team on OCI CLI, Resource Manager, and monitoring tools\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"📊 Setting up observability stack: Application Performance Monitoring, Logging Analytics, alerting\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🔐 Configuring IAM policies using groups, dynamic groups, and compartment hierarchy\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"🧪 Performance testing: Simulating 50K TPS load on pilot Oracle RAC cluster\",\"columnId\":\"$PROGRESS_COL\"}" > /dev/null
echo "  ✓ Added 10 cards"

# Delivered Cards
echo "Adding Delivered cards..."
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ POC Completed: Successfully migrated test Oracle DB (2TB) with <30min downtime\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ Security Review Approved: Penetration testing passed, CISO sign-off obtained\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ FastConnect Circuits: 2x 10Gbps connections established per region with <2ms latency\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ Disaster Recovery Drills: Achieved RTO of 12 minutes (under 15min target)\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ Compliance Audit: SOC2 Type II report issued for OCI infrastructure\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ Cost Optimization: Implemented auto-scaling, saved \$180K/year vs initial forecast\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ Runbook Documentation: 250+ pages covering operations, troubleshooting, rollback procedures\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ Training Program: 45 engineers certified on OCI Architect Associate/Professional\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ Backup Strategy: Cross-region replication tested, 99.999999999% durability achieved\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
curl -s -X POST "$API_URL/projects/cards" -H "Content-Type: application/json" -d "{\"content\":\"✅ Change Management: CAB approval process integrated with ServiceNow workflows\",\"columnId\":\"$DELIVERED_COL\"}" > /dev/null
echo "  ✓ Added 10 cards"

echo -e "\n🎉 Successfully populated Bank of America OCI Migration project!"
echo -e "\nProject Details:"
echo "- Client: Bank of America"
echo "- Project: Enterprise OCI Multi-Region Migration"
echo "- Total Cards: 35 cards across 4 phases"
echo -e "\n📋 View at: http://localhost:5173/projects/$PROJECT_ID"
