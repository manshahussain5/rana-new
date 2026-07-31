// Job Seeker Platform - Main JavaScript File

// Global state
let currentJob = null;
let jobs = [];
let applications = [
    {
        id: 1,
        applicantName: "Ahmed Ali",
        jobTitle: "Senior Software Engineer",
        applicantEmail: "ahmed.ali@email.com",
        contactNo: "+92-300-1234567",
        fatherName: "Muhammad Ali",
        dateOfBirth: "1990-05-15",
        cnicNo: "12345-1234567-1",
        gender: "Male",
        education: "BS Computer Science",
        experience: "5 years",
        skills: "JavaScript, React, Node.js, Python, SQL",
        address: "House 123, Street 45, I-8 Islamabad",
        additionalInfo: "Experienced full-stack developer with strong problem-solving skills and team leadership experience.",
        cvFile: "ahmed_ali_cv.pdf",
        paymentProof: "payment_proof_001.jpg",
        appliedDate: "2024-01-15",
        status: "pending"
    },
    {
        id: 2,
        applicantName: "Sara Khan",
        jobTitle: "Marketing Manager",
        applicantEmail: "sara.khan@email.com",
        contactNo: "+92-301-9876543",
        fatherName: "Hassan Khan",
        dateOfBirth: "1988-03-22",
        cnicNo: "23456-2345678-2",
        gender: "Female",
        education: "MBA Marketing",
        experience: "7 years",
        skills: "Digital Marketing, SEO, Social Media, Content Strategy, Analytics",
        address: "Apartment 456, Block C, I-8 Islamabad",
        additionalInfo: "Creative marketing professional with proven track record in digital campaigns and brand management.",
        cvFile: "sara_khan_cv.pdf",
        paymentProof: "payment_proof_002.jpg",
        appliedDate: "2024-01-14",
        status: "approved"
    },
    {
        id: 3,
        applicantName: "Muhammad Hassan",
        jobTitle: "Data Analyst",
        applicantEmail: "m.hassan@email.com",
        contactNo: "+92-302-5555555",
        fatherName: "Abdul Rahman",
        dateOfBirth: "1992-11-08",
        cnicNo: "34567-3456789-3",
        gender: "Male",
        education: "MS Statistics",
        experience: "3 years",
        skills: "Python, R, SQL, Tableau, Machine Learning, Excel",
        address: "Villa 789, Sector F-8, Islamabad",
        additionalInfo: "Data-driven analyst with expertise in statistical modeling and business intelligence.",
        cvFile: "muhammad_hassan_cv.pdf",
        paymentProof: "payment_proof_003.jpg",
        appliedDate: "2024-01-13",
        status: "rejected"
    },
    {
        id: 4,
        applicantName: "Fatima Ahmed",
        jobTitle: "UI/UX Designer",
        applicantEmail: "fatima.ahmed@email.com",
        contactNo: "+92-303-7777777",
        fatherName: "Ahmed Ali",
        dateOfBirth: "1995-07-30",
        cnicNo: "45678-4567890-4",
        gender: "Female",
        education: "BFA Graphic Design",
        experience: "4 years",
        skills: "Figma, Adobe Creative Suite, Sketch, Prototyping, User Research",
        address: "House 321, Street 12, I-8 Islamabad",
        additionalInfo: "Creative designer passionate about user-centered design and creating intuitive digital experiences.",
        cvFile: "fatima_ahmed_cv.pdf",
        paymentProof: "payment_proof_004.jpg",
        appliedDate: "2024-01-12",
        status: "pending"
    },
    {
        id: 5,
        applicantName: "Ali Raza",
        jobTitle: "Project Manager",
        applicantEmail: "ali.raza@email.com",
        contactNo: "+92-304-9999999",
        fatherName: "Raza Muhammad",
        dateOfBirth: "1987-12-14",
        cnicNo: "56789-5678901-5",
        gender: "Male",
        education: "MS Project Management",
        experience: "8 years",
        skills: "Agile, Scrum, PMP, Risk Management, Team Leadership, Budget Planning",
        address: "Office 101, Business Center, I-8 Islamabad",
        additionalInfo: "Certified project manager with extensive experience in IT project delivery and team coordination.",
        cvFile: "ali_raza_cv.pdf",
        paymentProof: "payment_proof_005.jpg",
        appliedDate: "2024-01-11",
        status: "approved"
    }
];

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Authentication
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// API Helper Functions
async function makeAPIRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
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

// Authentication Functions
async function loginAdmin(email, password) {
    try {
        // Mock admin login for testing (remove this when backend is properly set up)
        if (email === 'admin@mycareer.com' && password === 'admin123') {
            authToken = 'mock_admin_token_' + Date.now();
            localStorage.setItem('authToken', authToken);
            currentUser = {
                id: 'admin_001',
                email: 'admin@mycareer.com',
                role: 'admin'
            };
            return true;
        }
        
        // Try real API call if mock login fails
        const data = await makeAPIRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.success) {
            authToken = data.data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = data.data.user;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
}

async function verifyAuth() {
    try {
        const data = await makeAPIRequest('/auth/verify');
        if (data.success) {
            currentUser = data.data;
            return true;
        }
    } catch (error) {
        authToken = null;
        localStorage.removeItem('authToken');
        return false;
    }
}

// Fixed job data - 27 pre-configured jobs
const fixedJobs = [
    {
        id: 3,
        title: 'Regional Sales Manager',
        titleUrdu: 'ریجنل سیلز مینیجر',
        company: 'Sales Corporation',
        location: 'Punjab',
        type: 'full-time',
        category: 'sales',
        salary: '75,000 - 90,000 PKR',
        experience: '1 year',
        description: 'Lead sales operations and drive revenue growth.',
        requirements: 'Bachelors degree, sales management experience.',
        featured: false,
        postedDate: new Date('2024-01-18'),
        applications: 7
    },
    {
        id: 5,
        title: 'Receptionist Female Only',
        titleUrdu: 'ریسپشنسٹ (صرف خواتین)',
        company: 'Corporate Office',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '45,000 - 55,000 PKR',
        experience: '0-6 months',
        description: 'Handle visitors and provide administrative support.',
        requirements: 'Matric, 1+ years experience.',
        featured: false,
        postedDate: new Date('2024-01-25'),
        applications: 10
    },
    {
        id: 6,
        title: 'Computer Operator',
        titleUrdu: 'کمپیوٹر آپریٹر',
        company: 'IT Services',
        location: 'Punjab',
        type: 'full-time',
        category: 'technology',
        salary: '32,000 - 40,000 PKR',
        experience: '0-6 months',
        description: 'Handle data entry and system monitoring.',
        requirements: 'Matric, 1+ years computer experience.',
        featured: false,
        postedDate: new Date('2024-01-28'),
        applications: 22
    },
    {
        id: 7,
        title: 'Field Supervisor',
        titleUrdu: 'فیلڈ سپروائزر',
        company: 'Construction Group',
        location: 'Punjab',
        type: 'full-time',
        category: 'construction',
        salary: '70,000 - 85,000 PKR',
        experience: '6 months - 1 year',
        description: 'Supervise construction operations and manage workers.',
        requirements: 'Civil Engineering degree, 3+ years experience.',
        featured: false,
        postedDate: new Date('2024-01-30'),
        applications: 7
    },
    {
        id: 8,
        title: 'Assistant Accountant',
        titleUrdu: 'اسسٹنٹ اکاؤنٹنٹ',
        company: 'Finance Solutions',
        location: 'Punjab',
        type: 'full-time',
        category: 'finance',
        salary: '40,000 - 55,000 PKR',
        experience: '6 months - 1 year',
        description: 'Support accounting operations and bookkeeping.',
        requirements: 'Bachelor degree, 1+ years experience.',
        featured: false,
        postedDate: new Date('2024-02-01'),
        applications: 10
    },
    {
        id: 9,
        title: 'Accountant',
        titleUrdu: 'اکاؤنٹنٹ',
        company: 'Financial Services',
        location: 'Punjab',
        type: 'full-time',
        category: 'finance',
        salary: '60,000 - 75,000 PKR',
        experience: '0-1 years',
        description: 'Handle financial reporting and tax preparation.',
        requirements: 'B.Com or BBA, 1+ years experience.',
        featured: false,
        postedDate: new Date('2024-02-03'),
        applications: 6
    },
    {
        id: 12,
        title: 'Customer Service Representative (CSR)',
        titleUrdu: 'کسٹمر سروس ریپریزنٹیٹو',
        company: 'Service Center',
        location: 'Punjab',
        type: 'full-time',
        category: 'customer-service',
        salary: '30,000 - 45,000 PKR',
        experience: '0-6 months',
        description: 'Provide customer support via phone and email.',
        requirements: 'Matric, 1+ years experience.',
        featured: false,
        postedDate: new Date('2024-02-09'),
        applications: 25
    },
    {
        id: 13,
        title: 'Office Boy',
        titleUrdu: 'آفس بوائے',
        company: 'Corporate Services',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '35,000 - 40,000 PKR',
        experience: '0-1 years',
        description: 'Provide office support and maintenance.',
        requirements: 'Matric, physical fitness.',
        featured: true,
        postedDate: new Date('2024-02-11'),
        applications: 36
    },
    {
        id: 15,
        title: 'Office Assistant',
        titleUrdu: 'آفس اسسٹنٹ',
        company: 'Business Solutions',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '35,000 - 45,000 PKR',
        experience: '0-6 months',
        description: 'Provide administrative support and data entry.',
        requirements: 'Matric, 1+ years office experience.',
        featured: true,
        postedDate: new Date('2024-02-15'),
        applications: 9
    },
    {
        id: 18,
        title: 'Cashier',
        titleUrdu: 'کیشئر',
        company: 'Retail Store',
        location: 'Punjab',
        type: 'full-time',
        category: 'retail',
        salary: '40,000 - 45,000 PKR',
        experience: '0-6 months',
        description: 'Handle cash transactions and customer service.',
        requirements: 'Matric or Intermediate, 1+ years cashier experience.',
        featured: true,
        postedDate: new Date('2024-02-21'),
        applications: 12
    },
    {
        id: 19,
        title: 'Data Entry Operator',
        titleUrdu: 'ڈیٹا انٹری آپریٹر',
        company: 'Data Services',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '30,000 - 40,000 PKR',
        experience: '0-6 months',
        description: 'Perform data entry tasks and maintain databases.',
        requirements: 'Matric or Intermediate, 1+ years data entry experience.',
        featured: false,
        postedDate: new Date('2024-02-23'),
        applications: 20
    },
    {
        id: 21,
        title: 'Makeup Artist',
        titleUrdu: 'میک اپ آرٹسٹ',
        company: 'Beauty Studio',
        location: 'Jhang',
        type: 'full-time',
        category: 'beauty',
        salary: '100,000 - 130,000 PKR',
        experience: '6 months - 1 year',
        description: 'Provide professional makeup services for events.',
        requirements: 'Makeup certification, 3+ years experience.',
        featured: false,
        postedDate: new Date('2024-02-27'),
        applications: 7
    },
    {
        id: 22,
        title: 'Content Writer',
        titleUrdu: 'کنٹینٹ رائٹر',
        company: 'Media House',
        location: 'Multan',
        type: 'full-time',
        category: 'marketing',
        salary: '55,000 - 65,000 PKR',
        experience: '6 months - 1 year',
        description: 'Create content for blogs, websites, and social media.',
        requirements: 'English/Journalism degree, 2+ years writing experience.',
        featured: false,
        postedDate: new Date('2024-03-01'),
        applications: 11
    },
    {
        id: 25,
        title: 'Office Manager',
        titleUrdu: 'آفس مینیجر',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '70,000 - 85,000 PKR',
        experience: '0-1 years',
        description: 'Oversee office operations, coordinate teams, and ensure efficient workflows.',
        requirements: 'Bachelor degree preferred, strong coordination and communication skills.',
        featured: true,
        postedDate: new Date(),
        applications: 5
    },
    {
        id: 26,
        title: 'Assistant Private Secretary',
        titleUrdu: 'اسسٹنٹ پرائیویٹ سیکرٹری',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '40,000 - 55,000 PKR',
        experience: '0-1 years',
        description: 'Assist executives with scheduling, correspondence, and documentation.',
        requirements: 'Intermediate, strong organizational skills; proficiency with MS Office.',
        featured: false,
        postedDate: new Date(),
        applications: 6
    },
    {
        id: 28,
        title: 'Driver',
        titleUrdu: 'ڈرائیور',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '30,000 - 40,000 PKR',
        experience: '0-1 years',
        description: 'Provide safe and timely transportation services as assigned.',
        requirements: 'Valid driving license and clean driving record.',
        featured: false,
        postedDate: new Date(),
        applications: 33
    },
    {
        id: 29,
        title: 'Manager Warehouse',
        titleUrdu: 'مینیجر ویئر ہاؤس',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '55,000 - 70,000 PKR',
        experience: '0-1 years',
        description: 'Manage warehouse operations, inventory, and staff coordination.',
        requirements: 'Intermediate, knowledge of inventory systems; leadership and planning skills.',
        featured: true,
        postedDate: new Date(),
        applications: 14
    },
    {
        id: 30,
        title: 'Data Manager',
        titleUrdu: 'ڈیٹا مینیجر',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'technology',
        salary: '50,000 - 70,000 PKR',
        experience: '0-1 years',
        description: 'Oversee data collection, storage, and reporting processes.',
        requirements: 'Intermediate, experience with databases and data quality practices.',
        featured: false,
        postedDate: new Date(),
        applications: 15
    },
    {
        id: 32,
        title: 'Social Media Manager',
        titleUrdu: 'سوشل میڈیا مینیجر',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'marketing',
        salary: '45,000 - 60,000 PKR',
        experience: '0-1 years',
        description: 'Plan and execute social media strategies and content.',
        requirements: 'Knowledge of social platforms and content planning.',
        featured: false,
        postedDate: new Date(),
        applications: 2
    },
    {
        id: 33,
        title: 'Assistant',
        titleUrdu: 'اسسٹنٹ',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '35,000 - 45,000 PKR',
        experience: '0-1 years',
        description: 'General assistance for office operations and documentation.',
        requirements: 'Bachelor degree, Good communication and basic computer skills.',
        featured: false,
        postedDate: new Date(),
        applications: 5
    },
    {
        id: 34,
        title: 'Security Guard',
        titleUrdu: 'سیکیورٹی گارڈ',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '30,000 - 40,000 PKR',
        experience: '0-1 years',
        description: 'Ensure safety and security of premises and personnel.',
        requirements: 'Physically fit, vigilance and discipline.',
        featured: true,
        postedDate: new Date(),
        applications: 60
    },
    {
        id: 35,
        title: 'Junior Assistant',
        titleUrdu: 'جونیئر اسسٹنٹ',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '35,000 - 45,000 PKR',
        experience: '0-1 years',
        description: 'Support administrative tasks and maintain records.',
        requirements: 'Intermediate, Basic MS Office skills and attention to detail.',
        featured: false,
        postedDate: new Date(),
        applications: 11
    },
    {
        id: 37,
        title: 'Admin Officer',
        titleUrdu: 'ایڈمن آفیسر',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '45,000 - 60,000 PKR',
        experience: '0-1 years',
        description: 'Oversee administrative duties and support management.',
        requirements: 'Bachelor degree, Excellent coordination and communication skills.',
        featured: false,
        postedDate: new Date(),
        applications: 1
    },
    {
        id: 38,
        title: 'Office Assistant + Record Keeper',
        titleUrdu: 'آفس اسسٹنٹ + ریکارڈ کیپر',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '35,000 - 45,000 PKR',
        experience: '0-1 years',
        description: 'Maintain records and assist with daily office tasks.',
        requirements: 'Intermediate, Record keeping and MS Office proficiency.',
        featured: false,
        postedDate: new Date(),
        applications: 15
    },
    {
        id: 39,
        title: 'Operation Controller',
        titleUrdu: 'آپریشن کنٹرولر',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '50,000 - 65,000 PKR',
        experience: '0-1 years',
        description: 'Monitor and control daily operations and reporting.',
        requirements: 'Bachelor degree, Analytical mindset; coordination across teams.',
        featured: false,
        postedDate: new Date(),
        applications: 8
    },
    {
        id: 40,
        title: 'Production Manager',
        titleUrdu: 'پروڈکشن مینیجر',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'administration',
        salary: '70,000 - 90,000 PKR',
        experience: '0-1 years',
        description: 'Plan and manage production schedules and teams.',
        requirements: 'Intermediate, Leadership and coordination skills.',
        featured: false,
        postedDate: new Date(),
        applications: 6
    },
    {
        id: 41,
        title: 'Sales Man',
        titleUrdu: 'سیلز مین',
        company: 'MyCareer Network',
        location: 'Punjab',
        type: 'full-time',
        category: 'sales',
        salary: '40,000 - 55,000 PKR',
        experience: '0-1 years',
        description: 'Handle sales operations, customer interaction, and targets.',
        requirements: 'Matric, Good communication and basic sales knowledge.',
        featured: false,
        postedDate: new Date(),
        applications: 50
    }
];

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showMessage('Network error. Please try again.', 'error');
        throw error;
    }
}

// Utility Functions
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of main content
    const main = document.querySelector('main');
    main.insertBefore(messageDiv, main.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getDaysAgo(date) {
    return Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
}

// Navigation Functions
function showHome() {
    console.log('showHome() called');
    hideAllPages();
    const homePage = document.getElementById('homePage');
    if (homePage) {
        homePage.classList.remove('hidden');
        homePage.classList.add('fade-in');
        console.log('Home page shown');
    } else {
        console.error('Home page element not found');
    }
    loadFeaturedJobs();
    updateStats();
    closeMobileMenu();
}

function showJobs() {
    console.log('showJobs() called');
    hideAllPages();
    const jobsPage = document.getElementById('jobsPage');
    if (jobsPage) {
        jobsPage.classList.remove('hidden');
        jobsPage.classList.add('fade-in');
        console.log('Jobs page shown');
    } else {
        console.error('Jobs page element not found');
    }
    loadAllJobs();
    closeMobileMenu();
}

function showAbout() {
    console.log('showAbout() called');
    hideAllPages();
    const aboutPage = document.getElementById('aboutPage');
    if (aboutPage) {
        aboutPage.classList.remove('hidden');
        aboutPage.classList.add('fade-in');
        console.log('About page shown');
    } else {
        console.error('About page element not found');
    }
    closeMobileMenu();
}

function showServices() {
    console.log('showServices() called');
    hideAllPages();
    const servicesPage = document.getElementById('servicesPage');
    if (servicesPage) {
        servicesPage.classList.remove('hidden');
        servicesPage.classList.add('fade-in');
        console.log('Services page shown');
    } else {
        console.error('Services page element not found');
    }
    closeMobileMenu();
}

function showContact() {
    console.log('showContact() called');
    hideAllPages();
    const contactPage = document.getElementById('contactPage');
    if (contactPage) {
        contactPage.classList.remove('hidden');
        contactPage.classList.add('fade-in');
        console.log('Contact page shown');
    } else {
        console.error('Contact page element not found');
    }
    closeMobileMenu();
}

// Admin dashboard removed - no longer needed with fixed jobs

function showFeaturedJobs() {
    showJobs();
    // Filter to show only featured jobs
    const featuredJobs = jobs.filter(job => job.featured);
    loadAllJobs(featuredJobs);
    closeMobileMenu();
}

function showRecentJobs() {
    showJobs();
    // Sort by date and show recent jobs
    const recentJobs = [...jobs].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    loadAllJobs(recentJobs);
    closeMobileMenu();
}

function hideAllPages() {
    const pages = ['homePage', 'jobsPage', 'aboutPage', 'servicesPage', 'contactPage'];
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('hidden');
            page.classList.remove('fade-in');
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}

// Enhanced Search Function
// Popular-search chips: drop the term into the hero search box and run the search
function quickSearch(term) {
    const input = document.getElementById('heroSearchInput');
    if (input) input.value = term;
    searchJobs();
}

function searchJobs() {
    const searchTerm = document.getElementById('heroSearchInput').value.toLowerCase();
    const locationFilter = document.getElementById('heroLocationFilter').value;
    const categoryFilter = document.getElementById('heroCategoryFilter').value;
    
    let filteredJobs = jobs;
    
    // Apply text search
    if (searchTerm.trim()) {
        filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        (job.titleUrdu || '').includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.category.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.requirements.toLowerCase().includes(searchTerm)
    );
    }
    
    // Apply location filter
    if (locationFilter) {
        filteredJobs = filteredJobs.filter(job => job.location === locationFilter);
    }
    
    // Apply category filter
    if (categoryFilter) {
        filteredJobs = filteredJobs.filter(job => job.category === categoryFilter);
    }
    
    showJobs();
    loadAllJobs(filteredJobs);
}

// Filter Functions
let currentFilters = {
    location: '',
    category: '',
    experience: '',
    salary: ''
};

function applyFilters() {
    // Get filter values
    currentFilters.location = document.getElementById('locationFilter').value;
    currentFilters.category = document.getElementById('categoryFilter').value;
    currentFilters.experience = document.getElementById('experienceFilter').value;
    currentFilters.salary = document.getElementById('salaryFilter').value;
    
    // Filter jobs based on selected criteria
    let filteredJobs = jobs.filter(job => {
        // Location filter
        if (currentFilters.location && job.location !== currentFilters.location) {
            return false;
        }
        
        // Category filter
        if (currentFilters.category && job.category !== currentFilters.category) {
            return false;
        }
        
        // Experience filter
        if (currentFilters.experience && job.experience !== currentFilters.experience) {
            return false;
        }
        
        // Salary filter
        if (currentFilters.salary) {
            const salaryRange = currentFilters.salary;
            const jobSalary = job.salary;
            
            if (salaryRange === '30-40') {
                if (!jobSalary.includes('30,000') && !jobSalary.includes('32,000') && !jobSalary.includes('35,000') && !jobSalary.includes('40,000')) {
                    return false;
                }
            } else if (salaryRange === '40-50') {
                if (!jobSalary.includes('40,000') && !jobSalary.includes('45,000') && !jobSalary.includes('50,000')) {
                    return false;
                }
            } else if (salaryRange === '50-60') {
                if (!jobSalary.includes('50,000') && !jobSalary.includes('55,000') && !jobSalary.includes('60,000')) {
                    return false;
                }
            } else if (salaryRange === '60-70') {
                if (!jobSalary.includes('60,000') && !jobSalary.includes('65,000') && !jobSalary.includes('70,000')) {
                    return false;
                }
            } else if (salaryRange === '70-80') {
                if (!jobSalary.includes('70,000') && !jobSalary.includes('75,000') && !jobSalary.includes('80,000')) {
                    return false;
                }
            } else if (salaryRange === '80-90') {
                if (!jobSalary.includes('80,000') && !jobSalary.includes('85,000') && !jobSalary.includes('90,000')) {
                    return false;
                }
            } else if (salaryRange === '90+') {
                if (!jobSalary.includes('90,000') && !jobSalary.includes('100,000') && !jobSalary.includes('130,000')) {
                    return false;
                }
            }
        }
        
        return true;
    });
    
    // Update active filters display
    updateActiveFiltersDisplay();
    
    // Load filtered jobs
    loadAllJobs(filteredJobs);
}

function clearFilters() {
    // Reset all filter selects
    document.getElementById('locationFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('experienceFilter').value = '';
    document.getElementById('salaryFilter').value = '';
    
    // Clear current filters
    currentFilters = {
        location: '',
        category: '',
        experience: '',
        salary: ''
    };
    
    // Clear active filters display
    document.getElementById('activeFilters').innerHTML = '';
    
    // Load all jobs
    loadAllJobs();
}

function showFeaturedOnly() {
    const featuredJobs = jobs.filter(job => job.featured);
    loadAllJobs(featuredJobs);
    
    // Update active filters display
    document.getElementById('activeFilters').innerHTML = `
        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Featured Jobs Only
            <button onclick="clearFilters()" class="ml-2 text-green-600 hover:text-green-800">×</button>
        </span>
    `;
}

function updateActiveFiltersDisplay() {
    const activeFiltersDiv = document.getElementById('activeFilters');
    let activeFiltersHTML = '';
    
    if (currentFilters.location) {
        activeFiltersHTML += `
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Location: ${currentFilters.location}
                <button onclick="removeFilter('location')" class="ml-2 text-blue-600 hover:text-blue-800">×</button>
            </span>
        `;
    }
    
    if (currentFilters.category) {
        const categoryName = currentFilters.category.charAt(0).toUpperCase() + currentFilters.category.slice(1).replace('-', ' ');
        activeFiltersHTML += `
            <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Category: ${categoryName}
                <button onclick="removeFilter('category')" class="ml-2 text-purple-600 hover:text-purple-800">×</button>
            </span>
        `;
    }
    
    if (currentFilters.experience) {
        activeFiltersHTML += `
            <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                Experience: ${currentFilters.experience}
                <button onclick="removeFilter('experience')" class="ml-2 text-orange-600 hover:text-orange-800">×</button>
            </span>
        `;
    }
    
    if (currentFilters.salary) {
        const salaryText = document.getElementById('salaryFilter').selectedOptions[0].text;
        activeFiltersHTML += `
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Salary: ${salaryText}
                <button onclick="removeFilter('salary')" class="ml-2 text-green-600 hover:text-green-800">×</button>
            </span>
        `;
    }
    
    activeFiltersDiv.innerHTML = activeFiltersHTML;
}

function removeFilter(filterType) {
    if (filterType === 'location') {
        document.getElementById('locationFilter').value = '';
        currentFilters.location = '';
    } else if (filterType === 'category') {
        document.getElementById('categoryFilter').value = '';
        currentFilters.category = '';
    } else if (filterType === 'experience') {
        document.getElementById('experienceFilter').value = '';
        currentFilters.experience = '';
    } else if (filterType === 'salary') {
        document.getElementById('salaryFilter').value = '';
        currentFilters.salary = '';
    }
    
    // Reapply filters
    applyFilters();
}


// Job Loading Functions
async function loadFeaturedJobs() {
    try {
        // Use fixed jobs data
        jobs = [...fixedJobs];
        // Normalize all job locations to Punjab
        jobs = jobs.map(job => ({ ...job, location: 'Punjab' }));
        console.log('Jobs loaded from fixed data:', jobs.length);
        
        // Show every job on the home page, with the featured ones listed first
        const homeJobs = [
            ...jobs.filter(job => job.featured),
            ...jobs.filter(job => !job.featured)
        ];
        const container = document.getElementById('featuredJobs');

        if (homeJobs.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center col-span-full">No jobs available at the moment.</p>';
        } else {
            container.innerHTML = homeJobs.map(job => createJobCard(job)).join('');
        }
    } catch (error) {
        console.error('Error loading featured jobs:', error);
        showMessage('Failed to load featured jobs', 'error');
    }
}

async function loadAllJobs(jobsList = null) {
    try {
        const jobsToDisplay = (jobsList || jobs).map(job => ({ ...job, location: 'Punjab' }));
        const container = document.getElementById('allJobs');
        const resultsSummary = document.getElementById('resultsSummary');
        
        // Update results summary
        if (resultsSummary) {
            const totalJobs = jobs.length;
            const filteredCount = jobsToDisplay.length;
            
            if (filteredCount === totalJobs) {
                resultsSummary.innerHTML = `<p>Showing all <strong>${totalJobs}</strong> jobs</p>`;
            } else {
                resultsSummary.innerHTML = `<p>Showing <strong>${filteredCount}</strong> of <strong>${totalJobs}</strong> jobs</p>`;
            }
        }
        
        if (jobsToDisplay.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-gray-400 mb-4">
                        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
                    <p class="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                    <button onclick="clearFilters()" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
                        Clear All Filters
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = jobsToDisplay.map(job => createJobCard(job, true)).join('');
        }
        
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        showMessage('Failed to load jobs', 'error');
    }
}

// Job Card Creation
function createJobCard(job, showFullDetails = false) {
    const daysAgo = getDaysAgo(job.postedDate);
    const normalizedJob = { ...job, location: 'Punjab' };
    
    return `
        <div class="job-card bg-white rounded-xl p-6 shadow-md hover-scale cursor-pointer" onclick="showJobDetails(${job.id})">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-800 mb-1">${normalizedJob.title}</h3>
                    ${normalizedJob.titleUrdu ? `<p class="text-lg text-gray-700 mb-2 text-left" dir="rtl">${normalizedJob.titleUrdu}</p>` : ''}
                    <p class="text-lg text-primary font-semibold mb-1">${normalizedJob.company}</p>
                    <div class="flex items-center text-gray-600 text-sm space-x-4">
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.899a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            ${normalizedJob.location}
                        </span>
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            ${normalizedJob.type.charAt(0).toUpperCase() + normalizedJob.type.slice(1).replace('-', ' ')}
                        </span>
                    </div>
                </div>
                ${normalizedJob.featured ? '<span class="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">Featured</span>' : ''}
            </div>
            
            <div class="mb-4">
                <p class="text-gray-600 text-sm line-clamp-3">${normalizedJob.description.substring(0, 120)}...</p>
            </div>
            
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                    <span class="font-semibold text-success">${normalizedJob.salary}</span>
                </div>
                <button onclick="event.stopPropagation(); showJobDetails(${normalizedJob.id})" class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                    View Details
                </button>
            </div>
        </div>
    `;
}

// Job Details Modal
function showJobDetails(jobId) {
    const job = { ...jobs.find(j => j.id === jobId), location: 'Punjab' };
    if (!job) {
        showMessage('Job not found!', 'error');
        return;
    }
    
    currentJob = job;
    const modal = document.getElementById('jobModal');
    const container = document.getElementById('jobDetails');
    
    if (!modal || !container) {
        showMessage('Modal elements not found!', 'error');
        return;
    }
    
    const daysAgo = getDaysAgo(job.postedDate);
    // Conditionally include advanced requirements based on job category/title
    const titleText = (job.title || '').toLowerCase();
    const categoryText = (job.category || '').toLowerCase();
    const isTechRole = categoryText === 'technology' || /developer|programmer|engineer|software|website|computer/.test(titleText);
    const isDataRole = /data manager|data analyst|data/.test(titleText) || categoryText === 'technology';
    const isFinanceRole = categoryText === 'finance' || /accountant|finance|accounts/.test(titleText);
    const shouldIncludeVersionControl = isTechRole;
    const shouldIncludeDatabase = isTechRole || isDataRole;
    const shouldIncludeSecurity = isTechRole || isFinanceRole;
    const extraRequirements = [];
    if (shouldIncludeVersionControl) {
        extraRequirements.push('Experience with version control systems (Git) and agile development methodologies');
    }
    if (shouldIncludeDatabase) {
        extraRequirements.push('Knowledge of database design and optimization techniques');
    }
    if (shouldIncludeSecurity) {
        extraRequirements.push('Understanding of security best practices and data protection regulations');
    }
    
    container.innerHTML = `
        <!-- Job Header Section -->
        <div class="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 mb-6 sm:mb-8">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div class="flex-1">
                    <div class="mb-4">
                        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">${job.title}</h1>
                        ${job.titleUrdu ? `<p class="text-xl sm:text-2xl text-gray-700 mb-2 text-left" dir="rtl">${job.titleUrdu}</p>` : ''}
                        <p class="text-lg sm:text-xl text-ntsBlue font-semibold">${job.company}</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="flex items-center text-gray-600 bg-gray-50 rounded-xl p-4">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.899a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Location</p>
                                <p class="font-semibold">${job.location}</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center text-gray-600 bg-gray-50 rounded-xl p-4">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Type</p>
                                <p class="font-semibold">${job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center text-gray-600 bg-gray-50 rounded-xl p-4">
                            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                    </div>
                            <div>
                                <p class="text-sm text-gray-500">Salary</p>
                                <p class="font-semibold">${job.salary}</p>
                </div>
                        </div>
                    </div>
                </div>
                
                <div class="lg:flex-shrink-0">
                    <button onclick="showApplicationModal()" class="w-full lg:w-auto bg-gradient-to-r from-ntsBlue600 to-ntsBlue800 text-white px-8 py-4 rounded-xl font-semibold hover:from-ntsBlue700 hover:to-ntsBlue900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    Apply Now
                </button>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 sm:mt-8">
            <div class="lg:col-span-2 space-y-8">
                <!-- Job Description Section -->
                <div class="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
                    <div class="flex items-center mb-6">
                        <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg sm:text-xl font-bold text-gray-800">Job Description</h3>
                    </div>
                    <div class="text-gray-600 leading-relaxed space-y-3">
                        ${job.description.split('\n').map(p => `<p class="text-sm sm:text-base">${p}</p>`).join('')}
                        <p class="text-sm sm:text-base">This is an excellent opportunity to join a dynamic team and contribute to innovative projects. We offer competitive compensation, comprehensive benefits, and a collaborative work environment that fosters professional growth and development.</p>
                        <p class="text-sm sm:text-base">The ideal candidate will be passionate about technology, have strong problem-solving skills, and be able to work effectively in a fast-paced environment. We value creativity, initiative, and the ability to work both independently and as part of a team.</p>
                        <p class="text-sm sm:text-base">If you are looking for a challenging and rewarding career opportunity, we encourage you to apply. We are committed to providing equal employment opportunities and fostering an inclusive workplace culture.</p>
                    </div>
                </div>
                
                <!-- Requirements Section -->
                <div class="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
                    <div class="flex items-center mb-6">
                        <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                    </div>
                        <h3 class="text-lg sm:text-xl font-bold text-gray-800">Requirements</h3>
                    </div>
                    <div class="text-gray-600 leading-relaxed space-y-2">
                        ${job.requirements.split('\n').map(p => `<div class="flex items-start">
                            <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p class="text-sm sm:text-base">${p}</p>
                        </div>`).join('')}
                        <div class="flex items-start">
                            <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p class="text-sm sm:text-base">Strong communication skills and ability to work in a team environment</p>
                        </div>
                        ${extraRequirements.map(r => `
                        <div class="flex items-start">
                            <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p class="text-sm sm:text-base">${r}</p>
                        </div>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="space-y-6">
                <!-- Job Summary Card -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div class="flex items-center mb-6">
                        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <h4 class="text-lg font-bold text-gray-800">Job Summary</h4>
                        </div>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-3 border-b border-gray-100">
                            <span class="text-gray-600 font-medium">Experience:</span>
                            <span class="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-sm">${job.experience}</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b border-gray-100">
                            <span class="text-gray-600 font-medium">Category:</span>
                            <span class="font-semibold text-gray-800 bg-blue-100 px-3 py-1 rounded-full text-sm capitalize">${job.category}</span>
                        </div>
                        <div class="flex justify-between items-center py-3">
                            <span class="text-gray-600 font-medium">Posts:</span>
                            <span class="font-semibold text-gray-800 bg-green-100 px-3 py-1 rounded-full text-sm">${job.applications}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Application Fee Card -->
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                    <div class="flex items-center mb-4">
                        <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                            </svg>
                        </div>
                        <h4 class="text-lg font-bold text-blue-900">Application Fee</h4>
                    </div>
                    <p class="text-blue-700 mb-4 leading-relaxed">A registration fee of <span class="font-bold text-blue-900 text-lg">PKR 500</span> is required to apply for this position.</p>
                    <button onclick="showApplicationModal()" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Apply with Fee
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hide');
    modal.classList.add('show');
    lockBodyScroll();
    
    // Force proper initialization of scrollable content
    setTimeout(() => {
        const scrollableContent = document.getElementById('jobDetails');
        if (scrollableContent) {
            // Force the element to recalculate its layout
            scrollableContent.style.overflow = 'hidden';
            scrollableContent.offsetHeight; // Force reflow
            scrollableContent.style.overflow = 'auto';
        }
    }, 50);
}

// Body scroll lock functions - disabled for main page scrolling
function lockBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
}

function unlockBodyScroll() {
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
}

function closeModal() {
    const modal = document.getElementById('jobModal');
    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hide');
        unlockBodyScroll();
        // Reset current job
        currentJob = null;
    }
}

// Application Modal Functions
function showApplicationModal() {
    if (!currentJob) {
        showMessage('No job selected!', 'error');
        return;
    }
    
    const modal = document.getElementById('applicationModal');
    if (!modal) {
        showMessage('Application modal not found!', 'error');
        return;
    }
    
    // Close job details modal if it's open
    const jobModal = document.getElementById('jobModal');
    if (jobModal && !jobModal.classList.contains('hide')) {
        jobModal.classList.add('hide');
        jobModal.classList.remove('show');
    }
    
    modal.classList.remove('hide');
    modal.classList.add('show');
    lockBodyScroll();
    
    // Reset form
    const form = document.getElementById('applicationForm');
    if (form) {
        form.reset();
    }
    
    // Update job title in modal
    const modalTitle = modal.querySelector('h3');
    if (modalTitle) {
        modalTitle.textContent = `Apply for ${currentJob.title}`;
    }
}

function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hide');
        unlockBodyScroll();
    }
}

// Navigate back to job details from application form
function backToJobDetails() {
    const applicationModal = document.getElementById('applicationModal');
    const jobModal = document.getElementById('jobModal');
    
    if (applicationModal && jobModal) {
        // Close application modal
        applicationModal.classList.add('hide');
        applicationModal.classList.remove('show');
        
        // Open job details modal
        jobModal.classList.remove('hide');
        jobModal.classList.add('show');
    }
}

// Close modal when clicking on backdrop
function closeModalOnBackdrop(event) {
    if (event.target === event.currentTarget) {
        closeModal();
    }
}

function closeApplicationModalOnBackdrop(event) {
    if (event.target === event.currentTarget) {
        closeApplicationModal();
    }
}

// Keyboard support for closing modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const jobModal = document.getElementById('jobModal');
        const appModal = document.getElementById('applicationModal');
        
        if (jobModal && jobModal.classList.contains('show')) {
            closeModal();
        } else if (appModal && appModal.classList.contains('show')) {
            closeApplicationModal();
        }
    }
});

// Admin access removed - no longer needed with fixed jobs

async function submitApplication(event) {
    console.log('Submit application function called');
            event.preventDefault();
    
    // Debug: Check if email service is available
    if (typeof window.emailService === 'undefined') {
        console.error('Email service not available');
        showMessage('Email service not available. Please refresh the page and try again.', 'error');
        return;
    }
    
    console.log('Email service available:', window.emailService);
    
    // Check if currentJob is set
    if (!currentJob) {
        console.log('No current job selected');
        showMessage('No job selected. Please try again.', 'error');
        return;
    }
    
    console.log('Current job:', currentJob);
    
    // The payment screenshot is the one mandatory field; everything else is optional.
    console.log('Validating...');

    const paymentField = document.getElementById('paymentScreenshot');
    if (!paymentField || !paymentField.files.length) {
        showMessage('Please upload your payment screenshot (PKR 500) — it is required.', 'error');
        return;
    }

    // Remaining formats are only checked when a value is actually present.

    const email = document.getElementById('applicantEmail').value.trim();
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
    }

    const phone = document.getElementById('contactNumber').value.trim();
    if (phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            showMessage('Please enter a valid phone number', 'error');
            return;
        }
    }

    const cnicRaw = (document.getElementById('cnicNumber').value || '').trim();
    if (cnicRaw) {
        const cnic = cnicRaw.replace(/\D/g, '');
        if (!/^[0-9]{13}$/.test(cnic)) {
            showMessage('Please enter a valid CNIC number (13 digits)', 'error');
            return;
        }
    }

    console.log('Validation passed');
    
    // Prepare application data for email
    console.log('Preparing application data...');
    const applicationData = {
        jobId: currentJob.id,
        jobTitle: currentJob.title,
        company: currentJob.company,
        location: currentJob.location,
        salary: currentJob.salary,
        applicantName: document.getElementById('applicantName').value,
        fatherName: document.getElementById('fatherName').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        cnicNumber: document.getElementById('cnicNumber').value,
        contactNumber: document.getElementById('contactNumber').value,
        gender: document.getElementById('gender').value,
        applicantEmail: document.getElementById('applicantEmail').value,
        address: document.getElementById('address').value,
        education: document.getElementById('education').value,
        applicantExperience: document.getElementById('applicantExperience').value,
        skills: document.getElementById('skills').value,
        shiftAvailable: document.querySelector('input[name="shiftAvailable"]:checked')?.value || 'Not specified',
        expectedSalary: document.getElementById('expectedSalary').value || 'Not specified',
        coverLetter: document.getElementById('coverLetter').value,
        cvFile: document.getElementById('cvFile').files[0]?.name || 'No CV uploaded',
        paymentScreenshot: document.getElementById('paymentScreenshot').files[0]?.name || 'No payment proof'
    };
    
    console.log('Application data prepared:', applicationData);
    
    try {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending Application...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
        
        // Send email using email service
        const result = await window.emailService.sendApplication(applicationData);
        
        if (result.success) {
            showMessage('Application submitted successfully! ' + result.message, 'success');
            closeApplicationModal();
            closeModal();
        } else {
            showMessage(result.message, 'error');
        }
        
    } catch (error) {
        console.error('Error submitting application:', error);
        showMessage('Failed to submit application. Please try again.', 'error');
    } finally {
        // Reset button state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Submit Application';
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

// Email functions are now handled by email-service.js

// Admin panel removed - no database needed with fixed jobs

// Admin panel functionality removed - jobs are now fixed in code

// Stats Update
function updateStats() {
    document.getElementById('totalJobs').textContent = jobs.length;
}

// Initialize App
// Always open the page at the top — otherwise the browser restores the previous
// scroll position on refresh and the site loads part-way down.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', function() {
    showHome();
    window.scrollTo(0, 0);

    // Form submit is handled by onsubmit attribute in HTML
    
    // Initialize EmailJS when page loads
    if (typeof emailjs !== 'undefined') {
        console.log('EmailJS is available');
    } else {
        console.log('EmailJS not yet loaded, will retry...');
    setTimeout(() => {
            if (typeof emailjs !== 'undefined') {
                console.log('EmailJS loaded successfully');
            } else {
                console.error('EmailJS failed to load');
            }
        }, 2000);
    }
    
    // Add some sample applications for demo
    applications.push(
        {
            id: 1,
            jobId: 1,
            jobTitle: 'Senior Software Engineer',
            company: 'Tech Solutions Ltd',
            name: 'Ahmed Khan',
            email: 'ahmed@email.com',
            phone: '+92-300-1234567',
            experience: '3-5',
            status: 'pending',
            submittedDate: new Date('2024-01-25')
        },
        {
            id: 2,
            jobId: 2,
            jobTitle: 'Digital Marketing Specialist',
            company: 'Creative Agency',
            name: 'Sara Ali',
            email: 'sara@email.com',
            phone: '+92-321-9876543',
            experience: '1-3',
            status: 'approved',
            submittedDate: new Date('2024-01-24')
        }
    );
});

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
            modal.classList.add('hide');
        }
    });
};

// Handle Enter key in search
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && (event.target.id === 'searchInput' || event.target.id === 'heroSearchInput')) {
        searchJobs();
    }
});

// Contact form submission function
window.submitContactForm = async function(event) {
    console.log('Contact form submission function called');
    event.preventDefault();

    // Debug: Check if email service is available
    if (typeof window.emailService === 'undefined') {
        console.error('Email service not available');
        showMessage('Email service not available. Please refresh the page and try again.', 'error');
        return;
    }

    console.log('Email service available:', window.emailService);

    // Get form data
    const formData = new FormData(event.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Validate form data
    if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    try {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending Message...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        // Send email using email service
        const result = await window.emailService.sendContactForm(contactData);

        if (result.success) {
            showMessage(result.message, 'success');
            // Reset form
            event.target.reset();
        } else {
            showMessage(result.message, 'error');
        }

    } catch (error) {
        console.error('Error sending contact form:', error);
        showMessage('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
};

