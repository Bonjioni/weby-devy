// Blog Management System
class BlogManager {
    constructor() {
        this.blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        this.blogForm = document.getElementById('blogForm');
        this.blogContainer = document.getElementById('blogPosts');
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortPosts');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.currentCategory = 'all';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderPosts();
        this.setupWordCount();
    }
    
    setupEventListeners() {
        // Form submission with Web3Forms
        this.blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(e);
        });

        // Search functionality
        this.searchInput.addEventListener('input', () => {
            this.renderPosts();
        });

        // Sort functionality
        this.sortSelect.addEventListener('change', () => {
            this.renderPosts();
        });

        // Category filtering
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.renderPosts();
            });
        });
    }
    
    async handleFormSubmission(e) {
        const formData = new FormData(e.target);
        const button = this.blogForm.querySelector('button');
        const originalText = button.innerHTML;
        
        try {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
            button.disabled = true;

            // Create blog post object
            const newPost = {
                id: Date.now(),
                title: formData.get('title'),
                content: formData.get('content'),
                category: formData.get('category'),
                date: new Date().toLocaleDateString(),
                readTime: this.calculateReadTime(formData.get('content')),
                likes: 0,
                comments: []
            };

            // Send to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to submit post');
            }

            // Add to local storage
            this.blogPosts.unshift(newPost);
            localStorage.setItem('blogPosts', JSON.stringify(this.blogPosts));
            
            // Reset form and show success
            this.blogForm.reset();
            button.innerHTML = '<i class="fas fa-check"></i> Published Successfully!';
            button.style.background = '#48bb78';
            
            // Render updated posts
            this.renderPosts();
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        } catch (error) {
            console.error('Error submitting post:', error);
            button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to Publish';
            button.style.background = '#e53e3e';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 3000);
        }
    }
    
    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return readTime;
    }
    
    setupWordCount() {
        const content = document.getElementById('blogContent');
        const wordCount = document.querySelector('.word-count');
        
        content.addEventListener('input', () => {
            const words = content.value.trim().split(/\s+/).length;
            wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
        });
    }
    
    filterPosts() {
        let filteredPosts = [...this.blogPosts];
        
        // Category filter
        if (this.currentCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === this.currentCategory);
        }
        
        // Search filter
        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm)
            );
        }
        
        // Sort
        const sortMethod = this.sortSelect.value;
        switch (sortMethod) {
            case 'newest':
                filteredPosts.sort((a, b) => b.id - a.id);
                break;
            case 'oldest':
                filteredPosts.sort((a, b) => a.id - b.id);
                break;
            case 'popular':
                filteredPosts.sort((a, b) => b.likes - a.likes);
                break;
        }
        
        return filteredPosts;
    }
    
    renderPosts() {
        const filteredPosts = this.filterPosts();
        
        this.blogContainer.innerHTML = filteredPosts.length ? filteredPosts.map(post => `
            <article class="blog-post" data-category="${post.category}">
                <div class="post-category">${post.category}</div>
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <div class="post-meta">
                    <small><i class="far fa-calendar"></i> ${post.date}</small>
                    <small><i class="far fa-clock"></i> ${post.readTime} min read</small>
                    <small class="likes">
                        <i class="far fa-heart"></i> ${post.likes} likes
                    </small>
                </div>
                <div class="post-actions">
                    <button onclick="blogManager.likePost(${post.id})">
                        <i class="far fa-heart"></i> Like
                    </button>
                    <button onclick="blogManager.sharePost(${post.id})">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </article>
        `).join('') : '<p class="no-posts">No posts found. Be the first to share your insights!</p>';
    }
    
    likePost(postId) {
        const post = this.blogPosts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            localStorage.setItem('blogPosts', JSON.stringify(this.blogPosts));
            this.renderPosts();
        }
    }
    
    sharePost(postId) {
        const post = this.blogPosts.find(p => p.id === postId);
        if (post) {
            if (navigator.share) {
                navigator.share({
                    title: post.title,
                    text: post.content.substring(0, 100) + '...',
                    url: window.location.href
                });
            } else {
                alert('Sharing is not supported on this browser');
            }
        }
    }
}

// Initialize Blog Manager
const blogManager = new BlogManager();