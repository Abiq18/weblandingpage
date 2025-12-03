document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminForm');
    const toast = document.getElementById('toast');

    // Fetch current content
    fetch('/api/content')
        .then(response => response.json())
        .then(data => {
            // Populate Hero
            document.getElementById('heroTitle').value = data.hero.title;
            document.getElementById('heroDesc').value = data.hero.description;

            // Populate About
            document.getElementById('aboutText1').value = data.about.text1;
            document.getElementById('aboutText2').value = data.about.text2;

            // Populate Features
            const featuresContainer = document.getElementById('featuresContainer');
            featuresContainer.innerHTML = '';
            data.features.forEach((feature, index) => {
                const div = document.createElement('div');
                div.className = 'item-card';
                div.innerHTML = `
                    <div class="item-header">
                        <h4>Fitur ${index + 1}</h4>
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <input type="text" class="feature-icon" value="${feature.icon}">
                    </div>
                    <div class="form-group">
                        <label>Judul</label>
                        <input type="text" class="feature-title" value="${feature.title}">
                    </div>
                    <div class="form-group">
                        <label>Deskripsi</label>
                        <textarea class="feature-desc" rows="2">${feature.description}</textarea>
                    </div>
                `;
                featuresContainer.appendChild(div);
            });

            // Populate Services
            const servicesContainer = document.getElementById('servicesContainer');
            servicesContainer.innerHTML = '';
            data.services.forEach((service, index) => {
                const div = document.createElement('div');
                div.className = 'item-card';
                div.innerHTML = `
                    <div class="item-header">
                        <h4>Layanan ${index + 1}</h4>
                    </div>
                    <div class="form-group">
                        <label>Icon</label>
                        <input type="text" class="service-icon" value="${service.icon}">
                    </div>
                    <div class="form-group">
                        <label>Judul</label>
                        <input type="text" class="service-title" value="${service.title}">
                    </div>
                    <div class="form-group">
                        <label>Deskripsi</label>
                        <textarea class="service-desc" rows="2">${service.description}</textarea>
                    </div>
                `;
                servicesContainer.appendChild(div);
            });

            // Populate Pricing
            const pricingContainer = document.getElementById('pricingContainer');
            pricingContainer.innerHTML = '';
            const pricingData = data.pricing || [];
            pricingData.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'item-card';
                div.innerHTML = `
                    <div class="item-header">
                        <h4>Paket ${index + 1}</h4>
                    </div>
                    <div class="form-group">
                        <label>Nama Paket</label>
                        <input type="text" class="pricing-name" value="${item.name}">
                    </div>
                    <div class="form-group">
                        <label>Harga</label>
                        <input type="text" class="pricing-price" value="${item.price}">
                    </div>
                    <div class="form-group">
                        <label>Fitur (Pisahkan dengan koma)</label>
                        <textarea class="pricing-features" rows="3">${item.features.join(', ')}</textarea>
                    </div>
                `;
                pricingContainer.appendChild(div);
            });

            // Populate Portfolio
            const portfolioContainer = document.getElementById('portfolioContainer');
            portfolioContainer.innerHTML = '';
            const portfolioData = data.portfolio || [];
            
            function addPortfolioItem(item = { title: '', category: '', image: '' }) {
                const div = document.createElement('div');
                div.className = 'item-card portfolio-item-form';
                div.innerHTML = `
                    <div class="item-header">
                        <h4>Proyek</h4>
                        <button type="button" class="btn-remove">Hapus</button>
                    </div>
                    <div class="form-group">
                        <label>Judul Proyek</label>
                        <input type="text" class="portfolio-title" value="${item.title}">
                    </div>
                    <div class="form-group">
                        <label>Kategori</label>
                        <input type="text" class="portfolio-category" value="${item.category}">
                    </div>
                    <div class="form-group">
                        <label>URL Gambar</label>
                        <input type="text" class="portfolio-image" value="${item.image}">
                        <img src="${item.image}" class="portfolio-preview" onerror="this.style.display='none'" onload="this.style.display='block'">
                    </div>
                `;
                
                div.querySelector('.btn-remove').addEventListener('click', () => {
                    div.remove();
                });

                const imgInput = div.querySelector('.portfolio-image');
                const imgPreview = div.querySelector('.portfolio-preview');

                imgInput.addEventListener('input', () => {
                    imgPreview.src = imgInput.value;
                });

                portfolioContainer.appendChild(div);
            }

            portfolioData.forEach(item => addPortfolioItem(item));

            document.getElementById('addPortfolioBtn').addEventListener('click', () => {
                addPortfolioItem();
            });

            // Populate Contact
            document.getElementById('contactAddress').value = data.contact.address;
            document.getElementById('contactEmail').value = data.contact.email;
            document.getElementById('contactPhone').value = data.contact.phone;

        })
        .catch(error => console.error('Error loading content:', error));

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Gather Features
        const features = [];
        document.querySelectorAll('#featuresContainer > div').forEach(div => {
            features.push({
                icon: div.querySelector('.feature-icon').value,
                title: div.querySelector('.feature-title').value,
                description: div.querySelector('.feature-desc').value
            });
        });

        // Gather Services
        const services = [];
        document.querySelectorAll('#servicesContainer > div').forEach(div => {
            services.push({
                icon: div.querySelector('.service-icon').value,
                title: div.querySelector('.service-title').value,
                description: div.querySelector('.service-desc').value
            });
        });

        // Gather Pricing
        const pricing = [];
        document.querySelectorAll('#pricingContainer > div').forEach(div => {
            const featuresStr = div.querySelector('.pricing-features').value;
            const featuresList = featuresStr.split(',').map(s => s.trim()).filter(s => s);
            
            pricing.push({
                name: div.querySelector('.pricing-name').value,
                price: div.querySelector('.pricing-price').value,
                features: featuresList,
                isPopular: false // Default
            });
        });

        // Gather Portfolio
        const portfolio = [];
        document.querySelectorAll('.portfolio-item-form').forEach(div => {
            portfolio.push({
                title: div.querySelector('.portfolio-title').value,
                category: div.querySelector('.portfolio-category').value,
                image: div.querySelector('.portfolio-image').value
            });
        });

        const formData = {
            hero: {
                title: document.getElementById('heroTitle').value,
                description: document.getElementById('heroDesc').value
            },
            about: {
                text1: document.getElementById('aboutText1').value,
                text2: document.getElementById('aboutText2').value
            },
            features: features,
            services: services,
            pricing: pricing,
            portfolio: portfolio,
            contact: {
                address: document.getElementById('contactAddress').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,

            }
        };

        // Merge and Save
        fetch('/api/content')
            .then(res => res.json())
            .then(currentData => {
                // Merge Services to preserve 'list'
                const mergedServices = formData.services.map((srv, i) => ({
                    ...srv,
                    list: currentData.services[i] ? currentData.services[i].list : []
                }));

                // Merge Pricing to preserve 'isPopular'
                const mergedPricing = formData.pricing.map((prc, i) => ({
                    ...prc,
                    isPopular: currentData.pricing && currentData.pricing[i] ? currentData.pricing[i].isPopular : (i === 1)
                }));

                // Merge About to preserve 'stats'
                const mergedAbout = {
                    ...formData.about,
                    stats: currentData.about.stats
                };

                const updatedData = {
                    ...currentData,
                    hero: formData.hero,
                    about: mergedAbout,
                    features: formData.features,
                    services: mergedServices,
                    pricing: mergedPricing,
                    portfolio: formData.portfolio,
                    contact: formData.contact
                };

                return fetch('/api/content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });
            })
            .then(response => response.json())
            .then(data => {
                showToast();
            })
            .catch(error => console.error('Error saving content:', error));
    });

    function showToast() {
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
});
