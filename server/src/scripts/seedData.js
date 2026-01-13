import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';

dotenv.config();

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
    title: "Data Analytics Dashboard Development",
    description: "Looking for a data analyst/developer to create an interactive analytics dashboard using Python and Tableau. The dashboard should visualize sales data, user behavior, and key performance metrics. Must be able to connect to our existing database.",
    budget: 2200,
    status: "open"
  },
  {
    title: "WordPress Website Development",
    description: "Need a WordPress developer to build a corporate website with custom theme. Requirements: responsive design, contact forms, blog section, portfolio gallery, and integration with CRM. Should be fast, secure, and SEO-friendly.",
    budget: 1800,
    status: "open"
  },
  {
    title: "Copywriting for Landing Pages",
    description: "Seeking a conversion-focused copywriter to write compelling copy for 5 landing pages. Each page targets a different product/service. Need persuasive headlines, benefit-driven content, and strong CTAs. A/B testing experience preferred.",
    budget: 1000,
    status: "open"
  }
];

const sampleUsers = [
  {
    username: "techstartup_co",
    email: "contact@techstartup.com",
    password: "demo123",
    role: "client"
  },
  {
    username: "designstudio",
    email: "hello@designstudio.io",
    password: "demo123",
    role: "client"
  },
  {
    username: "ecommerce_pro",
    email: "info@ecommercepro.com",
    password: "demo123",
    role: "client"
  },
  {
    username: "sarah_designer",
    email: "sarah@freelance.com",
    password: "demo123",
    role: "freelancer"
  },
  {
    username: "mike_dev",
    email: "mike@webdev.com",
    password: "demo123",
    role: "freelancer"
  },
  {
    username: "emma_writer",
    email: "emma@content.com",
    password: "demo123",
    role: "freelancer"
  },
  {
    username: "alex_marketing",
    email: "alex@marketing.com",
    password: "demo123",
    role: "freelancer"
  },
  {
    username: "james_video",
    email: "james@videoediting.com",
    password: "demo123",
    role: "freelancer"
  }
];

const sampleBids = [
  {
    message: "I have 5+ years of experience in web design and development. I've worked on similar projects for tech startups and can deliver a modern, responsive website within 3 weeks. My portfolio includes award-winning designs.",
    price: 2200
  },
  {
    message: "As a senior designer with expertise in brand identity, I can create a comprehensive brand package that will make your fintech company stand out. I'll deliver logo variations, color schemes, and complete brand guidelines.",
    price: 1100
  },
  {
    message: "Full-stack developer here with 7 years of experience. I've built 20+ mobile apps using React Native. I can deliver both iOS and Android versions with all requested features. Timeline: 6-8 weeks.",
    price: 4500
  },
  {
    message: "Technical writer specializing in developer content. I've written 100+ articles for major tech publications. I can deliver SEO-optimized, engaging content that your audience will love. Fast turnaround guaranteed.",
    price: 750
  },
  {
    message: "Social media expert with proven track record. I've grown multiple accounts from 0 to 100K+ followers. I'll create engaging content, manage your community, and run targeted ad campaigns to maximize ROI.",
    price: 1800
  },
  {
    message: "Professional video editor with 4 years of experience. I specialize in tech content and can create engaging, polished videos that keep viewers watching. Quick turnaround and unlimited revisions included.",
    price: 550
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Gig.deleteMany({});
    await Bid.deleteMany({});

    // Create users
    console.log('Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Separate clients and freelancers
    const clients = createdUsers.filter(u => u.role === 'client');
    const freelancers = createdUsers.filter(u => u.role === 'freelancer');

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

    // Create bids
    console.log('Creating bids...');
    let bidCount = 0;
    for (let i = 0; i < createdGigs.length; i++) {
      const gig = createdGigs[i];
      const gigOwner = clients.find(c => c._id.toString() === gig.ownerId.toString());
      
      // Add 2-4 bids per gig from different freelancers
      const numBids = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < numBids && j < freelancers.length; j++) {
        const freelancer = freelancers[j];
        const bidTemplate = sampleBids[j % sampleBids.length];
        const priceVariation = Math.floor(Math.random() * 200) - 100; // ±100 variation
        
        await Bid.create({
          gigId: gig._id,
          freelancerId: freelancer._id,
          message: bidTemplate.message,
          price: Math.max(100, bidTemplate.price + priceVariation),
          status: 'pending'
        });
        bidCount++;
      }
    }
    console.log(`Created ${bidCount} bids`);

    // Hire some freelancers (make some gigs assigned)
    console.log('Creating hired bids...');
    const gigsToHire = createdGigs.slice(0, 3); // Hire for first 3 gigs
    for (const gig of gigsToHire) {
      const bids = await Bid.find({ gigId: gig._id });
      if (bids.length > 0) {
        const hiredBid = bids[0];
        await Bid.findByIdAndUpdate(hiredBid._id, { status: 'hired' });
        await Bid.updateMany(
          { gigId: gig._id, _id: { $ne: hiredBid._id } },
          { status: 'rejected' }
        );
        await Gig.findByIdAndUpdate(gig._id, { status: 'assigned' });
      }
    }
    console.log('Hired freelancers for 3 gigs');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Accounts:');
    console.log('Clients:');
    clients.forEach(u => console.log(`  - ${u.username} / ${u.email} (password: demo123)`));
    console.log('\nFreelancers:');
    freelancers.forEach(u => console.log(`  - ${u.username} / ${u.email} (password: demo123)`));
    console.log('\n📊 Summary:');
    console.log(`  - ${createdUsers.length} users`);
    console.log(`  - ${createdGigs.length} gigs`);
    console.log(`  - ${bidCount} bids`);
    console.log(`  - 3 gigs with hired freelancers`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
