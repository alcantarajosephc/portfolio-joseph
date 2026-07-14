import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ServiceItem {
  headline: string;
  description: string;
  chips: string[];
  ctaLabel: string;
  mailSubject: string;
}

interface WorkStep { label: string; }

const CONTACT_EMAIL = 'info@alcantarajoseph.com';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [Title, Meta],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  readonly currentYear = new Date().getFullYear();
  mobileMenuOpen = false;

  readonly introHeadline = 'I build software for businesses that are tired of doing things manually.';
  readonly introSubhead = 'Senior engineer with 10+ years shipping systems for companies like Goodyear and Infor — and I run my own business, so I know what "we don\'t have time for this" actually feels like. I take on a limited number of client projects alongside my full-time work.';

  readonly trustItems: string[] = [
    '10+ Years Experience',
    'Finance · Manufacturing · Media',
    'I run a business too',
  ];

  readonly services: ServiceItem[] = [
    {
      headline: 'Custom websites and apps that actually do something',
      description: 'Whether it\'s a website that brings in customers, an internal tool that replaces a messy spreadsheet, or a mobile app for your team in the field — I build it end to end. You explain the problem in plain language; I handle the technical decisions.',
      chips: ['Business websites', 'Booking & ordering systems', 'Internal dashboards', 'Mobile apps'],
      ctaLabel: 'Tell me what you need built',
      mailSubject: 'Project inquiry: Web & Software Development',
    },
    {
      headline: 'Put AI to work in the systems you already use',
      description: 'You don\'t need to replace anything. I connect AI to your existing tools so customer inquiries get answered instantly, emails get sorted and drafted automatically, and data gets pulled out of forms and documents without anyone retyping it.',
      chips: ['Customer service chatbots', 'Email triage & auto-replies', 'Form & document data extraction', 'FAQ automation'],
      ctaLabel: 'See what AI can take off your plate',
      mailSubject: 'Project inquiry: AI Integration',
    },
    {
      headline: 'Stop paying people to copy-paste',
      description: 'If your team spends hours moving data between systems, generating the same reports, or chasing paperwork — that\'s a process I can automate. The work still gets done. It just gets done in seconds, without errors, at 2 AM if it has to.',
      chips: ['Invoice & billing automation', 'Form-to-CRM pipelines', 'Automated reports', 'Data entry elimination'],
      ctaLabel: 'Show me your most repetitive task',
      mailSubject: 'Project inquiry: Process Automation',
    },
    {
      headline: 'That old system your business runs on? I can bring it into 2026.',
      description: 'I\'ve spent a decade working with .NET and enterprise systems, which means I can read the old code nobody wants to touch. I\'ll move it to the web, to the cloud, or to something your new hires can actually learn — without breaking what works.',
      chips: ['Desktop-to-web migration', '.NET upgrades', 'Database modernization', '"The one guy who built it left" rescues'],
      ctaLabel: 'Tell me about your legacy system',
      mailSubject: 'Project inquiry: Legacy Modernization',
    },
    {
      headline: 'Move to the cloud — or stop overpaying for it',
      description: 'I migrate systems to AWS, Azure, or Google Cloud with proper planning, so there\'s no surprise downtime. Already in the cloud? I\'ll audit your setup and find where you\'re paying for capacity you don\'t use. It\'s usually more than you think.',
      chips: ['Cloud migration', 'Hosting cost audits', 'Backup & disaster recovery', 'Server optimization'],
      ctaLabel: 'Get a cloud health check',
      mailSubject: 'Project inquiry: Cloud Migration',
    },
  ];

  readonly workSteps: WorkStep[] = [
    { label: 'Discovery call (free, 30 min)' },
    { label: 'Fixed proposal with timeline & price' },
    { label: 'Build with weekly updates' },
    { label: 'Launch + support' },
  ];

  readonly globalCtaHref = this.buildMailto('Project inquiry');

  constructor(private meta: Meta, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Services — Joseph C. Alcantara | Software Development, AI & Automation');
    const desc = 'Custom software, AI integration, business process automation, legacy system modernization, and cloud migration for small-to-medium businesses — delivered by a senior engineer with 10+ years of enterprise experience.';
    this.meta.addTags([
      { name: 'description', content: desc },
      { name: 'keywords', content: 'freelance software developer, business automation, AI integration, legacy system modernization, cloud migration, .NET developer, Angular developer' },
      { name: 'author', content: 'Joseph C. Alcantara' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: 'Services — Joseph C. Alcantara' },
      { property: 'og:description', content: desc },
      { property: 'og:type', content: 'website' },
    ]);
  }

  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMobileMenu(): void  { this.mobileMenuOpen  = false; }

  mailtoFor(service: ServiceItem): string {
    return this.buildMailto(service.mailSubject);
  }

  private buildMailto(subject: string): string {
    const body = 'Hi Joseph,\n\nHere\'s what I\'m looking to build:\n\n';
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}
