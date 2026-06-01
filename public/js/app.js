document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // DOM Elements
    // ----------------------------------------------------
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const studentIdInput = document.getElementById('studentId');
    const inputGroup = studentIdInput.parentElement;
    const clearInputBtn = document.getElementById('clearInput');
    
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const btnText = searchBtn.querySelector('.btn-text');
    const btnLoader = searchBtn.querySelector('.btn-loader');
    
    const statusMessage = document.getElementById('statusMessage');
    const resultsSection = document.getElementById('resultsSection');
    
    const displayStudentName = document.getElementById('displayStudentName');
    const displayStudentId = document.getElementById('displayStudentId');
    const displayCount = document.getElementById('displayCount');
    
    const tableBody = document.getElementById('tableBody');
    const mobileCardsContainer = document.getElementById('mobileCardsContainer');

    // ----------------------------------------------------
    // Theme Management (Light / Dark Mode)
    // ----------------------------------------------------
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            htmlEl.classList.remove('light');
            htmlEl.classList.add('dark');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            htmlEl.classList.remove('dark');
            htmlEl.classList.add('light');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    };

    themeToggleBtn.addEventListener('click', () => {
        if (htmlEl.classList.contains('dark')) {
            htmlEl.classList.remove('dark');
            htmlEl.classList.add('light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            htmlEl.classList.remove('light');
            htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    initTheme();

    // ----------------------------------------------------
    // Input Interactions & Floating Labels
    // ----------------------------------------------------
    const checkInputState = () => {
        const value = studentIdInput.value.trim();
        if (value.length > 0) {
            inputGroup.classList.add('has-value');
            clearInputBtn.style.display = 'block';
        } else {
            inputGroup.classList.remove('has-value');
            clearInputBtn.style.display = 'none';
        }
    };

    studentIdInput.addEventListener('focus', () => {
        inputGroup.classList.add('focused');
    });

    studentIdInput.addEventListener('blur', () => {
        inputGroup.classList.remove('focused');
        checkInputState();
    });

    studentIdInput.addEventListener('input', () => {
        // منع إدخال الحروف غير الرقمية لتسهيل البحث
        studentIdInput.value = studentIdInput.value.replace(/[^0-9]/g, '');
        checkInputState();
    });

    clearInputBtn.addEventListener('click', () => {
        studentIdInput.value = '';
        checkInputState();
        studentIdInput.focus();
    });

    // ----------------------------------------------------
    // HTML Sanitization (Prevent XSS)
    // ----------------------------------------------------
    const escapeHtml = (str) => {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    // ----------------------------------------------------
    // Rendering Results (Desktop Table & Mobile Cards)
    // ----------------------------------------------------
    const renderResults = (data) => {
        // مسح المحتوى القديم
        tableBody.innerHTML = '';
        mobileCardsContainer.innerHTML = '';

        if (data.length === 0) return;

        // تعبئة معلومات الطالب العامة من أول سجل
        const firstRecord = data[0];
        displayStudentName.innerText = firstRecord["إسم الطالب"] || 'متدرب غير معروف';
        displayStudentId.innerText = firstRecord["رقم الطالب"] || '---';
        displayCount.innerText = data.length;

        // 1. تعبئة الجدول للشاشات الكبيرة
        let tableRowsHtml = '';
        // 2. تعبئة البطاقات للجوال
        let mobileCardsHtml = '';

        data.forEach((item, index) => {
            const indexNo = index + 1;
            const courseName = item["اسم المقرر"] || '---';
            const courseCode = item["المقرر"] || '---';
            const groupCode = item["الشعبة"] || '---';
            const room = item["القاعة"] || '---';
            const seat = item["الجلوس"] || '---';
            const date = item["يوم الأختبار"] || '---';
            const period = item["الفترة"] || '---';

            // صف الجدول (Desktop)
            tableRowsHtml += `
                <tr>
                    <td><strong>${indexNo}</strong></td>
                    <td><span class="subject-code" style="font-family: var(--font-en); font-weight: 700; color: var(--primary);">${escapeHtml(courseCode)}</span></td>
                    <td style="font-weight: 600;">${escapeHtml(courseName)}</td>
                    <td><span style="font-family: var(--font-en); font-weight: 600;">${escapeHtml(groupCode)}</span></td>
                    <td><span style="background: rgba(var(--primary-hsl), 0.08); padding: 4px 10px; border-radius: 8px; font-weight: 700; color: var(--primary);">${escapeHtml(room)}</span></td>
                    <td><span style="background: rgba(var(--accent-hsl), 0.08); padding: 4px 10px; border-radius: 8px; font-weight: 700; color: var(--accent); font-family: var(--font-en);">${escapeHtml(seat)}</span></td>
                    <td>${escapeHtml(date)}</td>
                    <td><span style="font-weight: 600;">${escapeHtml(period)}</span></td>
                </tr>
            `;

            // بطاقة الجوال (Mobile Card)
            mobileCardsHtml += `
                <div class="glass-card seating-card">
                    <div class="seating-card-header">
                        <h4>${escapeHtml(courseName)}</h4>
                        <span class="subject-code">${escapeHtml(courseCode)}</span>
                    </div>
                    <div class="seating-card-body">
                        <div class="info-item">
                            <span class="item-label">الشعبة</span>
                            <span class="item-val"><i class="fa-solid fa-users"></i> ${escapeHtml(groupCode)}</span>
                        </div>
                        <div class="info-item">
                            <span class="item-label">الفترة</span>
                            <span class="item-val"><i class="fa-solid fa-clock"></i> ${escapeHtml(period)}</span>
                        </div>
                        <div class="info-item">
                            <span class="item-label">رقم الجلوس</span>
                            <span class="item-val" style="color: var(--accent); font-family: var(--font-en);"><i class="fa-solid fa-chair"></i> ${escapeHtml(seat)}</span>
                        </div>
                        <div class="info-item">
                            <span class="item-label">القاعة</span>
                            <span class="item-val" style="color: var(--primary);"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(room)}</span>
                        </div>
                        <div class="info-item full-width">
                            <span class="item-label">يوم الاختبار ورقم اللجنة</span>
                            <span class="item-val"><i class="fa-solid fa-calendar-day"></i> ${escapeHtml(date)}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        tableBody.innerHTML = tableRowsHtml;
        mobileCardsContainer.innerHTML = mobileCardsHtml;
    };

    // ----------------------------------------------------
    // Search Action Logic
    // ----------------------------------------------------
    const performSearch = async () => {
        const query = studentIdInput.value.trim();

        if (!query) {
            showStatus('warning', 'الرجاء إدخال الرقم الأكاديمي أولاً', 'حقل البحث فارغ، يرجى كتابة الرقم الأكاديمي المكون من 9 أرقام.');
            return;
        }

        // 1. تفعيل حالة التحميل (Loading State)
        searchBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        resultsSection.style.display = 'none';
        
        // إظهار هيكل التحميل (Skeleton Loader) في حالة الانتظار
        statusMessage.innerHTML = `
            <div class="loading-skeleton">
                <div class="state-icon"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
                <h3>جاري جلب البيانات من الخادم الآمن...</h3>
                <p style="margin-bottom: 20px;">الرجاء الانتظار قليلاً لحين الاستعلام عن جدول المتدرب.</p>
                <div class="skeleton-loader" style="margin-bottom: 10px; width: 80%;"></div>
                <div class="skeleton-loader" style="margin-bottom: 10px; width: 60%;"></div>
                <div class="skeleton-loader" style="width: 40%;"></div>
            </div>
        `;

        try {
            // إرسال الطلب لـ Netlify Serverless Function
            const response = await fetch(`/api/search?id=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('فشل الاتصال بالخادم');
            }

            const data = await response.json();

            if (data.error) {
                showStatus('error', 'خطأ في عملية البحث', data.error);
                return;
            }

            if (data.length === 0) {
                showStatus('info', 'لم يتم العثور على أي نتائج', `لا توجد اختبارات مسجلة للرقم الأكاديمي (${query}) في جدول الاختبارات الحالي. يرجى التأكد من الرقم والمحاولة مرة أخرى.`);
                return;
            }

            // عرض البيانات
            renderResults(data);
            statusMessage.innerHTML = '';
            resultsSection.style.display = 'flex';

        } catch (error) {
            console.error('Search error:', error);
            showStatus('error', 'عذراً، حدث خطأ في الاتصال', 'تعذر الاتصال بـ API الاستعلام. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.');
        } finally {
            // 2. إيقاف حالة التحميل
            searchBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    };

    // عرض حالة معينة (رسالة تنبيهية)
    const showStatus = (type, title, desc) => {
        resultsSection.style.display = 'none';
        
        let icon = '<i class="fa-solid fa-circle-info"></i>';
        if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation"></i>';
        if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
        if (type === 'info') icon = '<i class="fa-solid fa-magnifying-glass"></i>';

        statusMessage.innerHTML = `
            <div class="${type}-state error-state">
                <div class="state-icon">${icon}</div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(desc)}</p>
            </div>
        `;
    };

    // إعادة التعيين
    const resetForm = () => {
        studentIdInput.value = '';
        checkInputState();
        resultsSection.style.display = 'none';
        
        // إرجاع الحالة الترحيبية الأولى
        statusMessage.innerHTML = `
            <div class="initial-state">
                <div class="state-icon">
                    <i class="fa-solid fa-circle-info"></i>
                </div>
                <h3>جاهز للاستعلام</h3>
                <p>يرجى إدخال الرقم الأكاديمي للمتدرب للبدء بالبحث في قاعدة البيانات.</p>
            </div>
        `;
    };

    // ----------------------------------------------------
    // Events Listeners
    // ----------------------------------------------------
    searchBtn.addEventListener('click', performSearch);
    resetBtn.addEventListener('click', resetForm);
    
    studentIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // تهيئة حالة حقل الإدخال
    checkInputState();
});
