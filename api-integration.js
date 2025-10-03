// API Integration for Job Seeker Platform
// Replace the existing API calls in script.js with these functions

class JobSeekerAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.authToken = localStorage.getItem('authToken');
    }

    // Set authentication token
    setAuthToken(token) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
    }

    // Clear authentication
    clearAuth() {
        this.authToken = null;
        localStorage.removeItem('authToken');
    }

    // Make authenticated request
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    async login(email, password) {
        const data = await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.success) {
            this.setAuthToken(data.data.token);
            currentUser = data.data.user;
        }
        
        return data;
    }

    async register(email, password, role = 'admin') {
        return await this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });
    }

    async verifyToken() {
        try {
            const data = await this.makeRequest('/auth/verify');
            if (data.success) {
                currentUser = data.data;
                return true;
            }
        } catch (error) {
            this.clearAuth();
            return false;
        }
    }

    // Jobs
    async getJobs(page = 1, limit = 10, filters = {}) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });
        
        return await this.makeRequest(`/jobs?${params}`);
    }

    async getJob(id) {
        return await this.makeRequest(`/jobs/${id}`);
    }

    async createJob(jobData) {
        return await this.makeRequest('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData)
        });
    }

    async updateJob(id, jobData) {
        return await this.makeRequest(`/jobs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(jobData)
        });
    }

    async deleteJob(id) {
        return await this.makeRequest(`/jobs/${id}`, {
            method: 'DELETE'
        });
    }

    // Applications
    async submitApplication(applicationData) {
        const formData = new FormData();
        
        // Add text fields
        Object.keys(applicationData).forEach(key => {
            if (key !== 'cvFile' && key !== 'paymentProof') {
                formData.append(key, applicationData[key]);
            }
        });

        // Add files
        if (applicationData.cvFile) {
            formData.append('cvFile', applicationData.cvFile);
        }
        if (applicationData.paymentProof) {
            formData.append('paymentProof', applicationData.paymentProof);
        }

        const response = await fetch(`${this.baseURL}/applications`, {
            method: 'POST',
            headers: {
                ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
            },
            body: formData
        });

        return await response.json();
    }

    async getApplications(page = 1, limit = 10, status = null) {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(status && { status })
        });
        
        return await this.makeRequest(`/applications?${params}`);
    }

    async getApplication(id) {
        return await this.makeRequest(`/applications/${id}`);
    }

    async updateApplicationStatus(id, status, reviewNotes = '') {
        return await this.makeRequest(`/applications/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, reviewNotes })
        });
    }

    // Admin
    async getAdminStats() {
        return await this.makeRequest('/admin/stats');
    }

    async getRecentApplications(limit = 5) {
        return await this.makeRequest(`/admin/recent-applications?limit=${limit}`);
    }

    async getRecentJobs(limit = 5) {
        return await this.makeRequest(`/admin/recent-jobs?limit=${limit}`);
    }
}

// Initialize API
const api = new JobSeekerAPI();

// Updated functions to use API
async function loadJobs() {
    try {
        const response = await api.getJobs(1, 20);
        if (response.success) {
            jobs = response.data;
            displayJobs();
        }
    } catch (error) {
        console.error('Failed to load jobs:', error);
        // Fallback to sample data
        displayJobs();
    }
}

async function loadApplications() {
    try {
        const response = await api.getApplications(1, 50);
        if (response.success) {
            applications = response.data;
            loadAdminApplications();
        }
    } catch (error) {
        console.error('Failed to load applications:', error);
        loadAdminApplications();
    }
}

async function submitApplication(applicationData) {
    try {
        const response = await api.submitApplication(applicationData);
        if (response.success) {
            alert('Application submitted successfully!');
            closeApplicationModal();
        } else {
            alert('Failed to submit application: ' + response.message);
        }
    } catch (error) {
        alert('Error submitting application: ' + error.message);
    }
}

async function addJob(jobData) {
    try {
        const response = await api.createJob(jobData);
        if (response.success) {
            alert('Job added successfully!');
            closeAddJobModal();
            loadJobs();
        } else {
            alert('Failed to add job: ' + response.message);
        }
    } catch (error) {
        alert('Error adding job: ' + error.message);
    }
}

async function approveApplication(applicationId) {
    try {
        const response = await api.updateApplicationStatus(applicationId, 'approved');
        if (response.success) {
            alert('Application approved successfully!');
            loadApplications();
            closeViewApplicationModal();
        } else {
            alert('Failed to approve application: ' + response.message);
        }
    } catch (error) {
        alert('Error approving application: ' + error.message);
    }
}

async function rejectApplication(applicationId) {
    try {
        const response = await api.updateApplicationStatus(applicationId, 'rejected');
        if (response.success) {
            alert('Application rejected.');
            loadApplications();
            closeViewApplicationModal();
        } else {
            alert('Failed to reject application: ' + response.message);
        }
    } catch (error) {
        alert('Error rejecting application: ' + error.message);
    }
}

// Initialize app with API
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is authenticated
    const isAuthenticated = await api.verifyToken();
    
    // Load initial data
    await loadJobs();
    
    // If authenticated, load admin data
    if (isAuthenticated) {
        await loadApplications();
    }
});
