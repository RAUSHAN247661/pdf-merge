document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
        mobileMenu.classList.toggle('hidden');
        this.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Close mobile menu if open
            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
            
            // Smooth scroll to target
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Update active nav link
            updateActiveNavLink(targetId);
        });
    });

    // "Try Now" button functionality
    document.querySelectorAll('.try-now-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('home').scrollIntoView({
                behavior: 'smooth'
            });
            document.getElementById('fileInput').click();
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Add shadow to navbar when scrolling
        const navbar = document.getElementById('navbar');
        if (scrollPosition > 10) {
            navbar.classList.add('navbar-shadow');
        } else {
            navbar.classList.remove('navbar-shadow');
        }
        
        // Update active nav link based on scroll position
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                updateActiveNavLink(`#${section.id}`);
            }
        });
    });

    // Function to update active nav link
    function updateActiveNavLink(targetId) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
            link.classList.remove('active-nav-link');
            if (link.classList.contains('nav-link')) {
                link.classList.remove('border-indigo-500', 'text-gray-900');
                link.classList.add('border-transparent', 'text-gray-500');
            }
        });
        
        // Add active class to current link
        const activeLink = document.querySelector(`.nav-link[href="${targetId}"], .nav-link-mobile[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active-nav-link');
            if (activeLink.classList.contains('nav-link')) {
                activeLink.classList.remove('border-transparent', 'text-gray-500');
                activeLink.classList.add('border-indigo-500', 'text-gray-900');
            }
        }
    }

    // PDF Merger functionality
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const pdfList = document.getElementById('pdfList');
    const pdfListContainer = document.getElementById('pdfListContainer');
    const mergeBtn = document.getElementById('mergeBtn');
    let pdfFiles = [];
    let draggedItem = null;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);

    // Handle selected files
    fileInput.addEventListener('change', handleFiles, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropZone.classList.add('active');
    }

    function unhighlight() {
        dropZone.classList.remove('active');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const files = e.target.files;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Check if file is PDF
            if (file.type === 'application/pdf') {
                // Check if file is already added
                if (!pdfFiles.some(f => f.name === file.name && f.size === file.size)) {
                    pdfFiles.push(file);
                }
            }
        }
        
        renderPdfList();
        updateMergeButton();
        
        // Auto-scroll to PDF list after upload
        if (pdfFiles.length > 0) {
            setTimeout(() => {
                pdfListContainer.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }

    function renderPdfList() {
        if (pdfFiles.length === 0) {
            pdfListContainer.classList.add('hidden');
            return;
        }
        
        pdfListContainer.classList.remove('hidden');
        pdfList.innerHTML = '';
        
        pdfFiles.forEach((file, index) => {
            const pdfItem = document.createElement('div');
            pdfItem.className = 'pdf-item bg-white p-4 rounded-lg shadow flex items-center justify-between w-full';
            pdfItem.draggable = true;
            pdfItem.dataset.index = index;
            
            pdfItem.innerHTML = `
                <div class="flex items-center w-full min-w-0">
                    <div class="pdf-icon-container mr-3 flex-shrink-0">
                        <svg class="h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">${file.name}</p>
                        <p class="text-xs text-gray-500 mt-1">${formatFileSize(file.size)}</p>
                    </div>
                </div>
                <button class="remove-btn text-red-500 hover:text-red-700 flex-shrink-0 ml-3">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            `;
            
            pdfList.appendChild(pdfItem);
            
            // Add drag events
            pdfItem.addEventListener('dragstart', handleDragStart);
            pdfItem.addEventListener('dragover', handleDragOver);
            pdfItem.addEventListener('dragleave', handleDragLeave);
            pdfItem.addEventListener('drop', handleDropItem);
            pdfItem.addEventListener('dragend', handleDragEnd);
            
            // Add remove button event
            pdfItem.querySelector('.remove-btn').addEventListener('click', () => {
                pdfFiles.splice(index, 1);
                renderPdfList();
                updateMergeButton();
            });
        });
        
        // Add warning message if only one PDF is uploaded
        if (pdfFiles.length === 1) {
            const warningMessage = document.createElement('div');
            warningMessage.className = 'mt-4 text-center text-red-500 font-medium warning-message';
            warningMessage.textContent = 'At least 2 PDFs should be uploaded for merging';
            pdfList.appendChild(warningMessage);
        }
    }

    // Drag and drop functions for reordering
    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('bg-indigo-50');
    }

    function handleDragLeave() {
        this.classList.remove('bg-indigo-50');
    }

    function handleDropItem(e) {
        e.stopPropagation();
        this.classList.remove('bg-indigo-50');
        
        if (draggedItem !== this) {
            const fromIndex = parseInt(draggedItem.dataset.index);
            const toIndex = parseInt(this.dataset.index);
            
            // Reorder array
            const movedItem = pdfFiles[fromIndex];
            pdfFiles.splice(fromIndex, 1);
            pdfFiles.splice(toIndex, 0, movedItem);
            
            renderPdfList();
        }
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        const items = document.querySelectorAll('.pdf-item');
        items.forEach(item => item.classList.remove('bg-indigo-50'));
    }

    function updateMergeButton() {
        // Disable button if less than 2 PDFs are uploaded
        mergeBtn.disabled = pdfFiles.length < 2;
        
        // Update button text if only one PDF is uploaded
        if (pdfFiles.length === 1) {
            mergeBtn.innerHTML = `
                Merge & Download PDF
                <svg class="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
            `;
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Merge button functionality
    mergeBtn.addEventListener('click', async function() {
        if (pdfFiles.length < 2) return;
        
        this.disabled = true;
        this.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Merging PDFs...
        `;
        
        try {
            // Create a new PDF document
            const { PDFDocument } = PDFLib;
            const mergedPdf = await PDFDocument.create();
            
            // Merge all PDFs in order
            for (const file of pdfFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            }
            
            // Save the merged PDF
            const mergedPdfBytes = await mergedPdf.save();
            
            // Download the merged PDF
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('An error occurred while merging PDFs. Please try again.');
        } finally {
            this.disabled = false;
            this.innerHTML = `
                Merge & Download PDF
                <svg class="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
            `;
        }
    });

    // Initialize active nav link
    updateActiveNavLink('#home');
});