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
