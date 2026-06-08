/* ===========================
   INTERACTIVE DEVELOPER TERMINAL
   Portfolio — Harsh Pandey
=========================== */

class DevTerminal {
  constructor() {
    this.modal = this.createModalHTML();
    this.container = this.modal.querySelector('.terminal-widget');
    this.output = this.container.querySelector('.terminal-body');
    this.input = this.container.querySelector('#terminal-input');
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: this.cmdHelp.bind(this),
      about: this.cmdAbout.bind(this),
      skills: this.cmdSkills.bind(this),
      projects: this.cmdProjects.bind(this),
      services: this.cmdServices.bind(this),
      experience: this.cmdExperience.bind(this),
      contact: this.cmdContact.bind(this),
      resume: this.cmdResume.bind(this),
      github: this.cmdGithub.bind(this),
      linkedin: this.cmdLinkedin.bind(this),
      clear: this.cmdClear.bind(this),
      whoami: this.cmdWhoami.bind(this),
      stack: this.cmdStack.bind(this),
      achievements: this.cmdAchievements.bind(this),
      exit: this.close.bind(this)
    };

    this.init();
  }

  createModalHTML() {
    const modalId = 'terminal-modal';
    let modal = document.getElementById(modalId);
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'terminal-modal';
    modal.innerHTML = `
      <div class="terminal-widget">
        <div class="terminal-top">
          <div class="terminal-top-left">
            <span class="dot dot-r" title="Close Terminal (Type 'exit' to close)"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
            <span class="terminal-top-title">harsh@dev ~ terminal</span>
          </div>
          <button class="terminal-close-btn" aria-label="Close Terminal"><i class="fas fa-times"></i> Close</button>
        </div>
        <div class="terminal-body">
          <div class="terminal-input-line">
            <span class="terminal-prompt">visitor@harsh-dev <span class="terminal-accent">~</span> $</span>
            <input type="text" id="terminal-input" autocomplete="off" spellcheck="false" placeholder="type 'help' to start..." />
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  init() {
    // Welcome message
    this.typeLines([
      { text: '╔══════════════════════════════════════════╗', cls: 'terminal-success' },
      { text: '║   Welcome to Harsh Pandey\'s Terminal     ║', cls: 'terminal-success terminal-bold' },
      { text: '║   Freelance Developer • SaaS Builder     ║', cls: 'terminal-success' },
      { text: '╚══════════════════════════════════════════╝', cls: 'terminal-success' },
      { text: '' },
      { text: '  Type "help" to see available commands.', cls: 'terminal-output' },
      { text: '  Type "exit" or click Close / Red Dot to close.', cls: 'terminal-output' },
      { text: '' },
    ], 30);

    // Event listeners
    if (this.input) {
      this.input.addEventListener('keydown', (e) => this.handleKey(e));
    }

    // Click terminal body to focus input
    this.output.addEventListener('click', () => {
      if (this.input) this.input.focus();
    });

    // Close handlers
    const closeBtn = this.modal.querySelector('.terminal-close-btn');
    const redDot = this.modal.querySelector('.dot-r');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (redDot) redDot.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // Global triggers to open the terminal
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#openTerminalNav, #openTerminalHero');
      if (trigger) {
        e.preventDefault();
        this.open();
      }
    });
  }

  open() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (this.input) this.input.focus();
    }, 100);
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleKey(e) {
    if (e.key === 'Enter') {
      const cmd = this.input.value.trim().toLowerCase();
      this.input.value = '';

      this.addLine(`<span class="terminal-prompt">visitor@harsh-dev</span> <span class="terminal-accent">~</span> $ <span class="terminal-cmd">${this.escapeHtml(cmd)}</span>`);

      if (cmd === '') return;

      this.history.push(cmd);
      this.historyIndex = this.history.length;

      if (this.commands[cmd]) {
        this.commands[cmd]();
      } else {
        this.addLine(`<span class="terminal-danger">  Command not found: ${this.escapeHtml(cmd)}</span>`);
        this.addLine(`<span class="terminal-output">  Type "help" for available commands.</span>`);
      }
      this.addLine('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    }
  }

  escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  addLine(html) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = html;
    const inputLine = this.output.querySelector('.terminal-input-line');
    if (inputLine) {
      this.output.insertBefore(line, inputLine);
    } else {
      this.output.appendChild(line);
    }
    this.scrollToBottom();
  }

  typeLines(lines, delay = 30) {
    let i = 0;
    const addNext = () => {
      if (i >= lines.length) return;
      const line = lines[i];
      const cls = line.cls || '';
      if (line.text === '') {
        this.addLine('<br>');
      } else {
        this.addLine(`<span class="${cls}">${line.text}</span>`);
      }
      i++;
      setTimeout(addNext, delay);
    };
    addNext();
  }

  scrollToBottom() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  cmdHelp() {
    const cmds = [
      ['help', 'Show this help message'],
      ['about', 'Learn about Harsh Pandey'],
      ['skills', 'View technical skills'],
      ['projects', 'Browse recent projects'],
      ['experience', 'Work experience timeline'],
      ['services', 'Services offered'],
      ['contact', 'Get contact information'],
      ['resume', 'Download / Open professional resume'],
      ['github', 'Visit GitHub profile'],
      ['linkedin', 'Visit LinkedIn profile'],
      ['whoami', 'Quick identity card'],
      ['stack', 'View tech stack overview'],
      ['achievements', 'Key achievements'],
      ['clear', 'Clear terminal output'],
      ['exit', 'Close interactive terminal modal'],
    ];

    this.addLine('<span class="terminal-accent terminal-bold">  ╭─ Available Commands ─────────────────────────────────╮</span>');
    cmds.forEach(([cmd, desc]) => {
      const pad = cmd.padEnd(15, ' ');
      this.addLine(`<span class="terminal-accent">  │</span> <span class="terminal-success">${pad}</span><span class="terminal-output">${desc}</span>`);
    });
    this.addLine('<span class="terminal-accent terminal-bold">  ╰──────────────────────────────────────────────────────╯</span>');
  }

  cmdAbout() {
    this.addLine('<span class="terminal-accent2 terminal-bold">  ┌── About Harsh Pandey ─────────────────────────────────┐</span>');
    this.addLine('<span class="terminal-output">  │                                                       │</span>');
    this.addLine('<span class="terminal-output">  │  Freelance Full Stack Developer & SaaS Builder with   │</span>');
    this.addLine('<span class="terminal-output">  │  3+ years of experience building production software. │</span>');
    this.addLine('<span class="terminal-output">  │                                                       │</span>');
    this.addLine('<span class="terminal-output">  │  </span><span class="terminal-accent">Location:</span><span class="terminal-output"> Lucknow, India                              │</span>');
    this.addLine('<span class="terminal-output">  │  </span><span class="terminal-accent">Status:</span><span class="terminal-output">   Available for Freelance & Contracts        │</span>');
    this.addLine('<span class="terminal-output">  │  </span><span class="terminal-accent">Focus:</span><span class="terminal-output">    SaaS • Business Software • Automation       │</span>');
    this.addLine('<span class="terminal-output">  │                                                       │</span>');
    this.addLine('<span class="terminal-accent2 terminal-bold">  └───────────────────────────────────────────────────────┘</span>');
  }

  cmdSkills() {
    this.addLine('<span class="terminal-accent terminal-bold">  ── Technical Skills ──</span>');
    this.addLine('');
    this.addLine('<span class="terminal-success">  Frontend:</span>        <span class="terminal-output">HTML5 • CSS3 • JavaScript • Bootstrap</span>');
    this.addLine('<span class="terminal-success">  Backend:</span>         <span class="terminal-output">PHP • Python • Django • REST APIs</span>');
    this.addLine('<span class="terminal-success">  Database:</span>        <span class="terminal-output">MySQL • SQLite</span>');
    this.addLine('<span class="terminal-success">  AI & Automation:</span> <span class="terminal-output">Workflow Automation • AI Assisted Dev • Prompt Eng • Vibe Coding</span>');
    this.addLine('<span class="terminal-success">  DevOps & Cloud:</span>  <span class="terminal-output">VPS Cloud • Hosting • SSL • DNS • Git & GitHub</span>');
    this.addLine('<span class="terminal-success">  SEO:</span>             <span class="terminal-output">Technical SEO • Indexing • Google Search Console • GMB</span>');
  }

  cmdProjects() {
    this.addLine('<span class="terminal-accent terminal-bold">  ── Recent Projects (20+ Production Deployments) ──</span>');
    this.addLine('');
    const projects = [
      ['🏥', 'Healthcare SaaS Portal', 'Django + MySQL', 'SaaS'],
      ['🏨', 'Hotel Booking Engine', 'PHP + MySQL', 'Web App'],
      ['📊', 'Business Analytics CRM', 'Django + REST', 'Admin Panel'],
      ['🏠', 'Real Estate Listing', 'PHP + Bootstrap', 'Business'],
      ['🛒', 'E-Commerce Storefront', 'PHP + Payment API', 'Web App'],
    ];
    projects.forEach(([icon, name, tech, cat]) => {
      this.addLine(`<span class="terminal-output">  ${icon}  </span><span class="terminal-accent">${name.padEnd(25)}</span><span class="terminal-output">${tech.padEnd(20)}</span><span class="terminal-warning">[${cat}]</span>`);
    });
    this.addLine('');
    this.addLine('<span class="terminal-output">  → Visit /projects for full production portfolio</span>');
  }

  cmdExperience() {
    this.addLine('<span class="terminal-accent terminal-bold">  ── Work Experience (3+ Years) ──</span>');
    this.addLine('');
    this.addLine('<span class="terminal-accent2">  ▸ Full Stack Developer & SaaS Builder</span> <span class="terminal-output">— Freelance / Contract</span>');
    this.addLine('<span class="terminal-success">    Mar 2024 – Present</span>');
    this.addLine('<span class="terminal-output">    Building production systems, Ecommerce stores, SaaS dashboards.</span>');
    this.addLine('<span class="terminal-output">    Managing server deployments, Technical SEO, Google Search Console.</span>');
    this.addLine('');
    this.addLine('<span class="terminal-accent2">  ▸ Freelance Web Developer</span> <span class="terminal-output">— Self-Employed</span>');
    this.addLine('<span class="terminal-success">    Feb 2023 – Mar 2024</span>');
    this.addLine('<span class="terminal-output">    Delivered custom websites, business solutions, and hosting setup.</span>');
  }

  cmdServices() {
    this.addLine('<span class="terminal-accent terminal-bold">  ── Services & Solutions ──</span>');
    this.addLine('');
    const services = [
      ['💻', 'Custom Web Applications & SaaS'],
      ['🛒', 'Ecommerce Development'],
      ['💳', 'Payment Gateway Integration'],
      ['🌐', 'Custom Website Development'],
      ['🚀', 'Basic Starter Websites & Landing Pages'],
      ['🗄️', 'Backend Systems & API Development'],
      ['⚙️', 'Deployment & Server Management'],
      ['📈', 'SEO, Indexing & Local Search Optimization'],
      ['🤖', 'Workflow Automation & AI Assisted Solutions'],
    ];
    services.forEach(([icon, name]) => {
      this.addLine(`<span class="terminal-output">  ${icon}  </span><span class="terminal-cmd">${name}</span>`);
    });
  }

  cmdContact() {
    this.addLine('<span class="terminal-accent terminal-bold">  ── Contact Info ──</span>');
    this.addLine('');
    this.addLine('<span class="terminal-success">  📧 Email:</span>    <span class="terminal-accent">harshpandeylucifer@gmail.com</span>');
    this.addLine('<span class="terminal-success">  📍 Location:</span> <span class="terminal-output">Lucknow, India</span>');
    this.addLine('<span class="terminal-success">  💼 Status:</span>   <span class="terminal-output">Available for Freelance & Collaborations</span>');
    this.addLine('');
    this.addLine('<span class="terminal-output">  → Visit /contact to send a direct message</span>');
  }

  cmdResume() {
    this.addLine('<span class="terminal-output">  Opening Resume in new tab...</span>');
    this.addLine('<span class="terminal-accent">  🔗 assets/resume/harsh-resume.pdf</span>');
    setTimeout(() => {
      window.open('assets/resume/harsh-resume.pdf', '_blank');
    }, 1000);
  }

  cmdGithub() {
    this.addLine('<span class="terminal-output">  Opening GitHub profile...</span>');
    this.addLine('<span class="terminal-accent">  🔗 github.com/harshpandey</span>');
    setTimeout(() => {
      window.open('https://github.com', '_blank');
    }, 1000);
  }

  cmdLinkedin() {
    this.addLine('<span class="terminal-output">  Opening LinkedIn profile...</span>');
    this.addLine('<span class="terminal-accent">  🔗 linkedin.com/in/harshpandey</span>');
    setTimeout(() => {
      window.open('https://linkedin.com', '_blank');
    }, 1000);
  }

  cmdWhoami() {
    this.addLine('<span class="terminal-success terminal-bold">  ┌─────────────────────────────┐</span>');
    this.addLine('<span class="terminal-success">  │  Harsh Pandey               │</span>');
    this.addLine('<span class="terminal-success">  │  Full Stack Developer       │</span>');
    this.addLine('<span class="terminal-success">  │  SaaS Builder & Freelancer  │</span>');
    this.addLine('<span class="terminal-success">  │  3+ Years Experience        │</span>');
    this.addLine('<span class="terminal-success">  │  Lucknow, India             │</span>');
    this.addLine('<span class="terminal-success terminal-bold">  └─────────────────────────────┘</span>');
  }

  cmdStack() {
    this.addLine('<span class="terminal-accent terminal-bold">  ── Tech Stack ──</span>');
    this.addLine('');
    this.addLine('<span class="terminal-warning">  Languages:</span>      <span class="terminal-output">PHP • Python • JavaScript • SQL</span>');
    this.addLine('<span class="terminal-warning">  Frameworks:</span>     <span class="terminal-output">Django • Bootstrap • REST APIs</span>');
    this.addLine('<span class="terminal-warning">  AI & Automation:</span> <span class="terminal-output">Prompt Eng • Vibe Coding • Workflow Automation</span>');
    this.addLine('<span class="terminal-warning">  Infrastructure:</span>  <span class="terminal-output">VPS Cloud • SSL • DNS • Git & GitHub</span>');
    this.addLine('<span class="terminal-warning">  SEO & Google:</span>    <span class="terminal-output">Search Console • Google My Business • Local SEO</span>');
  }

  cmdAchievements() {
    this.addLine('<span class="terminal-accent terminal-bold">  ── Achievements ──</span>');
    this.addLine('');
    this.addLine('<span class="terminal-success">  ✔</span> <span class="terminal-output">Delivered 20+ production ready website deployments</span>');
    this.addLine('<span class="terminal-success">  ✔</span> <span class="terminal-output">Built and launched 5+ SaaS and business CRM dashboards</span>');
    this.addLine('<span class="terminal-success">  ✔</span> <span class="terminal-output">Optimized indexing and search visibility via Search Console</span>');
    this.addLine('<span class="terminal-success">  ✔</span> <span class="terminal-output">Configured SSL, secure payment portals, and server infrastructure</span>');
  }

  cmdClear() {
    const inputLine = this.output.querySelector('.terminal-input-line');
    this.output.innerHTML = '';
    if (inputLine) this.output.appendChild(inputLine);
  }
}

// Initialize terminal globally on all pages
document.addEventListener('DOMContentLoaded', () => {
  window.devTerminalInstance = new DevTerminal();
});
