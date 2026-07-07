import {
  AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit,
  PLATFORM_ID, ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

import { Experience } from '../interface/experience';
import experiences from '../../../public/assets/experiences.json';

interface StatItem  { value: number; suffix: string; label: string; }
interface SkillGroup { label: string; skills: string[]; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  providers: [Title, Meta],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navbar') private navbarRef!: ElementRef<HTMLElement>;

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

  private scrollHandler?: () => void;

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
    this.initNavbarScroll();
  }

  ngOnDestroy(): void {
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
  }

  toggleMobileMenu(): void  { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMobileMenu(): void   { this.mobileMenuOpen  = false; }

  // ── Navbar scroll state ────────────────────────────────────────────────────
  private initNavbarScroll(): void {
    const nav = this.navbarRef?.nativeElement;
    if (!nav) return;
    this.scrollHandler = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.scrollHandler();
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
