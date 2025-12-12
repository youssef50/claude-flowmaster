import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Example Runbooks...');

  // 0. Clean up existing data to prevent duplicates
  console.log('🧹 Cleaning up old data...');
  await prisma.runbookTag.deleteMany({});
  await prisma.runbook.deleteMany({});
  await prisma.folder.deleteMany({});
  await prisma.tag.deleteMany({});

  // 1. Create Folders
  const migrationFolder = await prisma.folder.create({
    data: {
      name: 'Cloud Migrations',
      icon: '☁️',
      color: '#3b82f6', // blue
    },
  });

  const incidentFolder = await prisma.folder.create({
    data: {
      name: 'Incident Response',
      icon: '🚨',
      color: '#ef4444', // red
    },
  });

  // 2. Create Tags
  const ociTag = await prisma.tag.upsert({
    where: { name: 'OCI' },
    update: {},
    create: { name: 'OCI', color: '#f97316' }, // orange
  });

  const terraformTag = await prisma.tag.upsert({
    where: { name: 'Terraform' },
    update: {},
    create: { name: 'Terraform', color: '#8b5cf6' }, // purple
  });

  const databaseTag = await prisma.tag.upsert({
    where: { name: 'Database' },
    update: {},
    create: { name: 'Database', color: '#10b981' }, // green
  });

  const linuxTag = await prisma.tag.upsert({
    where: { name: 'Linux' },
    update: {},
    create: { name: 'Linux', color: '#facc15' }, // yellow
  });

  // 3. Create Runbook 1: Migrate to OCI
  await prisma.runbook.create({
    data: {
      title: 'Migrate to OCI: VM + VCN + Autonomous DB',
      description: 'A complete guide to standing up a simple infrastructure on Oracle Cloud Infrastructure using Terraform, including IAM and database access.',
      folderId: migrationFolder.id,
      tags: {
        create: [
          { tagId: ociTag.id },
          { tagId: terraformTag.id },
          { tagId: databaseTag.id },
        ],
      },
      content: {
        html: `
<h1>Migrate to OCI: Infrastructure as Code Guide</h1>
<p>This runbook details the process of migrating a workload to Oracle Cloud Infrastructure (OCI). We will provision a Virtual Cloud Network (VCN), a Compute Instance (VM), and an Autonomous Database, connecting them securely.</p>

<img src="/oci-architecture.png" alt="OCI Hub and Spoke Architecture Diagram">

<h2>Prerequisites</h2>
<ul>
  <li>Active OCI Account/Tenancy</li>
  <li><a href="https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm">OCI API Signing Key</a> generated</li>
  <li>Terraform v1.0+ installed</li>
</ul>

<h2>Step 1: Provider Configuration</h2>
<p>Create a <code>provider.tf</code> file to authenticate with OCI.</p>

<pre><code class="language-hcl">provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}</code></pre>

<h2>Step 2: Network Infrastructure (VCN)</h2>
<p>We need a VCN with a public subnet for the VM and a private subnet for the database.</p>

<pre><code class="language-hcl">resource "oci_core_vcn" "main" {
  cidr_block     = "10.0.0.0/16"
  compartment_id = var.compartment_id
  display_name   = "main-vcn"
  dns_label      = "mainvcn"
}

resource "oci_core_subnet" "public" {
  cidr_block        = "10.0.1.0/24"
  compartment_id    = var.compartment_id
  vcn_id            = oci_core_vcn.main.id
  display_name      = "public-subnet"
}</code></pre>

<h2>Step 3: Autonomous Database</h2>
<p>Provision an ATP (Autonomous Transaction Processing) instance.</p>

<pre><code class="language-hcl">resource "oci_database_autonomous_database" "db" {
  compartment_id           = var.compartment_id
  cpu_core_count           = 1
  data_storage_size_in_tbs = 1
  db_name                  = "demo_db"
  admin_password           = var.db_password
  is_free_tier             = true
}</code></pre>

<h2>Step 4: IAM & Access Policies</h2>
<p>Ensure the compute instance has permission to access the Autonomous Database wallet.</p>

<pre><code class="language-hcl">resource "oci_identity_policy" "db_access" {
  name           = "AllowVMToAccessDB"
  description    = "Allow dynamic group of VMs to manage database connection"
  compartment_id = var.compartment_id
  statements     = [
    "Allow dynamic-group DeployVMs to use autonomous-database-family in compartment id \${var.compartment_id}"
  ]
}</code></pre>

<h2>Verification</h2>
<p>Once applied, SSH into your new VM and verify connectivity:</p>
<pre><code class="language-bash">ssh opc@<vm_public_ip>
curl -v telnet://<db_endpoint>:1522</code></pre>
        `
      }
    }
  });

  // 4. Create Runbook 2: Incident Response
  await prisma.runbook.create({
    data: {
      title: 'Guide: Handling High CPU Usage Alerts',
      description: 'Standard Operating Procedure (SOP) for responding to >90% CPU utilization alerts on production app servers.',
      folderId: incidentFolder.id,
      tags: {
        create: [
          { tagId: linuxTag.id },
        ],
      },
      content: {
        html: `
<h1>SOP: High CPU Utilization Response</h1>
<p class="lead">Follow this guide when PagerDuty triggers a <strong>High CPU (>90%)</strong> alert for any Application Node.</p>

<h2>1. Initial Triage</h2>
<p>Acknowledge the alert within <strong>15 minutes</strong>. Then, log into the affected host.</p>
<pre><code class="language-bash">ssh user@affected-host-01</code></pre>

<h2>2. Diagnosis</h2>
<p>Run <code>top</code> or <code>htop</code> to identify the consuming process.</p>

<h3>Scenario A: Application Process (Node/Java/Python)</h3>
<p>If the main application process is consuming CPU:</p>
<ol>
  <li>Check application logs for infinite loops or massive data processing.</li>
  <li><strong>Action:</strong> If unresponsive, take a thread dump if possible, then restart the service.</li>
</ol>
<pre><code class="language-bash">sudo systemctl restart my-app.service</code></pre>

<h3>Scenario B: System Process / Rogue Script</h3>
<p>If an unknown process (e.g., <code>kswapd0</code>, crypto miner, backup script) is the culprit:</p>
<ul>
  <li><strong>kswapd0:</strong> System is out of memory and thrashing. Check RAM usage.</li>
  <li><strong>Backup script:</strong> Renice the process or kill if affecting production traffic.</li>
</ul>

<h2>3. Mitigation & Scaling</h2>
<p>If valid traffic is driving load, initiate scaling:</p>
<pre><code class="language-bash"># Example CLI command to scale ASG
aws autoscaling set-desired-capacity --auto-scaling-group-name production-asg --desired-capacity 5</code></pre>

<h2>4. Post-Mortem</h2>
<p>Once stabilized, export logs to S3 and create a Jira ticket for the core engineering team to investigate the root cause.</p>
        `
      }
    }
  });
  // 5. Create Runbook 3: Service Comparison
  await prisma.runbook.create({
    data: {
      title: 'Cloud Service Comparison Matrix (2025)',
      description: 'A comprehensive guide comparing equivalent services across AWS, Azure, Google Cloud (GCP), and Oracle Cloud (OCI).',
      folderId: migrationFolder.id,
      tags: {
        create: [
          { tagId: ociTag.id },
          { tagId: databaseTag.id },
          { tagId: terraformTag.id }, // Reusing tags for lack of "multi-cloud" tag in this seed
        ],
      },
      content: {
        html: `
<h1>Cloud Provider Service Comparison Matrix</h1>
<p class="lead">Use this reference table to map services when migrating or architecting multi-cloud solutions. Updated for 2025.</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-sm text-left border-collapse border border-gray-200 shadow-sm rounded-lg overflow-hidden">
    <thead>
      <tr class="divide-x divide-gray-200">
        <th class="p-4 bg-gray-50 font-bold text-gray-900 border-b border-gray-200 w-1/5">Service Category</th>
        <th class="p-4 bg-[#ff9900]/10 font-bold text-gray-900 border-b border-[#ff9900]/20 w-1/5">
          <div class="flex items-center gap-2">
            <span class="text-[#ff9900]">AWS</span>
            <span class="text-xs font-normal text-gray-500 ml-auto">Amazon</span>
          </div>
        </th>
        <th class="p-4 bg-[#007fff]/10 font-bold text-gray-900 border-b border-[#007fff]/20 w-1/5">
           <div class="flex items-center gap-2">
            <span class="text-[#007fff]">Azure</span>
            <span class="text-xs font-normal text-gray-500 ml-auto">Microsoft</span>
          </div>
        </th>
        <th class="p-4 bg-[#4285f4]/10 font-bold text-gray-900 border-b border-[#4285f4]/20 w-1/5">
           <div class="flex items-center gap-2">
            <span class="text-[#4285f4]">GCP</span>
            <span class="text-xs font-normal text-gray-500 ml-auto">Google</span>
          </div>
        </th>
        <th class="p-4 bg-[#f80000]/10 font-bold text-gray-900 border-b border-[#f80000]/20 w-1/5">
           <div class="flex items-center gap-2">
            <span class="text-[#f80000]">OCI</span>
            <span class="text-xs font-normal text-gray-500 ml-auto">Oracle</span>
          </div>
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 bg-white">
      <!-- Compute -->
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Virtual Servers</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon EC2</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Virtual Machines</td>
        <td class="p-3 font-mono text-xs text-gray-600">Compute Engine</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI Compute Instances</td>
      </tr>
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Serverless Functions</td>
        <td class="p-3 font-mono text-xs text-gray-600">AWS Lambda</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Functions</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud Functions</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI Functions</td>
      </tr>
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Container Orchestration</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon EKS</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Kubernetes Service (AKS)</td>
        <td class="p-3 font-mono text-xs text-gray-600">Google Kubernetes Engine (GKE)</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI Container Engine (OKE)</td>
      </tr>

      <!-- Storage -->
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Object Storage</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon S3</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Blob Storage</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud Storage</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI Object Storage</td>
      </tr>
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Block Storage</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon EBS</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Disk Storage</td>
        <td class="p-3 font-mono text-xs text-gray-600">Persistent Disk</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI Block Volumes</td>
      </tr>
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">File Storage</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon EFS</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Files</td>
        <td class="p-3 font-mono text-xs text-gray-600">Filestore</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI File Storage</td>
      </tr>

      <!-- Networking -->
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Virtual Network</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon VPC</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Virtual Network (VNet)</td>
        <td class="p-3 font-mono text-xs text-gray-600">Virtual Private Cloud (VPC)</td>
        <td class="p-3 font-mono text-xs text-gray-600">Virtual Cloud Network (VCN)</td>
      </tr>
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">DNS Management</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon Route 53</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure DNS</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud DNS</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI DNS</td>
      </tr>
       <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Content Delivery (CDN)</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon CloudFront</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure CDN</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud CDN</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI CDN</td>
      </tr>
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Dedicated Connection</td>
        <td class="p-3 font-mono text-xs text-gray-600">AWS Direct Connect</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure ExpressRoute</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud Interconnect</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI FastConnect</td>
      </tr>
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Load Balancing</td>
        <td class="p-3 font-mono text-xs text-gray-600">Elastic Load Balancing (ELB)</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Load Balancer</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud Load Balancing</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI Load Balancing</td>
      </tr>

       <!-- Database -->
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Relational Database</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon RDS</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure SQL Database</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud SQL</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI Database Service</td>
      </tr>
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">NoSQL Database</td>
        <td class="p-3 font-mono text-xs text-gray-600">Amazon DynamoDB</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Cosmos DB</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud Firestore</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI NoSQL Database</td>
      </tr>

      <!-- Security -->
      <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Identity Management</td>
        <td class="p-3 font-mono text-xs text-gray-600">AWS IAM</td>
        <td class="p-3 font-mono text-xs text-gray-600">Microsoft Entra ID</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud IAM</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI IAM</td>
      </tr>
       <tr class="divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
        <td class="p-3 font-semibold text-gray-700 bg-gray-50/50">Key Management</td>
        <td class="p-3 font-mono text-xs text-gray-600">AWS KMS</td>
        <td class="p-3 font-mono text-xs text-gray-600">Azure Key Vault</td>
        <td class="p-3 font-mono text-xs text-gray-600">Cloud KMS</td>
        <td class="p-3 font-mono text-xs text-gray-600">OCI Vault</td>
      </tr>

    </tbody>
  </table>
</div>
<div class="mt-8">
  <h3 class="text-lg font-semibold text-gray-700 mb-4">Reference Source</h3>
  <img src="/service-comparison-reference.png" alt="Service Comparison Reference" class="rounded-lg shadow-md border border-gray-200 max-w-full" />
</div>
        `
      }
    }
  });

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
