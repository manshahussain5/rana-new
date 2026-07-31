// Email Service for Job Application Platform
// This service handles sending application data to admin email using EmailJS

class EmailService {
    constructor() {
        this.adminEmail = 'Mycareerofficial01@gmail.com';
        this.serviceName = 'Job Application Platform';
        
        // EmailJS Configuration
        this.emailjsConfig = {
            publicKey: 'VytnShF12hPu0xzAl',
            serviceId: 'service_4pahu0q',
            templateId: 'template_cp8a2bc'
        };
        
        // Initialize EmailJS
        this.initializeEmailJS();
    }
    
    // Initialize EmailJS
    initializeEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.emailjsConfig.publicKey);
            console.log('EmailJS initialized successfully');
            console.log('EmailJS config:', this.emailjsConfig);
        } else {
            console.error('EmailJS not loaded');
        }
    }

    // Send application data via email using EmailJS
    async sendApplication(applicationData) {
        try {
            console.log('Sending application via EmailJS...', applicationData);
            
            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                console.warn('EmailJS not available, falling back to mailto');
                return await this.fallbackEmailMethod(applicationData);
            }
            
            // Prepare template parameters for EmailJS
            // Note: EmailJS templates need specific parameter names for recipients
            const templateParams = {
                to_email: this.adminEmail,
                to_name: 'Admin', // Add recipient name
                from_name: applicationData.applicantName, // Sender name
                from_email: applicationData.applicantEmail, // Sender email
                reply_to: applicationData.applicantEmail, // Reply-to email
                job_title: applicationData.jobTitle,
                company: applicationData.company,
                location: applicationData.location || 'Not specified',
                salary: applicationData.salary || 'Not specified',
                applicant_name: applicationData.applicantName,
                father_name: applicationData.fatherName,
                date_of_birth: applicationData.dateOfBirth,
                cnic_number: applicationData.cnicNumber,
                contact_number: applicationData.contactNumber,
                gender: applicationData.gender,
                applicant_email: applicationData.applicantEmail,
                address: applicationData.address,
                education: applicationData.education,
                experience: applicationData.applicantExperience,
                skills: applicationData.skills,
                shift_available: applicationData.shiftAvailable || 'Not specified',
                expected_salary: applicationData.expectedSalary || 'Not specified',
                cover_letter: applicationData.coverLetter || 'No cover letter provided',
                cv_file: applicationData.cvFile,
                payment_proof: applicationData.paymentScreenshot,
                application_date: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Karachi',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }),
                application_id: this.generateApplicationId(),
                subject: `New Job Application - ${applicationData.jobTitle}`,
                message: `New job application received for ${applicationData.jobTitle} at ${applicationData.company}`
            };
            
            // Send email using EmailJS
            console.log('Sending with EmailJS:', {
                serviceId: this.emailjsConfig.serviceId,
                templateId: this.emailjsConfig.templateId,
                templateParams: templateParams
            });
            
            const response = await emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                templateParams
            );
            
            console.log('EmailJS response:', response);
            console.log('EmailJS response status:', response.status);
            console.log('EmailJS response text:', response.text);
            
            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Application submitted successfully! We have received your application and will contact you soon.',
                    method: 'emailjs'
                };
            } else {
                throw new Error('EmailJS returned non-200 status: ' + response.status + ', text: ' + response.text);
            }
            
        } catch (error) {
            console.error('EmailJS error:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                text: error.text,
                stack: error.stack
            });
            
            // Fallback to alternative methods
            return await this.fallbackEmailMethod(applicationData);
        }
    }
    
    // Send contact form data via email using EmailJS
    async sendContactForm(contactData) {
        try {
            console.log('Sending contact form via EmailJS...', contactData);

            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                console.warn('EmailJS not available, falling back to mailto');
                return await this.fallbackContactMethod(contactData);
            }

            // Prepare template parameters for EmailJS
            const templateParams = {
                to_email: this.adminEmail,
                to_name: 'Admin',
                from_name: contactData.name,
                from_email: contactData.email,
                reply_to: contactData.email,
                subject: `Contact Form: ${contactData.subject}`,
                message: contactData.message,
                contact_name: contactData.name,
                contact_email: contactData.email,
                contact_subject: contactData.subject,
                contact_message: contactData.message,
                contact_date: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Karachi',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            };

            // Send email using EmailJS
            console.log('Sending contact form with EmailJS:', {
                serviceId: this.emailjsConfig.serviceId,
                templateId: this.emailjsConfig.templateId,
                templateParams: templateParams
            });

            const response = await emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                templateParams
            );

            console.log('Contact form EmailJS response:', response);

            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Message sent successfully! We will get back to you soon.',
                    method: 'emailjs'
                };
            } else {
                throw new Error('EmailJS returned non-200 status: ' + response.status + ', text: ' + response.text);
            }

        } catch (error) {
            console.error('Contact form EmailJS error:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                text: error.text,
                stack: error.stack
            });

            // Fallback to alternative methods
            return await this.fallbackContactMethod(contactData);
        }
    }

    // Fallback contact method when EmailJS fails
    async fallbackContactMethod(contactData) {
        try {
            // Create mailto link as fallback
            const subject = encodeURIComponent(`Contact Form: ${contactData.subject}`);
            const body = encodeURIComponent(
                `Name: ${contactData.name}\n` +
                `Email: ${contactData.email}\n` +
                `Subject: ${contactData.subject}\n\n` +
                `Message:\n${contactData.message}`
            );
            
            const mailtoLink = `mailto:${this.adminEmail}?subject=${subject}&body=${body}`;
            
            // Try to open mailto link
            window.open(mailtoLink, '_blank');
            
            return {
                success: true,
                message: 'Your default email client should open. If not, please email us directly at ' + this.adminEmail,
                method: 'mailto'
            };
            
        } catch (error) {
            console.error('Contact form fallback error:', error);
            return {
                success: false,
                message: 'Failed to send message. Please try again or contact us directly at ' + this.adminEmail,
                method: 'fallback'
            };
        }
    }

    // Fallback email method when EmailJS fails
    async fallbackEmailMethod(applicationData) {
        try {
            // Method 1: Try to open email client with mailto
            const mailtoSuccess = this.createMailtoLink(applicationData);
            
            if (mailtoSuccess) {
                return {
                    success: true,
                    message: 'Application opened in your email client. Please send the email to complete your application.',
                    method: 'mailto'
                };
            }
            
            // Method 2: Fallback to clipboard copy
            const emailContent = this.formatApplicationForEmail(applicationData);
            
            try {
                await navigator.clipboard.writeText(emailContent);
                return {
                    success: true,
                    message: 'Application details copied to clipboard. Please paste them in an email and send to ' + this.adminEmail,
                    method: 'clipboard'
                };
            } catch (clipboardError) {
                console.warn('Clipboard access failed:', clipboardError);
                
                // Method 3: Show modal with content for manual copying
                this.showEmailContentModal(emailContent);
                return {
                    success: true,
                    message: 'Please copy the application details and send them to ' + this.adminEmail,
                    method: 'modal'
                };
            }
            
        } catch (error) {
            console.error('Fallback email method error:', error);
            return {
                success: false,
                message: 'Failed to send application. Please try again or contact support.',
                error: error.message
            };
        }
    }

    // Create mailto link
    createMailtoLink(data) {
        try {
            const subject = `New Job Application - ${data.jobTitle}`;
            const body = this.formatApplicationForEmail(data);
            
            const mailtoLink = `mailto:${this.adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Try to open email client
            const emailWindow = window.open(mailtoLink, '_blank');
            
            if (emailWindow) {
                // Close the window after a short delay
                setTimeout(() => {
                    try {
                        emailWindow.close();
                    } catch (e) {
                        // Ignore errors when closing window
                    }
                }, 1000);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Mailto creation failed:', error);
            return false;
        }
    }

    // Format application data for email
    formatApplicationForEmail(data) {
        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Karachi',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        return `
NEW JOB APPLICATION RECEIVED
============================

Job Details:
------------
Position: ${data.jobTitle}
Company: ${data.company}
Location: ${data.location || 'Not specified'}
Salary: ${data.salary || 'Not specified'}

Applicant Information:
---------------------
Name: ${data.applicantName}
Father's Name: ${data.fatherName}
Date of Birth: ${data.dateOfBirth}
CNIC: ${data.cnicNumber}
Contact: ${data.contactNumber}
Email: ${data.applicantEmail}
Gender: ${data.gender}
Address: ${data.address}

Professional Details:
--------------------
Education: ${data.education}
Experience: ${data.applicantExperience}
Skills: ${data.skills}
Available for listed shift: ${data.shiftAvailable || 'Not specified'}
Expected Salary: ${data.expectedSalary || 'Not specified'}

Cover Letter:
------------
${data.coverLetter || 'No cover letter provided'}

Documents:
----------
CV: ${data.cvFile}
Payment Proof: ${data.paymentScreenshot}

Application Details:
-------------------
Submitted: ${timestamp}
Application ID: ${this.generateApplicationId()}
Platform: ${this.serviceName}

---
This application was submitted through the My Career job platform.
Please review the application and contact the candidate if suitable.

Best regards,
My Career Platform
        `.trim();
    }

    // Generate unique application ID
    generateApplicationId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `APP-${timestamp}-${random}`.toUpperCase();
    }

    // Show email content modal for manual copying
    showEmailContentModal(content) {
        // Remove existing modal if any
        const existingModal = document.getElementById('emailContentModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'emailContentModal';
        modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
                <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-2xl font-bold text-gray-800">Application Details</h3>
                    <button onclick="emailService.closeEmailContentModal()" class="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-6 flex-1 overflow-y-auto">
                    <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p class="text-blue-800 font-medium">Please copy the content below and send it to: <strong>${this.adminEmail}</strong></p>
                    </div>
                    <textarea id="emailContentText" class="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm" readonly>${content}</textarea>
                </div>
                <div class="p-6 border-t border-gray-200 flex gap-4">
                    <button onclick="emailService.copyEmailContent()" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Copy to Clipboard
                    </button>
                    <button onclick="emailService.closeEmailContentModal()" class="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal
        modal.classList.remove('hide');
        modal.classList.add('show');
        
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
    }

    // Close email content modal
    closeEmailContentModal() {
        const modal = document.getElementById('emailContentModal');
        if (modal) {
            modal.classList.remove('show');
            modal.classList.add('hide');
            
            // Unlock body scroll
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
            
            // Remove modal after animation
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    // Copy email content to clipboard
    async copyEmailContent() {
        const textarea = document.getElementById('emailContentText');
        if (textarea) {
            try {
                textarea.select();
                await navigator.clipboard.writeText(textarea.value);
                this.showMessage('Content copied to clipboard!', 'success');
            } catch (error) {
                // Fallback for older browsers
                document.execCommand('copy');
                this.showMessage('Content copied to clipboard!', 'success');
            }
        }
    }

    // Show message to user
    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg`;
        messageDiv.textContent = message;
        
        // Style based on type
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d1fae5';
            messageDiv.style.color = '#065f46';
            messageDiv.style.border = '1px solid #a7f3d0';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#fee2e2';
            messageDiv.style.color = '#991b1b';
            messageDiv.style.border = '1px solid #fca5a5';
        }
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Update admin email
    setAdminEmail(email) {
        this.adminEmail = email;
        console.log('Admin email updated to:', email);
    }

    // Get current admin email
    getAdminEmail() {
        return this.adminEmail;
    }
}

// Create global email service instance
window.emailService = new EmailService();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}