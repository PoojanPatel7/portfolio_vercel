import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typed from 'typed.js';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. Fetch GitHub Projects
// ==========================================
async function fetchProjects() {
  const grid = document.getElementById('projects-grid');
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Network response was not ok');
    
    const projects = await res.json();
    grid.innerHTML = ''; // clear loading text
    
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div>
          <h3>${project.name}</h3>
          <p>${project.description || 'No description provided.'}</p>
        </div>
        <div class="project-footer">
          <span>⭐ ${project.stars}</span>
          <span>${project.language || 'Code'}</span>
          <a href="${project.url}" target="_blank" class="project-link">View Repo</a>
        </div>
      `;
      grid.appendChild(card);
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    grid.innerHTML = '<p style="color: red;">Failed to load projects. Make sure the backend is running.</p>';
  }
}

// fetchProjects();

// ==========================================
// 2. GSAP Scroll Animations & Typed.js
// ==========================================

// Hero Entrance Animation
gsap.fromTo('.hero-anim', 
  { opacity: 0, y: 30 },
  { 
    opacity: 1, 
    y: 0, 
    duration: 1, 
    stagger: 0.2, 
    ease: "power3.out", 
    delay: 0.2 
  }
);

// Typed.js for About section (Triggers when scrolled into view)
let aboutTyped;
ScrollTrigger.create({
  trigger: '#about',
  start: "top 80%",
  onEnter: () => {
    if (!aboutTyped) {
      aboutTyped = new Typed('#typed-about', {
        strings: [
          `Hello! I'm Poojan, a passionate and driven final-year Computer Science student at <span class="highlight">Rollwala Computer Center, Gujarat University</span>. My journey in tech is fueled by a deep curiosity and a love for building scalable solutions that live on the internet.<br><br>My expertise lies in <span class="highlight">full-stack development</span>, with a strong focus on modern frontend frameworks like <span class="highlight">React, Next.js, and Tailwind CSS</span>, paired with robust backend architectures using <span class="highlight">Node.js, Python, and SQL/NoSQL databases</span>. I thrive on translating complex problems into simple, beautiful, and intuitive user experiences.<br><br>As a quick learner and a highly collaborative team player, I am constantly seeking new challenges to tackle. I am currently looking for roles where I can contribute to meaningful projects, push my technical boundaries, and continue my rapid growth as a software developer.`
        ],
        typeSpeed: 10, // Fast typing
        showCursor: true,
        cursorChar: '|'
      });
    }
  },
  once: true
});

// Animate sections on scroll
gsap.utils.toArray('.section').forEach(section => {
  gsap.to(section, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
});

// Step-by-step timeline animation
gsap.utils.toArray('.anim-step').forEach((step, i) => {
  gsap.fromTo(step, 
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: step,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
});

// Handle window resize (removed Three.js logic)

// ==========================================
// 4. Custom Interactive Cursor
// ==========================================
const cursor = document.getElementById('custom-cursor');
const cursorFollower = document.getElementById('custom-cursor-follower');

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

  // Hover effect for links and buttons
  document.querySelectorAll('a, button, .skill-tag, .window-header, .hero-badge').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorFollower.style.backgroundColor = 'transparent';
      cursorFollower.style.border = '2px solid var(--accent-color)';
    });
    el.addEventListener('mouseleave', () => {
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.backgroundColor = 'transparent';
      cursorFollower.style.border = '2px solid var(--accent-secondary)';
    });
  });

// Animate follower for smooth trailing effect
function animateFollower() {
  requestAnimationFrame(animateFollower);
  
  // Calculate distance
  const dx = mouseX - followerX;
  const dy = mouseY - followerY;
  
  // Easing
  followerX += dx * 0.15;
  followerY += dy * 0.15;
  
  if (cursorFollower) {
    // Only translate, let CSS handle scale/hover states
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
  }
}
animateFollower();

// ==========================================
// 3. Interactive Floating Bubbles
// ==========================================
const bubbleColors = [
  'rgba(37, 99, 235, 0.5)',  // Blue
  'rgba(168, 85, 247, 0.5)', // Purple
  'rgba(236, 72, 153, 0.5)', // Pink
  'rgba(20, 184, 166, 0.5)', // Teal
  'rgba(245, 158, 11, 0.5)'  // Amber
];

const bubblePatterns = ['solid', 'outline', 'gradient', 'radial', 'dotted'];

function createBubble(x, y) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  
  // Random size between 20px and 80px
  const size = Math.random() * 60 + 20;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  
  // Position it at the requested coordinates (centered)
  bubble.style.left = `${x - size/2}px`;
  bubble.style.top = `${y - size/2}px`;
  
  // Apply random color and pattern
  const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
  const solidColor = color.replace('0.5', '1'); // For borders
  const pattern = bubblePatterns[Math.floor(Math.random() * bubblePatterns.length)];
  
  if (pattern === 'solid') {
    bubble.style.backgroundColor = color;
    bubble.style.border = `1px solid ${solidColor}`;
  } else if (pattern === 'outline') {
    bubble.style.backgroundColor = 'transparent';
    bubble.style.border = `3px solid ${solidColor}`;
    bubble.style.boxShadow = `inset 0 0 10px ${color}`;
  } else if (pattern === 'dotted') {
    bubble.style.backgroundColor = 'transparent';
    bubble.style.border = `4px dotted ${solidColor}`;
  } else if (pattern === 'gradient') {
    bubble.style.background = `linear-gradient(135deg, ${color}, transparent)`;
    bubble.style.border = `1px solid ${solidColor}`;
  } else if (pattern === 'radial') {
    bubble.style.background = `radial-gradient(circle at 30% 30%, ${solidColor}, ${color} 40%, transparent 70%)`;
    bubble.style.border = 'none';
  }
  
  // Random float duration between 8s and 18s
  const duration = Math.random() * 10 + 8;
  bubble.style.animationDuration = `${duration}s`;
  
  document.body.appendChild(bubble);
  
  // Clean up element after animation finishes
  setTimeout(() => {
    bubble.remove();
  }, duration * 1000);
}

// Generate some random bubbles initially
for(let i = 0; i < 20; i++) {
  setTimeout(() => {
    createBubble(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight + window.innerHeight * 0.5 // Start lower down
    );
  }, Math.random() * 2000);
}

// Generate new bubbles on click anywhere
document.addEventListener('click', (e) => {
  // Ignore clicks on modals or category cards so bubbles don't interfere with UI
  if (e.target.closest('.modal-content') || e.target.closest('.skill-category-card')) return;
  
  // Create a main bubble
  createBubble(e.clientX, e.clientY);
  
  // Create a few smaller companion bubbles for a "burst" effect
  for(let i=0; i<3; i++) {
    setTimeout(() => {
      createBubble(
        e.clientX + (Math.random() * 100 - 50), 
        e.clientY + (Math.random() * 100 - 50)
      );
    }, Math.random() * 200);
  }
});

// ==========================================
// 4. Balloon Pop Skill Tag Effects
// ==========================================
document.addEventListener('click', (e) => {
  const tag = e.target.closest('.skill-tag');
  if (!tag) return;

  // Prevent multiple clicks while animating
  if (tag.classList.contains('balloon-expanding')) return;

  const imgEl = tag.querySelector('img');
  if (!imgEl) return;
  const imgSrc = imgEl.getAttribute('src');

  // 1. Balloon Fill Animation
  tag.classList.add('balloon-expanding');

  // Get the exact center coordinates of the tag to spawn the explosion
  const rect = tag.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  setTimeout(() => {
    // 2. Pop! Hide the tag temporarily
    tag.classList.remove('balloon-expanding');
    tag.style.opacity = '0';
    tag.style.transform = 'scale(0)';

    // Shake page slightly on pop
    document.body.classList.add('shake-page');
    setTimeout(() => document.body.classList.remove('shake-page'), 200);

    // 3. Spawn Logos in all directions
    for (let i = 0; i < 30; i++) {
      const logo = document.createElement('img');
      logo.src = imgSrc;
      logo.classList.add('burst-logo');
      
      logo.style.left = `${centerX - 20}px`; // center origin
      logo.style.top = `${centerY - 20}px`;
      
      document.body.appendChild(logo);

      // Calculate random trajectory
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 600 + 300; // Larger distance for continuous drift
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      const rot = Math.random() * 1080 - 540; // Lots of spinning

      // Force reflow
      void logo.offsetWidth;

      // Apply explosion trajectory (continuous drift to a halt while fading out)
      logo.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(0.5)`;
      logo.style.opacity = '0';
      
      // Cleanup after transition
      setTimeout(() => logo.remove(), 1600);
    }

    // Restore the tag after explosion finishes
    setTimeout(() => {
      tag.style.transition = 'all 0.3s ease';
      tag.style.opacity = '1';
      tag.style.transform = 'scale(1)';
      
      // clean inline styles after restore
      setTimeout(() => {
        tag.style = ''; 
      }, 300);
    }, 1500);

  }, 800); // Wait 800ms for balloon to fill
});

// ==========================================
// 5. GitHub Projects Full-Screen Carousel
// ==========================================
const track = document.getElementById('github-projects-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentSlideIndex = 0;
let totalSlides = 0;

// Language to DevIcon mapping
const langToIcon = {
  'JavaScript': { name: 'JavaScript', icon: 'javascript/javascript-original.svg' },
  'TypeScript': { name: 'TypeScript', icon: 'typescript/typescript-original.svg' },
  'Python': { name: 'Python', icon: 'python/python-original.svg' },
  'HTML': { name: 'HTML5', icon: 'html5/html5-original.svg' },
  'CSS': { name: 'CSS3', icon: 'css3/css3-original.svg' },
  'Java': { name: 'Java', icon: 'java/java-original.svg' },
  'C++': { name: 'C++', icon: 'cplusplus/cplusplus-original.svg' },
  'C#': { name: 'C#', icon: 'csharp/csharp-original.svg' },
  'PHP': { name: 'PHP', icon: 'php/php-original.svg' },
  'Go': { name: 'Go', icon: 'go/go-original.svg' },
  'Ruby': { name: 'Ruby', icon: 'ruby/ruby-original.svg' },
  'Dart': { name: 'Dart', icon: 'dart/dart-original.svg' },
  'Swift': { name: 'Swift', icon: 'swift/swift-original.svg' }
};

async function fetchGitHubProjects() {
  if (!track) return;
  try {
    const response = await fetch('https://api.github.com/users/PoojanPatel7/repos?sort=updated&per_page=6');
    if (!response.ok) throw new Error('Failed to fetch projects');
    
    const repos = await response.json();
    totalSlides = repos.length;
    
    if (totalSlides === 0) {
      track.innerHTML = '<div class="loading">No projects found.</div>';
      return;
    }

    track.innerHTML = ''; // Clear loading

    repos.forEach((repo, index) => {
      const slide = document.createElement('div');
      slide.classList.add('carousel-slide');
      if (index === 0) slide.classList.add('active');

      // Default random image for projects since github doesn't provide them easily
      const randomImg = `https://picsum.photos/seed/${repo.name}/800/400`;
      
      let techTags = '';
      if (repo.language && langToIcon[repo.language]) {
        const lang = langToIcon[repo.language];
        techTags += `
          <div class="skill-tag" style="cursor: pointer;">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${lang.icon}" alt="${lang.name}">
            <span>${lang.name}</span>
          </div>
        `;
      } else if (repo.language) {
        // Fallback for languages without an icon in our small map
        techTags += `
          <div class="skill-tag" style="cursor: pointer;">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub">
            <span>${repo.language}</span>
          </div>
        `;
      }

      slide.innerHTML = `
        <div class="project-split-layout">
          <div class="project-left">
            <h1 style="text-transform: capitalize;">${repo.name.replace(/-/g, ' ')}</h1>
            <div class="pm-image" style="background-image: url('${randomImg}')"></div>
            <p>${repo.description || 'A brilliant project by Poojan Patel.'}</p>
            <div class="pm-links">
              <a href="${repo.html_url}" class="pm-github" target="_blank">View on GitHub</a>
              ${repo.homepage ? `<a href="${repo.homepage}" class="pm-live" target="_blank">Live Demo</a>` : ''}
            </div>
          </div>
          <div class="project-right">
            <h2 style="margin-bottom: 0.5rem;">Tools & Technology</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">Click any tag to blast it!</p>
            <div class="skills-container" style="margin-top: 0;">
              ${techTags}
            </div>
          </div>
        </div>
      `;
      track.appendChild(slide);
    });

    updateCarousel();

  } catch (error) {
    console.error(error);
    track.innerHTML = '<div class="loading">Error loading GitHub projects. Check console.</div>';
  }
}

function updateCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  if(slides.length === 0) return;
  
  // Calculate translation
  const percentage = -(currentSlideIndex * 100);
  track.style.transform = `translateX(${percentage}%)`;

  // Update active classes for opacity
  slides.forEach((slide, idx) => {
    slide.classList.remove('active');
    if (idx === currentSlideIndex) {
      slide.classList.add('active');
    }
  });
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentSlideIndex < totalSlides - 1) {
      currentSlideIndex++;
      updateCarousel();
    }
  });
}

// Initialize
// fetchGitHubProjects();
