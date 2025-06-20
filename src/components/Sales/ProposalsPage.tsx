import React, { useState, useMemo, useCallback, memo, useRef } from 'react';
import { Search, Filter, Plus, Download, Eye, Edit3, Trash2, Copy, FileText, Send, Calendar, DollarSign, User, Building, Clock, CheckCircle, AlertCircle, Star, Layout, Briefcase, Zap, Target, Globe, Smartphone, Code, Megaphone, Camera, PenTool, TrendingUp, X, ArrowRight, Save, Type, Image, Layers, Settings2, Monitor, Tablet, Smartphone as SmartphoneIcon, BookOpen, Crown, Sparkles, ChevronDown, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, RotateCcw, RotateCw, MapPin, Phone, Globe2, Mail, Printer, PlusCircle, ArrowLeft, ArrowUp, ArrowDown, Trash, Edit, ChevronLeft, ChevronRight, MousePointer } from 'lucide-react';

// A4 Proposal Interfaces
interface ProposalPage {
  id: string;
  title: string;
  pageType: 'cover' | 'objectives' | 'scope' | 'commercials' | 'timeline' | 'thankyou' | 'custom';
  content: string;
  order: number;
  isEditable: boolean;
  customHeader?: string;
  styles: {
    fontFamily: 'inter' | 'poppins' | 'roboto' | 'playfair';
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    headerColor: string;
  };
}

interface Proposal {
  id: string;
  title: string;
  clientName: string;
  clientLocation: string;
  serviceInterested: string;
  website: string;
  contactNumber: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  createdDate: string;
  lastModified: string;
  dueDate: string;
  templateId: string;
  templateName: string;
  templateTeam: string;
  description: string;
  tags: string[];
  viewCount: number;
  lastViewed?: string;
  pages: ProposalPage[];
  designSettings: {
    theme: 'professional' | 'creative' | 'minimal' | 'corporate';
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: 'inter' | 'poppins' | 'roboto' | 'playfair';
    spacing: 'compact' | 'normal' | 'spacious';
  };
}

interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  team: string;
  category: string;
  color: string;
  fontFamily: 'inter' | 'poppins' | 'roboto' | 'playfair';
  icon: React.ComponentType<any>;
  pages: ProposalPage[];
  isPopular?: boolean;
  isPremium?: boolean;
}

// Standard A4 Pages Template Function
const createA4Pages = (team: string, template: string): ProposalPage[] => {
  const baseStyles = {
    fontFamily: (template === 'Professional Clean' ? 'inter' : 'poppins') as 'inter' | 'poppins' | 'roboto' | 'playfair',
    fontSize: 14,
    textColor: '#1F2937',
    backgroundColor: '#FFFFFF',
    headerColor: '#3B82F6'
  };

  return [
    {
      id: 'cover',
      title: 'Proposal Cover',
      pageType: 'cover',
      order: 1,
      isEditable: true,
      styles: baseStyles,
      content: `
        <div style="width: 210mm; height: 297mm; padding: 40mm; font-family: ${baseStyles.fontFamily}; background: white; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="text-align: center; margin-top: 60mm;">
            <h1 style="font-size: 48px; font-weight: 800; color: ${baseStyles.headerColor}; margin-bottom: 20px;">{{title}}</h1>
            <p style="font-size: 24px; color: #6B7280; margin-bottom: 40px;">Proposal from Marketlube</p>
            <div style="width: 100px; height: 4px; background: ${baseStyles.headerColor}; margin: 0 auto; border-radius: 2px;"></div>
          </div>
          
          <div style="border-top: 2px solid #E5E7EB; padding-top: 30px; text-align: center;">
            <h2 style="font-size: 28px; font-weight: 600; color: #1F2937; margin-bottom: 15px;">Submitted to</h2>
            <h3 style="font-size: 32px; font-weight: 700; color: ${baseStyles.headerColor}; margin-bottom: 10px;">{{clientName}}</h3>
            <div style="font-size: 16px; color: #6B7280; line-height: 1.6;">
              <p style="margin: 5px 0;"><strong>Location:</strong> {{clientLocation}}</p>
              <p style="margin: 5px 0;"><strong>Service:</strong> {{serviceInterested}}</p>
              <p style="margin: 5px 0;"><strong>Website:</strong> {{website}}</p>
              <p style="margin: 5px 0;"><strong>Contact:</strong> {{contactNumber}}</p>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'objectives',
      title: 'Project Objectives',
      pageType: 'objectives',
      order: 2,
      isEditable: true,
      styles: baseStyles,
      content: `
        <div style="width: 210mm; height: 297mm; padding: 30mm; font-family: ${baseStyles.fontFamily}; background: white;">
          <header style="border-bottom: 3px solid ${baseStyles.headerColor}; padding-bottom: 20px; margin-bottom: 40px;">
            <h1 style="font-size: 36px; font-weight: 700; color: ${baseStyles.headerColor}; margin: 0;">Project Objectives</h1>
            <p style="font-size: 16px; color: #6B7280; margin: 10px 0 0 0;">Understanding your goals and vision</p>
          </header>
          
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; font-weight: 600; color: #1F2937; margin-bottom: 20px;">Primary Goals</h2>
            <div style="background: #F9FAFB; padding: 30px; border-radius: 12px; border-left: 6px solid ${baseStyles.headerColor};">
              <p style="font-size: 16px; line-height: 1.7; color: #374151; margin: 0;">
                Our primary objective is to deliver exceptional {{serviceInterested}} services that align with {{clientName}}'s business goals. 
                We aim to create innovative solutions that drive growth, enhance user experience, and establish a strong digital presence.
              </p>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div>
              <h3 style="font-size: 20px; font-weight: 600; color: #1F2937; margin-bottom: 16px;">Key Objectives</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #374151;">✓ Enhance digital presence</li>
                <li style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #374151;">✓ Improve user engagement</li>
                <li style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #374151;">✓ Increase conversion rates</li>
                <li style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #374151;">✓ Build brand recognition</li>
              </ul>
            </div>
            
            <div>
              <h3 style="font-size: 20px; font-weight: 600; color: #1F2937; margin-bottom: 16px;">Success Metrics</h3>
              <div style="background: #EFF6FF; padding: 20px; border-radius: 8px;">
                <p style="font-size: 14px; color: #1F2937; margin: 8px 0;">📈 Increased traffic by 150%</p>
                <p style="font-size: 14px; color: #1F2937; margin: 8px 0;">🎯 Improved engagement by 80%</p>
                <p style="font-size: 14px; color: #1F2937; margin: 8px 0;">💼 Enhanced conversion by 60%</p>
                <p style="font-size: 14px; color: #1F2937; margin: 8px 0;">⭐ Better user satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'scope',
      title: 'Scope of Deliverables',
      pageType: 'scope',
      order: 3,
      isEditable: true,
      styles: baseStyles,
      content: `
        <div style="width: 210mm; height: 297mm; padding: 30mm; font-family: ${baseStyles.fontFamily}; background: white;">
          <header style="border-bottom: 3px solid ${baseStyles.headerColor}; padding-bottom: 20px; margin-bottom: 40px;">
            <h1 style="font-size: 36px; font-weight: 700; color: ${baseStyles.headerColor}; margin: 0;">Scope of Deliverables</h1>
            <p style="font-size: 16px; color: #6B7280; margin: 10px 0 0 0;">Comprehensive service breakdown</p>
          </header>
          
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; font-weight: 600; color: #1F2937; margin-bottom: 20px;">${team} Services</h2>
            <div style="background: #F3F4F6; padding: 30px; border-radius: 12px;">
              <p style="font-size: 16px; line-height: 1.7; color: #374151; margin: 0 0 20px 0;">
                Our ${team} specializes in delivering high-quality {{serviceInterested}} solutions tailored to your specific needs.
              </p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <h4 style="font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 12px;">Core Deliverables</h4>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 8px 0; font-size: 14px; color: #374151;">• Strategic planning & research</li>
                    <li style="padding: 8px 0; font-size: 14px; color: #374151;">• Creative design & development</li>
                    <li style="padding: 8px 0; font-size: 14px; color: #374151;">• Implementation & testing</li>
                    <li style="padding: 8px 0; font-size: 14px; color: #374151;">• Launch & optimization</li>
                  </ul>
                </div>
                
                <div>
                  <h4 style="font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 12px;">Additional Services</h4>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 8px 0; font-size: 14px; color: #374151;">• Performance monitoring</li>
                    <li style="padding: 8px 0; font-size: 14px; color: #374151;">• Regular maintenance</li>
                    <li style="padding: 8px 0; font-size: 14px; color: #374151;">• Training & support</li>
                    <li style="padding: 8px 0; font-size: 14px; color: #374151;">• Documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: #EFF6FF; border: 2px solid ${baseStyles.headerColor}; border-radius: 12px; padding: 20px;">
            <h3 style="font-size: 18px; font-weight: 600; color: ${baseStyles.headerColor}; margin: 0 0 10px 0;">Project Investment</h3>
            <div style="font-size: 32px; font-weight: 700; color: #1F2937;">{{currency}} {{amount}}</div>
            <p style="font-size: 14px; color: #6B7280; margin: 5px 0;">Total project cost including all deliverables</p>
          </div>
        </div>
      `
    },
    {
      id: 'commercials',
      title: 'Commercial Terms',
      pageType: 'commercials',
      order: 4,
      isEditable: true,
      styles: baseStyles,
      content: `
        <div style="width: 210mm; height: 297mm; padding: 30mm; font-family: ${baseStyles.fontFamily}; background: white;">
          <header style="border-bottom: 3px solid ${baseStyles.headerColor}; padding-bottom: 20px; margin-bottom: 40px;">
            <h1 style="font-size: 36px; font-weight: 700; color: ${baseStyles.headerColor}; margin: 0;">Commercial Terms</h1>
            <p style="font-size: 16px; color: #6B7280; margin: 10px 0 0 0;">Investment and payment structure</p>
          </header>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
            <div style="background: #F9FAFB; padding: 25px; border-radius: 12px;">
              <h3 style="font-size: 20px; font-weight: 600; color: #1F2937; margin: 0 0 15px 0;">Total Investment</h3>
              <div style="font-size: 36px; font-weight: 800; color: ${baseStyles.headerColor}; margin-bottom: 10px;">{{currency}} {{amount}}</div>
              <p style="font-size: 14px; color: #6B7280;">All-inclusive project cost</p>
            </div>
            
            <div style="background: #F3F4F6; padding: 25px; border-radius: 12px;">
              <h3 style="font-size: 20px; font-weight: 600; color: #1F2937; margin: 0 0 15px 0;">Payment Terms</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; font-size: 14px; color: #374151;">📝 50% - Project kickoff</li>
                <li style="padding: 8px 0; font-size: 14px; color: #374151;">🎨 30% - Design approval</li>
                <li style="padding: 8px 0; font-size: 14px; color: #374151;">🚀 20% - Project delivery</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #FEFEFE; border: 1px solid #E5E7EB; padding: 30px; border-radius: 12px;">
            <h3 style="font-size: 20px; font-weight: 600; color: #1F2937; margin: 0 0 20px 0;">What's Included</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 10px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6;">✅ Complete project development</li>
                <li style="padding: 10px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6;">✅ Quality assurance testing</li>
                <li style="padding: 10px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6;">✅ 30 days post-launch support</li>
              </ul>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 10px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6;">✅ Training documentation</li>
                <li style="padding: 10px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6;">✅ Performance optimization</li>
                <li style="padding: 10px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F3F4F6;">✅ Source code delivery</li>
              </ul>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'timeline',
      title: 'Timeline & Delivery',
      pageType: 'timeline',
      order: 5,
      isEditable: true,
      styles: baseStyles,
      content: `
        <div style="width: 210mm; height: 297mm; padding: 30mm; font-family: ${baseStyles.fontFamily}; background: white;">
          <header style="border-bottom: 3px solid ${baseStyles.headerColor}; padding-bottom: 20px; margin-bottom: 40px;">
            <h1 style="font-size: 36px; font-weight: 700; color: ${baseStyles.headerColor}; margin: 0;">Timeline & Delivery</h1>
            <p style="font-size: 16px; color: #6B7280; margin: 10px 0 0 0;">Project milestones and delivery schedule</p>
          </header>
          
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; font-weight: 600; color: #1F2937; margin-bottom: 25px;">Project Timeline</h2>
            
            <div style="position: relative;">
              <div style="position: absolute; left: 20px; top: 0; bottom: 0; width: 2px; background: ${baseStyles.headerColor};"></div>
              
              <div style="margin-bottom: 30px; position: relative; padding-left: 50px;">
                <div style="position: absolute; left: 11px; top: 8px; width: 18px; height: 18px; background: ${baseStyles.headerColor}; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px ${baseStyles.headerColor};"></div>
                <h4 style="font-size: 16px; font-weight: 600; color: #1F2937; margin: 0 0 5px 0;">Week 1-2: Discovery & Planning</h4>
                <p style="font-size: 14px; color: #6B7280; margin: 0;">Requirements gathering, research, and project planning</p>
              </div>
              
              <div style="margin-bottom: 30px; position: relative; padding-left: 50px;">
                <div style="position: absolute; left: 11px; top: 8px; width: 18px; height: 18px; background: ${baseStyles.headerColor}; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px ${baseStyles.headerColor};"></div>
                <h4 style="font-size: 16px; font-weight: 600; color: #1F2937; margin: 0 0 5px 0;">Week 3-4: Design & Prototyping</h4>
                <p style="font-size: 14px; color: #6B7280; margin: 0;">Creating wireframes, designs, and interactive prototypes</p>
              </div>
              
              <div style="margin-bottom: 30px; position: relative; padding-left: 50px;">
                <div style="position: absolute; left: 11px; top: 8px; width: 18px; height: 18px; background: ${baseStyles.headerColor}; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px ${baseStyles.headerColor};"></div>
                <h4 style="font-size: 16px; font-weight: 600; color: #1F2937; margin: 0 0 5px 0;">Week 5-8: Development</h4>
                <p style="font-size: 14px; color: #6B7280; margin: 0;">Core development, feature implementation, and integration</p>
              </div>
              
              <div style="margin-bottom: 30px; position: relative; padding-left: 50px;">
                <div style="position: absolute; left: 11px; top: 8px; width: 18px; height: 18px; background: ${baseStyles.headerColor}; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px ${baseStyles.headerColor};"></div>
                <h4 style="font-size: 16px; font-weight: 600; color: #1F2937; margin: 0 0 5px 0;">Week 9-10: Testing & Launch</h4>
                <p style="font-size: 14px; color: #6B7280; margin: 0;">Quality assurance, final testing, and deployment</p>
              </div>
            </div>
          </div>
          
          <div style="background: #F0F9FF; border-left: 4px solid ${baseStyles.headerColor}; padding: 20px; border-radius: 8px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #1F2937; margin: 0 0 10px 0;">🎯 Delivery Commitment</h3>
            <p style="font-size: 14px; color: #374151; margin: 0;">We're committed to delivering your project on time and exceeding your expectations. Regular updates and milestone reviews ensure transparency throughout the process.</p>
          </div>
        </div>
      `
    },
    {
      id: 'thankyou',
      title: 'Thank You & Next Steps',
      pageType: 'thankyou',
      order: 6,
      isEditable: true,
      styles: baseStyles,
      content: `
        <div style="width: 210mm; height: 297mm; padding: 40mm; font-family: ${baseStyles.fontFamily}; background: white; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="text-align: center;">
            <h1 style="font-size: 48px; font-weight: 800; color: ${baseStyles.headerColor}; margin-bottom: 30px;">Thank You</h1>
            <p style="font-size: 20px; color: #6B7280; line-height: 1.6; margin-bottom: 40px;">
              We're excited about the opportunity to work with {{clientName}} and bring your vision to life.
            </p>
            
            <div style="background: #F9FAFB; padding: 30px; border-radius: 16px; margin: 40px 0;">
              <h2 style="font-size: 24px; font-weight: 600; color: #1F2937; margin-bottom: 20px;">Next Steps</h2>
              <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                <div style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="width: 30px; height: 30px; background: ${baseStyles.headerColor}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 15px;">1</span>
                  <span style="font-size: 16px; color: #374151;">Review and approve proposal</span>
                </div>
                <div style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="width: 30px; height: 30px; background: ${baseStyles.headerColor}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 15px;">2</span>
                  <span style="font-size: 16px; color: #374151;">Sign project agreement</span>
                </div>
                <div style="margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="width: 30px; height: 30px; background: ${baseStyles.headerColor}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 15px;">3</span>
                  <span style="font-size: 16px; color: #374151;">Project kickoff meeting</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style="border-top: 2px solid #E5E7EB; padding-top: 30px; text-align: center;">
            <h3 style="font-size: 24px; font-weight: 600; color: #1F2937; margin-bottom: 15px;">Contact Information</h3>
            <div style="font-size: 16px; color: #6B7280; line-height: 1.6;">
              <p style="font-size: 18px; font-weight: 600; color: ${baseStyles.headerColor}; margin: 5px 0;">Marketlube Digital Marketing</p>
              <p style="font-size: 16px; color: #6B7280; margin: 5px 0;">Bangalore, India</p>
              <p style="font-size: 16px; color: ${baseStyles.headerColor}; margin: 5px 0; font-weight: 600;">contact@marketlube.com</p>
              <p style="font-size: 16px; color: ${baseStyles.headerColor}; margin: 5px 0; font-weight: 600;">+91 98765 43210</p>
            </div>
          </div>
        </div>
      `
    }
  ];
};

// Team Suggestion Function
const getSuggestedTeams = (serviceInterested: string): string[] => {
  const service = serviceInterested.toLowerCase();
  
  if (service.includes('web') || service.includes('development') || service.includes('app') || service.includes('software')) {
    return ['Development Team', 'UI/UX Team'];
  }
  if (service.includes('design') || service.includes('ui') || service.includes('ux') || service.includes('brand')) {
    return ['UI/UX Team', 'Development Team'];
  }
  if (service.includes('marketing') || service.includes('ads') || service.includes('campaign') || service.includes('ppc')) {
    return ['Performance Marketing', 'Social Media'];
  }
  if (service.includes('video') || service.includes('animation') || service.includes('motion') || service.includes('multimedia')) {
    return ['Video Production', 'UI/UX Team'];
  }
  if (service.includes('social') || service.includes('content') || service.includes('community')) {
    return ['Social Media', 'Performance Marketing'];
  }
  if (service.includes('test') || service.includes('qa') || service.includes('quality')) {
    return ['Testing / QA', 'Development Team'];
  }
  if (service.includes('seo') || service.includes('optimization') || service.includes('analytics')) {
    return ['Performance Marketing', 'Development Team'];
  }
  if (service.includes('ecommerce') || service.includes('e-commerce') || service.includes('shop')) {
    return ['Development Team', 'UI/UX Team', 'Performance Marketing'];
  }
  
  // Default suggestions
  return ['UI/UX Team', 'Development Team'];
};

// ProposalModal Component
interface ProposalModalProps {
  isOpen: boolean;
  proposal: Proposal | null;
  onClose: () => void;
  onSave: (proposal: Proposal) => void;
  onDelete: (proposalId: string) => void;
}

const ProposalModal: React.FC<ProposalModalProps> = memo(({ isOpen, proposal, onClose, onSave, onDelete }) => {
  const [editedProposal, setEditedProposal] = useState<Proposal | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'templates' | 'pages' | 'preview'>('details');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editingContent, setEditingContent] = useState('');
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const teams = ['All', 'UI/UX Team', 'Development Team', 'Performance Marketing', 'Video Production', 'Social Media', 'Testing / QA'];
  
  // Show only one template for now - Professional Clean for UI/UX Team
  const templates = useMemo(() => {
    const singleTemplate: ProposalTemplate = {
      id: 'uiux-professional',
      name: 'Professional Clean',
      description: 'Professional template for UI/UX Team',
      team: 'UI/UX Team',
      category: 'Professional',
      color: '#3B82F6',
      fontFamily: 'inter',
      icon: Layout,
      pages: createA4Pages('UI/UX Team', 'Professional Clean'),
      isPopular: true
    };
    
    return [singleTemplate];
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates; // Only one template for now
  }, [templates]);

  React.useEffect(() => {
    if (proposal) {
      setEditedProposal({ ...proposal });
    } else {
      const newProposal: Proposal = {
        id: Date.now().toString(),
        title: '',
        clientName: '',
        clientLocation: '',
        serviceInterested: '',
        website: '',
        contactNumber: '',
        amount: 0,
        currency: 'INR',
        status: 'draft',
        createdDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        templateId: '',
        templateName: '',
        templateTeam: '',
        description: '',
        tags: [],
        viewCount: 0,
        pages: [],
        designSettings: {
          theme: 'professional',
          primaryColor: '#3B82F6',
          fontSize: 'medium',
          fontFamily: 'inter',
          spacing: 'normal'
        }
      };
      setEditedProposal(newProposal);
    }
  }, [proposal]);

  const handleSave = useCallback(() => {
    if (editedProposal) {
      onSave(editedProposal);
    }
  }, [editedProposal, onSave]);

  const handleSelectTemplate = useCallback((template: ProposalTemplate) => {
    if (editedProposal) {
      setEditedProposal(prev => prev ? {
        ...prev,
        templateId: template.id,
        templateName: template.name,
        templateTeam: template.team,
        pages: template.pages,
        designSettings: {
          ...prev.designSettings,
          fontFamily: template.fontFamily,
          primaryColor: template.color
        }
      } : null);
    }
  }, [editedProposal]);

  // Fixed replaceVariables function with proper state management
  const replaceVariables = useCallback((content: string) => {
    if (!editedProposal) return content;
    
    let processedContent = content;
    
    // Only replace if we have actual values and the placeholders exist
    if (editedProposal.title && processedContent.includes('{{title}}')) {
      processedContent = processedContent.replace(/\{\{title\}\}/g, editedProposal.title);
    }
    if (editedProposal.clientName && processedContent.includes('{{clientName}}')) {
      processedContent = processedContent.replace(/\{\{clientName\}\}/g, editedProposal.clientName);
    }
    if (editedProposal.clientLocation && processedContent.includes('{{clientLocation}}')) {
      processedContent = processedContent.replace(/\{\{clientLocation\}\}/g, editedProposal.clientLocation);
    }
    if (editedProposal.serviceInterested && processedContent.includes('{{serviceInterested}}')) {
      processedContent = processedContent.replace(/\{\{serviceInterested\}\}/g, editedProposal.serviceInterested);
    }
    if (editedProposal.website && processedContent.includes('{{website}}')) {
      processedContent = processedContent.replace(/\{\{website\}\}/g, editedProposal.website);
    }
    if (editedProposal.contactNumber && processedContent.includes('{{contactNumber}}')) {
      processedContent = processedContent.replace(/\{\{contactNumber\}\}/g, editedProposal.contactNumber);
    }
    if (processedContent.includes('{{currency}}')) {
      processedContent = processedContent.replace(/\{\{currency\}\}/g, editedProposal.currency);
    }
    if (processedContent.includes('{{amount}}')) {
      processedContent = processedContent.replace(/\{\{amount\}\}/g, editedProposal.amount.toLocaleString());
    }
    
    return processedContent;
  }, [editedProposal]);

  // Rich text editing functions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (contentEditableRef.current) {
      setEditingContent(contentEditableRef.current.innerHTML);
    }
  };

  const startEditing = () => {
    if (editedProposal && editedProposal.pages[currentPageIndex]) {
      setEditingContent(editedProposal.pages[currentPageIndex].content);
      setIsEditingContent(true);
    }
  };

  const saveContent = () => {
    if (editedProposal && editingContent) {
      const updatedPages = [...editedProposal.pages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        content: editingContent
      };
      setEditedProposal({
        ...editedProposal,
        pages: updatedPages
      });
      setIsEditingContent(false);
    }
  };

  const cancelEditing = () => {
    setIsEditingContent(false);
    setEditingContent('');
  };

  if (!isOpen || !editedProposal) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {proposal ? 'Edit A4 Proposal' : 'Create A4 Proposal'}
              </h2>
                <p className="text-sm text-gray-500">
                  Professional 6-page proposal system
              </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6 bg-gray-50">
          <nav className="flex space-x-1">
            {[
              { id: 'details', label: 'Basic Info', icon: User },
              { id: 'templates', label: 'Templates', icon: Layout },
              { id: 'pages', label: 'Edit Pages', icon: Edit },
              { id: 'preview', label: 'Preview', icon: Eye }
            ].map(tab => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'border-blue-500 text-blue-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-50'
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proposal Title</label>
                  <input
                    type="text"
                    value={editedProposal.title}
                    onChange={(e) => setEditedProposal(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Website Redesign Project"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={editedProposal.clientName}
                    onChange={(e) => setEditedProposal(prev => prev ? { ...prev, clientName: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Client or Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editedProposal.clientLocation}
                    onChange={(e) => setEditedProposal(prev => prev ? { ...prev, clientLocation: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Interested</label>
                  <input
                    type="text"
                    value={editedProposal.serviceInterested}
                    onChange={(e) => setEditedProposal(prev => prev ? { ...prev, serviceInterested: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Web Development, Branding, etc."
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={editedProposal.website}
                    onChange={(e) => setEditedProposal(prev => prev ? { ...prev, website: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    value={editedProposal.contactNumber}
                    onChange={(e) => setEditedProposal(prev => prev ? { ...prev, contactNumber: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="flex gap-2">
                    <select
                      value={editedProposal.currency}
                      onChange={(e) => setEditedProposal(prev => prev ? { ...prev, currency: e.target.value } : null)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <input
                      type="number"
                      value={editedProposal.amount}
                      onChange={(e) => setEditedProposal(prev => prev ? { ...prev, amount: Number(e.target.value) } : null)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="150000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editedProposal.description}
                    onChange={(e) => setEditedProposal(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief project description..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
                <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    💡 New templates are coming soon, stay tuned!
                  </p>
                  {editedProposal.serviceInterested && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Suggested teams for "{editedProposal.serviceInterested}":</strong> {getSuggestedTeams(editedProposal.serviceInterested).join(', ')}
                    </p>
                  )}
                </div>
                  <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                  </select>
                </div>

              {/* Single Template Card - Smaller and Compact */}
              <div className="max-w-sm mx-auto">
                {filteredTemplates.map(template => {
                  const IconComponent = template.icon;
                  const isSelected = editedProposal.templateId === template.id;
                  const isSuggested = editedProposal.serviceInterested && 
                    getSuggestedTeams(editedProposal.serviceInterested).includes(template.team);
                  
                  return (
                    <div key={template.id} className="relative group">
                      {/* A4 Template Preview - Smaller */}
                      <div 
                        className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 relative ${
                          isSelected 
                            ? 'border-blue-500 shadow-lg' 
                            : isSuggested
                            ? 'border-green-300 hover:border-green-400 hover:shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        {/* Template Cover Preview - Reduced height */}
                        <div 
                          className="bg-white relative overflow-hidden"
                          style={{ height: '180px', width: '100%' }}
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <div 
                            className="absolute bg-white"
                            style={{ 
                              transform: 'scale(0.18)',
                              transformOrigin: 'top left',
                              width: '555%',
                              height: '555%',
                              top: 0,
                              left: 0,
                              maxHeight: '180px',
                              maxWidth: '100%'
                            }}
                            dangerouslySetInnerHTML={{ 
                              __html: replaceVariables(template.pages[0]?.content || '') 
                            }}
                          />
                          
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 z-10" />
                          
                          {/* Edit button on hover */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTemplate(template);
                                setActiveTab('pages');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg"
                              title="Edit Template"
                            >
                              <Edit3 size={14} />
                            </button>
                </div>
              </div>
                        
                        {/* Template Info - Compact */}
                        <div className="p-3 bg-gray-50 relative z-30">
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                              style={{ backgroundColor: template.color }}
                            >
                              <IconComponent size={12} />
                        </div>
                        <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-gray-900 text-sm">{template.name}</h4>
                            {template.isPopular && (
                                  <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-xs font-medium">
                                Popular
                              </span>
                            )}
                                {isSuggested && (
                                  <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-medium">
                                    Suggested
                              </span>
                            )}
                          </div>
                              <p className="text-xs text-gray-600">{template.team}</p>
                        </div>
                      </div>
                          <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                          
                          {/* Use Template Button - Compact */}
                          <button
                            onClick={() => handleSelectTemplate(template)}
                            className={`w-full px-2 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Use Template'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Selection Badge */}
                      {isSelected && (
                        <div className="absolute -top-2 -left-2">
                          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <CheckCircle size={14} />
                          </div>
                        </div>
                      )}
                      
                      {/* Suggestion Badge */}
                      {isSuggested && !isSelected && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <Star size={12} />
                      </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'pages' && editedProposal.pages.length > 0 && (
            <div className="flex gap-6 h-[70vh]">
              {/* Pages List - Left Side */}
              <div className="w-80 border border-gray-200 rounded-lg bg-gray-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Pages ({editedProposal.pages.length})</h3>
                  <p className="text-sm text-gray-600">Click to edit</p>
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 80px)' }}>
                  {editedProposal.pages.map((page, index) => (
                    <div
                      key={page.id}
                      onClick={() => setCurrentPageIndex(index)}
                      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                        currentPageIndex === index
                          ? 'bg-blue-50 border-l-4 border-l-blue-500'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium ${
                          currentPageIndex === index ? 'bg-blue-500' : 'bg-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{page.title}</h4>
                          <p className="text-xs text-gray-500 capitalize">{page.pageType}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Custom Page Button */}
                  <div className="p-4">
                    <button
                      onClick={() => {
                        // Add custom page functionality
                        const newPage: ProposalPage = {
                          id: `custom-${Date.now()}`,
                          title: 'Custom Page',
                          pageType: 'custom',
                          content: `
                            <div style="width: 210mm; height: 297mm; padding: 30mm; font-family: inter; background: white;">
                              <h1 style="font-size: 36px; font-weight: 700; color: #3B82F6; margin-bottom: 20px;">Custom Page</h1>
                              <p style="font-size: 16px; color: #374151;">Add your custom content here...</p>
                    </div>
                          `,
                          order: editedProposal.pages.length + 1,
                          isEditable: true,
                          styles: {
                            fontFamily: 'inter',
                            fontSize: 14,
                            textColor: '#1F2937',
                            backgroundColor: '#FFFFFF',
                            headerColor: '#3B82F6'
                          }
                        };
                        setEditedProposal(prev => prev ? {
                          ...prev,
                          pages: [...prev.pages, newPage]
                        } : null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 border-dashed"
                    >
                      <PlusCircle size={16} />
                      Add Custom Page
                    </button>
                  </div>
                </div>
              </div>

              {/* A4 Content Preview/Editor - Right Side */}
              <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {editedProposal.pages[currentPageIndex]?.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Page {currentPageIndex + 1} of {editedProposal.pages.length} • A4 Size (210mm × 297mm)
                      </p>
                      </div>
                    <div className="flex items-center gap-2">
                      {!isEditingContent ? (
                        <button
                          onClick={startEditing}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                          <Edit3 size={16} />
                          Edit Content
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={saveContent}
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                          >
                            <Save size={16} />
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium"
                          >
                            Cancel
                          </button>
                    </div>
                      )}
                      <button
                        onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                        disabled={currentPageIndex === 0}
                        className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => setCurrentPageIndex(Math.min(editedProposal.pages.length - 1, currentPageIndex + 1))}
                        disabled={currentPageIndex === editedProposal.pages.length - 1}
                        className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100"
                        title="Print Page"
                      >
                        <Printer size={16} />
                      </button>
                  </div>
                </div>

                  {/* Rich Text Toolbar */}
                  {isEditingContent && (
                    <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          onClick={() => execCommand('bold')}
                          className="p-2 hover:bg-gray-100 rounded border"
                          title="Bold"
                        >
                          <Bold size={16} />
                        </button>
                        <button
                          onClick={() => execCommand('italic')}
                          className="p-2 hover:bg-gray-100 rounded border"
                          title="Italic"
                        >
                          <Italic size={16} />
                        </button>
                        <button
                          onClick={() => execCommand('underline')}
                          className="p-2 hover:bg-gray-100 rounded border"
                          title="Underline"
                        >
                          <Underline size={16} />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-2" />
                        <button
                          onClick={() => execCommand('justifyLeft')}
                          className="p-2 hover:bg-gray-100 rounded border"
                          title="Align Left"
                        >
                          <AlignLeft size={16} />
                        </button>
                        <button
                          onClick={() => execCommand('justifyCenter')}
                          className="p-2 hover:bg-gray-100 rounded border"
                          title="Center"
                        >
                          <AlignCenter size={16} />
                        </button>
                        <button
                          onClick={() => execCommand('justifyRight')}
                          className="p-2 hover:bg-gray-100 rounded border"
                          title="Align Right"
                        >
                          <AlignRight size={16} />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-2" />
                        <button
                          onClick={() => execCommand('insertUnorderedList')}
                          className="p-2 hover:bg-gray-100 rounded border"
                          title="Bullet List"
                        >
                          <List size={16} />
                        </button>
                        <button
                          onClick={() => execCommand('insertOrderedList')}
                          className="p-2 hover:bg-gray-100 rounded border"
                          title="Numbered List"
                        >
                          <ListOrdered size={16} />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-2" />
                        <select
                          onChange={(e) => execCommand('fontSize', e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded text-sm"
                        >
                          <option value="">Font Size</option>
                          <option value="1">8pt</option>
                          <option value="2">10pt</option>
                          <option value="3">12pt</option>
                          <option value="4">14pt</option>
                          <option value="5">18pt</option>
                          <option value="6">24pt</option>
                          <option value="7">36pt</option>
                        </select>
                        <select
                          onChange={(e) => execCommand('fontName', e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded text-sm"
                        >
                          <option value="">Font Family</option>
                          <option value="Inter">Inter</option>
                          <option value="Poppins">Poppins</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Playfair Display">Playfair Display</option>
                        </select>
                        <input
                          type="color"
                          onChange={(e) => execCommand('foreColor', e.target.value)}
                          className="w-8 h-8 border border-gray-200 rounded cursor-pointer"
                          title="Text Color"
                        />
                </div>
              </div>
                  )}
                </div>
                
                {/* A4 Preview/Editor */}
                <div className="p-4 bg-gray-100 overflow-auto" style={{ height: 'calc(70vh - 80px)' }}>
                  {!isEditingContent ? (
                    // Preview Mode
                    <div 
                      className="bg-white shadow-lg mx-auto"
                      style={{ 
                        width: '595px',
                        minHeight: '842px',
                        transform: 'scale(0.7)',
                        transformOrigin: 'top center',
                        marginBottom: '-200px'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: replaceVariables(editedProposal.pages[currentPageIndex]?.content || '') 
                      }}
                    />
                  ) : (
                    // Edit Mode
                    <div 
                      className="bg-white shadow-lg mx-auto border border-blue-300"
                      style={{ 
                        width: '595px',
                        minHeight: '842px',
                        transform: 'scale(0.7)',
                        transformOrigin: 'top center',
                        marginBottom: '-200px'
                      }}
                    >
                      <div
                        ref={contentEditableRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={() => {
                          if (contentEditableRef.current) {
                            setEditingContent(contentEditableRef.current.innerHTML);
                          }
                        }}
                        dangerouslySetInnerHTML={{ __html: editingContent }}
                        className="w-full h-full p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        style={{ minHeight: '842px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && editedProposal.pages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">A4 Proposal Preview</h3>
              <div className="space-y-8">
                {editedProposal.pages.map((page, index) => (
                  <div key={page.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">Page {index + 1}: {page.title}</h4>
                    </div>
                    <div 
                      className="bg-white overflow-auto"
                      style={{ minHeight: '400px' }}
                      dangerouslySetInnerHTML={{ __html: replaceVariables(page.content) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {proposal && (
              <button
                onClick={() => onDelete(proposal.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Delete Proposal
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!editedProposal.title || !editedProposal.clientName}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
            >
              {proposal ? 'Save Changes' : 'Create Proposal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const ProposalsPage: React.FC = memo(() => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Create default proposals with pages
  React.useEffect(() => {
    const defaultProposals: Proposal[] = [
    {
      id: '1',
        title: 'Website Redesign Project',
        clientName: 'TechCorp Solutions',
        clientLocation: 'Mumbai, Maharashtra',
        serviceInterested: 'Web Development',
        website: 'techcorp.com',
        contactNumber: '+91 98765 43210',
        amount: 150000,
        currency: 'INR',
        status: 'draft',
        createdDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        templateId: 'ui-ux-1',
        templateName: 'Professional Clean - UI/UX Team',
        templateTeam: 'UI/UX Team',
        description: 'Complete website redesign with modern UI/UX',
        tags: ['web design', 'ui/ux', 'responsive'],
        viewCount: 0,
        pages: createA4Pages('UI/UX Team', 'Professional Clean'),
        designSettings: {
          theme: 'professional',
          primaryColor: '#3B82F6',
          fontSize: 'medium',
          fontFamily: 'inter',
          spacing: 'normal'
        }
    },
    {
      id: '2',
        title: 'Brand Identity Design',
      clientName: 'StartupXYZ',
        clientLocation: 'Bangalore, Karnataka',
        serviceInterested: 'Branding & Design',
        website: 'startupxyz.in',
        contactNumber: '+91 87654 32109',
        amount: 80000,
        currency: 'INR',
      status: 'sent',
        createdDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        templateId: 'creative-1',
        templateName: 'Creative Bold - UI/UX Team',
        templateTeam: 'UI/UX Team',
        description: 'Complete brand identity and logo design',
        tags: ['branding', 'logo', 'identity'],
        viewCount: 3,
        pages: createA4Pages('UI/UX Team', 'Creative Bold'),
        designSettings: {
          theme: 'creative',
          primaryColor: '#8B5CF6',
          fontSize: 'medium',
          fontFamily: 'poppins',
          spacing: 'normal'
        }
      }
    ];
    setProposals(defaultProposals);
  }, []);

  const handleCreateProposal = () => {
    setSelectedProposal(null);
    setShowModal(true);
  };

  const handleEditProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);
  };

  const handleSaveProposal = (proposal: Proposal) => {
    if (selectedProposal) {
      setProposals(prev => prev.map(p => p.id === proposal.id ? proposal : p));
    } else {
      setProposals(prev => [...prev, proposal]);
    }
    setShowModal(false);
    setSelectedProposal(null);
  };

  const handleDeleteProposal = (proposalId: string) => {
    setProposals(prev => prev.filter(p => p.id !== proposalId));
  };

  const handleDownloadProposal = (proposal: Proposal) => {
    // Handle proposal download logic here
    console.log('Downloading proposal:', proposal.title);
    // You can implement PDF generation or download logic here
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-700',
      'sent': 'bg-blue-100 text-blue-700',
      'viewed': 'bg-yellow-100 text-yellow-700',
      'accepted': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700',
      'expired': 'bg-gray-100 text-gray-500'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'draft': <Edit3 size={12} />,
      'sent': <Send size={12} />,
      'viewed': <Eye size={12} />,
      'accepted': <CheckCircle size={12} />,
      'rejected': <X size={12} />,
      'expired': <Clock size={12} />
    };
    return icons[status as keyof typeof icons] || icons.draft;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-2xl font-bold text-gray-900">A4 Proposals</h1>
          <p className="text-gray-600">Professional proposal templates for each team</p>
          </div>
            <button
              onClick={handleCreateProposal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
          <Plus size={18} />
          Create A4 Proposal
            </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="viewed">Viewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          </select>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {proposals.map(proposal => (
          <div key={proposal.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(proposal.status)}`}>
                    {getStatusIcon(proposal.status)}
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </span>
              </div>

            <h3 className="font-semibold text-gray-900 mb-2 text-sm">{proposal.title}</h3>
            <p className="text-xs text-gray-600 mb-2">{proposal.clientName}</p>
            <p className="text-xs text-gray-500 mb-3">{proposal.templateTeam}</p>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-lg font-bold text-gray-900">
                  {proposal.currency} {proposal.amount.toLocaleString()}
                </p>
              <p className="text-xs text-gray-500">{proposal.pages.length} pages</p>
              </div>

            <div className="space-y-2">
              {/* Two main action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadProposal(proposal)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Download size={12} />
                  Download
                </button>
                <button
                  onClick={() => handleEditProposal(proposal)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Edit3 size={12} />
                  Edit
                </button>
              </div>
              {/* Delete button */}
              <div className="flex justify-center">
                        <button
                          onClick={() => handleDeleteProposal(proposal.id)}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                        >
                  <Trash2 size={12} />
                  Delete Proposal
                        </button>
                      </div>
          </div>
        </div>
          ))}
        </div>

      {/* A4 Proposal Modal */}
      {showModal && (
      <ProposalModal
        isOpen={showModal}
        proposal={selectedProposal}
          onClose={() => setShowModal(false)}
        onSave={handleSaveProposal}
        onDelete={handleDeleteProposal}
      />
      )}
    </div>
  );
});

export default ProposalsPage;