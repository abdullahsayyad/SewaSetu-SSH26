# SewaSetu – Public Grievance Management System

## Overview

SewaSetu is a modern public grievance management platform designed to streamline complaint submission, classification, routing, prioritization, and resolution.  

The system replaces slow and manual grievance handling processes with an automated, structured, and priority-driven civic operations workflow.

---

## Problem

Existing grievance platforms face several challenges:

- Manual routing and slow processing
- Misclassification of complaints
- No prioritization mechanism
- Language barriers
- Data overload for departments
- Lack of actionable insights
- Weak escalation tracking
- Spam and duplicate complaints

---

## Solution

SewaSetu introduces an intelligent and structured approach to grievance management:

- Automated complaint classification and department routing
- Risk-based priority levels with SLA tracking
- Structured operational reports for departments
- Map-based real-time visibility of unresolved issues
- Citizen upvote mechanism for community-impact prioritization
- Escalation monitoring and lifecycle transparency
- Analytics-driven dashboards for performance tracking

---

## System Roles

### Citizen
- Submit complaints in any language
- Upload optional images
- Auto-detect or select location
- View unresolved complaints on map
- Upvote similar issues
- Track complaint status

### Department Officer
- View department-specific dashboard
- Access structured complaint reports
- Filter by priority and status
- Resolve complaints and upload reports
- Monitor SLA and escalation alerts

---

## Core Features

### Map-Based Monitoring
- Citizens view all unresolved complaints in their locality
- Departments view only complaints assigned to them
- Priority-based color coding

### Structured Operational Reports
Each complaint is converted into a standardized report including:
- Complaint metadata
- Location details
- Issue classification
- Priority level
- Risk assessment
- Suggested action
- Public engagement metrics

### Priority & SLA Management
- Low, Medium, High, Critical classification
- SLA deadline tracking
- Escalation level monitoring

### Analytics Dashboard
- Complaint distribution
- Resolution performance
- Escalation trends
- Department workload insights

---

## Architecture Overview

Complaint Submission  
→ Automated Classification  
→ Priority Assignment  
→ Department Routing  
→ Resolution Workflow  
→ Citizen Notification  

---

## Technology Stack

**Frontend**
- Next.js
- Tailwind CSS
- Leaflet / Mapbox
- Recharts

**Backend**
- Node.js
- PostgreSQL

**Prototype AI Layer**
- Structured classification logic (demo phase)

---

## Database Design (Core Tables)

- users  
- departments  
- complaints  
- complaint_ai_analysis  
- complaint_upvotes  
- complaint_status_history  
- resolution_reports  
- attachments  
- escalations  
- notifications  

---

---

## Screenshots

### Citizen Dashboard
![Citizen Dashboard](./screenshots/image1.png)

### Department Dashboard
![Department Dashboard](./WhatsApp%20Image%202026-02-27%20at%206.15.15%20AM.jpeg)

### Analytics Dashboard
![Analytics Dashboard](./WhatsApp%20Image%202026-02-27%20at%206.16.05%20AM.jpeg)

### Structured Report View
![Structured Report](./WhatsApp%20Image%202026-02-27%20at%206.16.27%20AM.jpeg)

---



---

## Future Enhancements

- Real NLP-based classification
- Semantic duplicate detection
- Predictive issue clustering
- Multi-city deployment support
- Mobile application integration

---

## Hackathon Objective

SewaSetu transforms grievance management from a reactive complaint portal into a structured, accountable, and data-driven civic operations system.
