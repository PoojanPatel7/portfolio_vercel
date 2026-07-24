export default async function handler(req, res) {
    try {
        const username = 'PoojanPatel7';
        // GitHub API requires a User-Agent header
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`, {
            headers: {
                'User-Agent': 'Portfolio-App'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }
        
        const data = await response.json();
        
        const projects = data.map(repo => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stars: repo.stargazers_count,
            topics: repo.topics || []
        }));

        // Custom curated projects
        const gadgetGoProject = {
            id: 'gadget-go',
            name: 'GadgetGo.com',
            description: 'A Full-Stack E-Commerce & Device Buyback Platform. Features include an E-Commerce Store with cart, coupons, and wallet, plus a Device Buyback engine for instant AI-adjusted price estimates. Built with PHP, MySQL, TailwindCSS, Chart.js, Razorpay, and Google Maps API with three distinct portals (Customer, Admin, Employee).',
            url: 'https://github.com/PoojanPatel7/GadgetGo.com',
            homepage: 'https://gadgetgo.free.nf/',
            language: 'PHP',
            stars: 'Premium',
            topics: ['php', 'mysql', 'ecommerce', 'tailwind']
        };

        const cashewProject = {
            id: 'cashew-pro-erp',
            name: 'CashewPro ERP',
            description: 'A comprehensive, enterprise-grade management system built to digitize and optimize cashew processing operations. Instead of traditional paper logs, it provides a seamless digital experience—tracking everything from raw stock to finished goods. Built with Flutter and Firebase, it features real-time analytics, an interactive process visualization graph, and support for multi-factory management. It reduces wastage, improves traceability, and provides real-time insights with a premium, user-friendly interface.',
            url: 'https://github.com/PoojanPatel7/Cashew-Factory-Management-System',
            homepage: '',
            language: 'Flutter / Dart',
            stars: 'Premium',
            topics: ['flutter', 'firebase', 'erp']
        };

        // Add them to the top of the list
        projects.unshift(cashewProject);
        projects.unshift(gadgetGoProject);

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
}
