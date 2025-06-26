---
title: "Is your team 'log ready'?"
date: "2023-08-11"
description: "Cybersecurity spotlight on audit and event logging within Microsoft's Azure and M365. Most organizations think they have logging covered, but when an incident happens, they discover critical gaps."
excerpt: "Most organizations think they have logging covered, but when an incident happens, they discover critical gaps in their logging strategy."
---

# Is your team 'log ready'?

When I ask security teams if they're "log ready," most confidently say yes. They point to their SIEM, their centralized logging platform, and their collection of security tools. But when an incident actually happens, I consistently see the same problem: critical gaps in their logging strategy that make investigation nearly impossible.

## The Logging Confidence Gap

Here's what usually happens: an organization suffers a security incident, and the response team immediately turns to the logs for answers. But instead of finding a clear trail of evidence, they discover:

- **Missing authentication logs** from critical systems
- **Incomplete audit trails** for privileged operations  
- **Retention policies** that deleted crucial evidence
- **Log sources** that were never configured properly
- **Timestamps** that don't align across systems

The painful reality is that many organizations are collecting logs, but they're not collecting the *right* logs, or they're not retaining them long enough to be useful during an investigation.

## What "Log Ready" Actually Means

Being log ready means more than just having a SIEM. It means having a comprehensive strategy that covers:

### 1. Authentication and Authorization Events
- All login attempts (successful and failed)
- Privilege escalation events
- Service account activity
- Multi-factor authentication events
- Conditional access policy triggers

### 2. Data Access and Modification
- File and folder access patterns
- Database queries and modifications
- Email access and forwarding rules
- SharePoint and OneDrive activity
- Teams and collaboration platform usage

### 3. Administrative Actions
- Configuration changes
- User and group modifications
- Policy updates
- Service deployments
- Infrastructure modifications

### 4. Network and Communication Events
- DNS queries and responses
- Network connection attempts
- VPN usage patterns
- Proxy and firewall activity
- Email flow and routing

## The Microsoft 365 Challenge

Microsoft 365 presents unique logging challenges because audit data is scattered across multiple services:

- **Azure AD Sign-in Logs**: Authentication events
- **Azure AD Audit Logs**: Directory changes
- **Office 365 Audit Log**: Application-specific events
- **Microsoft Defender**: Security-specific events
- **Exchange Online**: Email-specific events

Each service has different retention periods, different export mechanisms, and different levels of detail. Without a comprehensive strategy, you'll miss critical events.

## Building Your Logging Strategy

### Step 1: Inventory Your Log Sources
Create a comprehensive list of every system, service, and application in your environment. For each one, document:
- What types of events it generates
- How long those events are retained
- How you can access and export the logs
- Whether the logs are automatically forwarded to your SIEM

### Step 2: Map Logs to Attack Techniques
Use frameworks like MITRE ATT&CK to map your log sources to common attack techniques. This helps identify gaps where an attacker could operate without generating detectable logs.

### Step 3: Test Your Coverage
Regularly test your logging coverage by conducting tabletop exercises or purple team activities. When you simulate an attack, can you track the attacker's movements through your logs?

### Step 4: Plan for Legal Hold
Understand your organization's legal and compliance requirements for log retention. Make sure you can preserve logs for the required time periods, and that you have processes for legal hold when needed.

## Common Pitfalls to Avoid

**Over-logging**: Collecting everything creates noise and storage costs without improving security outcomes. Focus on high-value events that support your detection and investigation goals.

**Under-retention**: Sophisticated attackers often maintain persistence for months before activating. Make sure your retention periods account for advanced persistent threats.

**Incomplete timestamps**: Ensure all systems are synchronized to a common time source. Misaligned timestamps make correlation nearly impossible.

**Ignoring cloud services**: Many organizations focus on on-premises logging while neglecting cloud services that often contain the most sensitive data.

## The Bottom Line

Being log ready requires intentional planning, regular testing, and ongoing maintenance. It's not enough to deploy a SIEM and hope for the best. You need to actively verify that you're collecting the right events, retaining them for the right duration, and can actually use them when it matters most.

The question isn't whether you're collecting logs – it's whether those logs will actually help you when an incident occurs. Take the time to audit your logging strategy now, before you need it in a crisis.

*Want to discuss your organization's logging strategy? Feel free to reach out – I'd be happy to share insights from other environments I've worked with.*