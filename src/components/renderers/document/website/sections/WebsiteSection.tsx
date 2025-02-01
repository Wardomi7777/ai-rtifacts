import React from 'react';
import { HeroSection } from './HeroSection';
import { ContentSection } from './ContentSection';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialsSection } from './TestimonialsSection';
import { CTASection } from './CTASection';

const sectionComponents = {
  hero: HeroSection,
  content: ContentSection,
  features: FeaturesSection,
  testimonials: TestimonialsSection,
  cta: CTASection,
};

interface WebsiteSectionProps {
  section: any;
  theme: any;
  template: any;
}

export const WebsiteSection: React.FC<WebsiteSectionProps> = ({
  section,
  theme,
  template,
}) => {
  const Component = sectionComponents[section.type];
  
  if (!Component) {
    console.warn(`Unknown section type: ${section.type}`);
    return null;
  }

  return <Component data={section} theme={theme} template={template} />;
};