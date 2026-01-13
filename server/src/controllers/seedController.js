import mongoose from 'mongoose';
import User from '../models/User.js';
import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';

// Sample data
const sampleUsers = [
  {
    username: 'techstartup_co',
    email: 'contact@techstartup.com',
    password: 'password123',
    role: 'client'
  },
  {
    username: 'designstudio',
    email: 'hello@designstudio.io',
    password: 'password123',
    role: 'client'
  },
  {
    username: 'ecommerce_pro',
    email: 'info@ecommercepro.com',
    password: 'password123',
    role: 'client'
  }
];

const sampleGigs = [
  {
    title: "Modern Website Redesign for Tech Startup",
    description: "We need a complete website redesign for our SaaS platform. Looking for a talented designer/developer who can create a modern, responsive website with clean UI/UX. Must have experience with React and TailwindCSS. The site should be fast, mobile-friendly, and conversion-optimized.",
    budget: 2500,
    status: "open"
  },
  {
    title: "Logo Design & Brand Identity Package",
    description: "Seeking a creative designer to develop a complete brand identity for our new fintech company. This includes logo design, color palette, typography, and brand guidelines. We're looking for something modern, professional, and memorable that stands out in the financial services industry.",
    budget: 1200,
    status: "open"
  },
  {
    title: "E-commerce Mobile App Development",
    description: "Looking for an experienced mobile app developer to build an iOS and Android e-commerce app. Features needed: product catalog, shopping cart, payment integration, user authentication, order tracking. Must have experience with React Native or Flutter.",
    budget: 5000,
    status: "open"
  },
  {
    title: "Content Writing for Tech Blog",
    description: "Need a skilled technical writer to create 10 high-quality blog posts about web development, cloud computing, and DevOps. Each article should be 1500-2000 words, SEO-optimized, and include code examples. Target audience: developers and tech professionals.",
    budget: 800,
    status: "open"
  },
  {
    title: "Social Media Marketing Campaign",
    description: "We're launching a new product and need an experienced social media marketer to run a 3-month campaign across Instagram, Twitter, and LinkedIn. Responsibilities include content creation, community management, paid ads, and analytics reporting.",
    budget: 2000,
    status: "open"
  },
  {
    title: "Video Editing for YouTube Channel",
    description: "Looking for a video editor to edit 4 videos per month for our tech review YouTube channel. Each video is 10-15 minutes. Need engaging cuts, transitions, graphics, and thumbnails. Must have experience with Premiere Pro or Final Cut Pro.",
    budget: 600,
    status: "open"
  },
  {
    title: "Full-Stack Web Application",
    description: "Need a full-stack developer to build a project management tool with features like task tracking, team collaboration, file sharing, and analytics dashboard. Tech stack: Node.js, React, PostgreSQL. Timeline: 2-3 months.",
    budget: 8000,
    status: "open"
  },
  {
    title: "UI/UX Design for Mobile Banking App",
    description: "Seeking a senior UI/UX designer to create wireframes, mockups, and prototypes for a mobile banking application. Must follow banking industry best practices for security and user experience. Deliverables include design system and interactive prototypes.",
    budget: 3500,
    status: "open"
  },
  {
    title: "SEO Audit & Optimization",
    description: "Need an SEO expert to audit our website and implement improvements. This includes keyword research, on-page optimization, technical SEO fixes, content recommendations, and link building strategy. Must provide detailed reports and recommendations.",
    budget: 1500,
    status: "open"
  },
  {
    title: "WordPress Website Development",
    description: "Need a WordPress developer to build a corporate website with custom theme. Requirements: responsive design, contact forms, blog section, portfolio gallery, and integration with CRM. Should be fast, secure, and SEO-friendly.",
    budget: 1800,
    status: "open"
  }
];

const sampleBids = [
  {
    message: "I have 5+ years of experience in web development and have completed similar projects. I can deliver this project within the agreed timeline with high quality.",
    price: 2200,
    status: "pending"
  },
  {
    message: "I'm a freelance designer specializing in modern, clean designs. I've worked with several startups and can provide you with a design that converts.",
    price: 1100,
    status: "pending"
  },
  {
    message: "Full-stack developer here. I can build this for you using React Native, ensuring both iOS and Android versions are polished and performant.",
    price: 4800,
    status: "pending"
  },
  {
    message: "Experienced technical writer with a background in software development. I can write engaging, SEO-optimized content that developers love to read.",
    price: 750,
    status: "pending"
  }
];

// @desc    Seed database with sample data
// @route   POST /api/seed
// @access  Private (protected by secret key)
export const seedDatabase = async (req, res) => {
  try {
    // Simple protection: check for secret key in environment or query param
    const secretKey = req.query.key || req.body.key;
    const expectedKey = process.env.SEED_SECRET_KEY || 'seed-me-production-2026';
    
    if (secretKey !== expectedKey) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Invalid seed key.'
      });
    }

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Gig.deleteMany({});
    await Bid.deleteMany({});

    // Create users
    console.log('Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Get clients (all users are clients in this seed)
    const clients = createdUsers.filter(u => u.role === 'client');

    // Create gigs
    console.log('Creating gigs...');
    const createdGigs = [];
    for (let i = 0; i < sampleGigs.length; i++) {
      const gigData = {
        ...sampleGigs[i],
        ownerId: clients[i % clients.length]._id
      };
      const gig = await Gig.create(gigData);
      createdGigs.push(gig);
    }
    console.log(`Created ${createdGigs.length} gigs`);

    // For bids, we need some freelancer users
    // Since we only have clients, we'll skip bids or create them from clients
    // For simplicity, let's skip bids in the seed endpoint

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: createdUsers.length,
        gigs: createdGigs.length,
        bids: 0
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error seeding database'
    });
  }
};
