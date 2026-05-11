import {
  AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit,
  PLATFORM_ID, ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

import { gsap } from 'gsap';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Experience } from '../interface/experience';
import experiences from '../../../public/assets/experiences.json';

interface StatItem  { value: number; suffix: string; label: string; }
interface SkillGroup { label: string; skills: string[]; }

class Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; o: number;
  rgb: string;
  constructor(w: number, h: number) {
    this.x  = Math.random() * w;
    this.y  = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.r  = Math.random() * 1.4 + 0.4;
    this.o  = Math.random() * 0.45 + 0.15;
    this.rgb = Math.random() > 0.5 ? '108,99,255' : '0,217,255';
  }
  update(w: number, h: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.rgb},${this.o})`;
    ctx.fill();
  }
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  providers: [Title, Meta],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cursorDot')       private cursorDotRef!:     ElementRef<HTMLElement>;
  @ViewChild('cursorRing')      private cursorRingRef!:    ElementRef<HTMLElement>;
  @ViewChild('navbar')          private navbarRef!:        ElementRef<HTMLElement>;
  @ViewChild('particleCanvas')  private canvasRef!:        ElementRef<HTMLCanvasElement>;
  @ViewChild('heroGreeting')    private heroGreetingRef!:  ElementRef<HTMLElement>;
  @ViewChild('heroName')        private heroNameRef!:      ElementRef<HTMLElement>;
  @ViewChild('heroTitle')       private heroTitleRef!:     ElementRef<HTMLElement>;
  @ViewChild('heroCta')         private heroCtaRef!:       ElementRef<HTMLElement>;
  @ViewChild('scrollIndicator') private scrollIndicatorRef!: ElementRef<HTMLElement>;
  @ViewChild('heroTypewriter')  private typewriterRef!:    ElementRef<HTMLSpanElement>;

  readonly fullName    = 'Joseph C. Alcantara';
  readonly currentYear = new Date().getFullYear();
  mobileMenuOpen       = false;

  readonly experienceData: Experience[] = experiences.experiences;

  readonly stats: StatItem[] = [
    { value: 10, suffix: '+', label: 'Years of Experience'   },
    { value: 6,  suffix: '',  label: 'Companies'             },
    { value: 20, suffix: '+', label: 'Internal Applications' },
    { value: 9,  suffix: '+', label: 'Technologies'          },
  ];

  readonly skillGroups: SkillGroup[] = [
    { label: 'Languages',
      skills: ['C#', 'VB.NET', 'TypeScript', 'JavaScript', 'Python', 'PHP', 'HTML & CSS', 'Java'] },
    { label: 'Frameworks & Libraries',
      skills: ['Angular', '.NET', 'React', 'Laravel', 'Scrapy'] },
    { label: 'Cloud & DevOps',
      skills: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'SQS', 'CloudWatch', 'Azure App Service', 'Azure SQL'] },
    { label: 'Databases',
      skills: ['MS SQL Server', 'MySQL', 'PostgreSQL'] },
    { label: 'Practices & Tools',
      skills: ['Data Pipelines', 'System Architecture', 'Performance Optimization', 'ERP Systems', 'Agile/Scrum', 'SharePoint', 'MVC', 'N-tier Architecture'] },
  ];

  private readonly typewriterTexts = [
    'Web Applications',
    'Cloud ERP Solutions',
    'Full-Stack Development',
    'Data Pipelines',
    'System Architecture',
  ];

  private lenis?: Lenis;
  private particles: Particle[] = [];
  private canvasRaf = 0;
  private mouseMoveHandler?: (e: MouseEvent) => void;
  private scrollHandler?:    () => void;
  private resizeHandler?:    () => void;
  private twTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Joseph C. Alcantara — Senior Software Engineer');
    const desc = 'Senior Software Engineer with 10+ years of experience in enterprise systems, data pipelines, and cloud applications across ANZ and SEA markets.';
    this.meta.addTags([
      { name: 'description',      content: desc },
      { name: 'keywords',         content: 'Senior Software Engineer, Full Stack Engineer, C#, .NET, Angular, AWS, Azure, TypeScript, JavaScript' },
      { name: 'author',           content: 'Joseph C. Alcantara' },
      { name: 'robots',           content: 'index, follow' },
      { property: 'og:title',       content: 'Joseph C. Alcantara — Senior Software Engineer' },
      { property: 'og:description', content: desc },
      { property: 'og:type',        content: 'website' },
    ]);
    if (isPlatformBrowser(this.platformId)) this.injectStructuredData();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initParticles();
    this.initNavbarScroll();
    this.initCursor();
    this.initTypewriter();

    if (!reduced) {
      this.initLenis();
      this.initHeroAnims();
      this.initScrollAnims();
    }
  }

  ngOnDestroy(): void {
    this.lenis?.destroy();
    cancelAnimationFrame(this.canvasRaf);
    if (this.mouseMoveHandler) document.removeEventListener('mousemove', this.mouseMoveHandler);
    if (this.scrollHandler)    window.removeEventListener('scroll', this.scrollHandler);
    if (this.resizeHandler)    window.removeEventListener('resize', this.resizeHandler);
    if (this.twTimeout)        clearTimeout(this.twTimeout);
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.ticker.remove(this.lenisRaf);
  }

  toggleMobileMenu(): void  { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMobileMenu(): void   { this.mobileMenuOpen  = false; }

  // ── Lenis ──────────────────────────────────────────────────────────────────
  private lenisRaf = (time: number) => this.lenis?.raf(time * 1000);

  private initLenis(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    gsap.ticker.add(this.lenisRaf);
    gsap.ticker.lagSmoothing(0);
  }

  // ── Particle canvas ────────────────────────────────────────────────────────
  private initParticles(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const count = Math.floor((canvas.width * canvas.height) / 14000);
      this.particles = Array.from({ length: count }, () => new Particle(canvas.width, canvas.height));
    };
    resize();
    this.resizeHandler = resize;
    window.addEventListener('resize', resize, { passive: true });

    const draw = () => {
      this.canvasRaf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of this.particles) { p.update(canvas.width, canvas.height); p.draw(ctx); }
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108,99,255,${0.07 * (1 - d / 110)})`;
            ctx.lineWidth   = 0.5;
            ctx.moveTo(this.particles[i].x, this.particles[i].y);
            ctx.lineTo(this.particles[j].x, this.particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    draw();
  }

  // ── Custom cursor ──────────────────────────────────────────────────────────
  private initCursor(): void {
    const dot  = this.cursorDotRef?.nativeElement;
    const ring = this.cursorRingRef?.nativeElement;
    if (!dot || !ring) return;

    this.mouseMoveHandler = (e: MouseEvent) => {
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.08, overwrite: true });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.35, overwrite: true });
    };
    document.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  // ── Typewriter ─────────────────────────────────────────────────────────────
  private initTypewriter(): void {
    const el = this.typewriterRef?.nativeElement;
    if (!el) return;

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.parentNode?.insertBefore(cursor, el.nextSibling);

    let idx = 0;
    const texts = this.typewriterTexts;

    const type = (text: string, cb: () => void) => {
      let i = 0;
      const id = setInterval(() => {
        el.textContent = text.slice(0, ++i);
        if (i >= text.length) { clearInterval(id); this.twTimeout = setTimeout(cb, 1600); }
      }, 62);
    };
    const erase = (cb: () => void) => {
      const t = el.textContent ?? '';
      let i = t.length;
      const id = setInterval(() => {
        el.textContent = t.slice(0, --i);
        if (i <= 0) { clearInterval(id); cb(); }
      }, 36);
    };
    const loop = () => type(texts[idx], () => erase(() => { idx = (idx + 1) % texts.length; loop(); }));
    this.twTimeout = setTimeout(loop, 900);
  }

  // ── Navbar scroll state ────────────────────────────────────────────────────
  private initNavbarScroll(): void {
    const nav = this.navbarRef?.nativeElement;
    if (!nav) return;
    this.scrollHandler = () => nav.classList.toggle('scrolled', window.scrollY > 48);
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  // ── Hero entrance sequence ─────────────────────────────────────────────────
  private initHeroAnims(): void {
    const els = [
      this.heroGreetingRef?.nativeElement,
      this.heroNameRef?.nativeElement,
      this.heroTitleRef?.nativeElement,
      this.heroCtaRef?.nativeElement,
      this.scrollIndicatorRef?.nativeElement,
    ].filter(Boolean);

    gsap.set(els, { opacity: 0, y: 32 });

    gsap.timeline({ delay: 0.15 })
      .to(this.heroGreetingRef.nativeElement,    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to(this.heroNameRef.nativeElement,        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.45')
      .to(this.heroTitleRef.nativeElement,       { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, '-=0.45')
      .to(this.heroCtaRef.nativeElement,         { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, '-=0.35')
      .to(this.scrollIndicatorRef.nativeElement, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
  }

  // ── Scroll-triggered animations ────────────────────────────────────────────
  private initScrollAnims(): void {
    // Heading underlines
    gsap.utils.toArray<HTMLElement>('.section-heading').forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        once: true,
        onEnter: () => el.classList.add('line-in'),
      });
    });

    // About columns
    gsap.from('.about-bio',   { scrollTrigger: { trigger: '.about-bio',   start: 'top 78%' }, x: -50, opacity: 0, duration: 0.9, ease: 'power3.out' });
    gsap.from('.about-stats', { scrollTrigger: { trigger: '.about-stats', start: 'top 78%' }, x:  50, opacity: 0, duration: 0.9, ease: 'power3.out' });

    // Count-up numbers
    document.querySelectorAll<HTMLElement>('.stat-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-target') ?? '0', 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
          });
        },
      });
    });

    // Skills stagger
    gsap.from('.skill-badge', {
      scrollTrigger: { trigger: '.skills-groups', start: 'top 78%' },
      opacity: 0, y: 18, duration: 0.45, stagger: 0.035, ease: 'power3.out',
    });

    // Timeline line draw
    const timeline = document.querySelector<HTMLElement>('.timeline');
    const line     = document.querySelector<HTMLElement>('.timeline-line');
    if (timeline && line) {
      gsap.to(line, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top center',
          end:   'bottom center',
          scrub: 0.6,
        },
      });
    }

    // Timeline cards — alternating slide-in
    gsap.utils.toArray<HTMLElement>('.timeline-item').forEach(item => {
      const fromRight = item.classList.contains('right');
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 82%', once: true },
        x: fromRight ? 50 : -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // Contact
    gsap.from('.contact-wrap', {
      scrollTrigger: { trigger: '.contact-wrap', start: 'top 78%' },
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
    });
  }

  // ── Structured data ─────────────────────────────────────────────────────────
  private injectStructuredData(): void {
    const schema = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      name: 'Joseph C. Alcantara',
      jobTitle: 'Senior Software Engineer',
      description: 'Senior Software Engineer with 10+ years of experience in enterprise systems, data pipelines, and cloud applications.',
      sameAs: [
        'https://github.com/alcantarajosephc',
        'https://linkedin.com/in/alcantarajosephc',
      ],
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
  }
}
