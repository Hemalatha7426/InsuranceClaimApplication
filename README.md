# Insurance Claim Application

> A full-stack Insurance Claim Application — submit, track and manage insurance claims easily.  
> **By Hemalatha R**

---

## Overview

The **Insurance Claim Application** simplifies the insurance claim lifecycle:

- Customers register and submit claims with incident details and supporting documents.  
- Agents review claims, update status, and add notes.  
- The system stores customer & claim data in MySQL and exposes a responsive React UI for users and agents.

This README provides step-by-step setup instructions, an explanation of how the system works, the tech stack, demo video placeholder, frontend feature enhancements, and a detailed backend setup.

---

## How it works

1. **Customer registration**  
    - Customer fills a registration form (name, email, phone, policy number).  
2. **Claim submission**  
    - Customer selects policy/customer, provides `claimType`, `claimAmount`, `incidentDate`, `description`, and optional attachments.  
3. **Persist & notify**  
    - Backend validates input, persists the customer and claim to the database, sets the claim `status` to `SUBMITTED` and `submissionDate` to current date.  
4. **Agent review**  
    - Agent views pending claims, inspects details/documents, updates status to `UNDER_REVIEW`, `APPROVED` or `REJECTED`.  
5. **Status reflection**  
    - Frontend polls or requests updated claim data and shows real-time status to the customer.

---

## Technologies Used

### **Frontend**
- React.js  
- React Router  
- Axios  
- HTML5 / CSS3  
- Optional: Tailwind / Bootstrap  

### **Backend**
- Spring Boot  
- Spring Data JPA  
- Maven  

### **Database**
- MySQL  

### **Tools**
- Node.js  
- Swagger 
- Git / GitHub  

---

## Output 
<img width="624" height="838" alt="Screenshot 2025-11-16 094812" src="https://github.com/user-attachments/assets/9c5955ec-adbc-47af-bd9b-b494d4fa2e4a" />


https://github.com/user-attachments/assets/8a8ea729-7233-404d-b4d9-468457dd8107



https://github.com/user-attachments/assets/260862d4-f538-4e0d-a774-1a475d4e2c94



https://github.com/user-attachments/assets/dea37865-d7d0-4086-ad4c-57deb6f88b55


https://github.com/user-attachments/assets/3b979f91-be53-41f8-954b-5354f91a83bc


