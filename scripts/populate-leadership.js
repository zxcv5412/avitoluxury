const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
async function connectToDatabase() {
  try {
    // Use the MongoDB URI directly since .env file might not be available
    const MONGODB_URI = 'mongodb+srv://avitoluxury:l2AuSv97J5FW4ZvU@freetester.667mr8b.mongodb.net/ecommerce';

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define the Leadership schema
const LeadershipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    bio: { type: String, required: true },
  },
  { timestamps: true }
);

// Create or use existing model
const Leadership = mongoose.models.Leadership || mongoose.model('Leadership', LeadershipSchema);

// Leadership data
const leadershipData = [
  {
    name: 'Mr. Arvind Soni',
    title: 'Founder & Visionary',
    position: 'founder',
    image: '/ARVIND SONI.jpeg.jpg',
    bio: "Founder's Vision: Mr. Arvind Soni\nAVITO Perfume is the brainchild of Mr. Arvind Soni, a trailblazer in the fragrance industry with over 19 years of expertise and a legacy of perfume craftsmanship dating back to 1983. His passion for creating world-class fragrances has established AVITO as a beacon of elegance and innovation in the world of perfumery.\n\nExcellence in Fragrance Craftsmanship\nMr. Soni's mastery lies in crafting unique, long-lasting perfumes inspired by the sophistication of French scent artistry. Specializing in high-concentration perfume oils, he creates international-standard fragrances that blend elegant freshness with enduring essence, ensuring every scent leaves a lasting impression.\n\nComprehensive Business Expertise\nWith deep knowledge in retail, finance, and supply chain management, Mr. Soni ensures AVITO Perfume delivers exceptional quality at every stage. His holistic approach guarantees a seamless journey from sourcing premium ingredients to delivering luxurious fragrances to customers across India.\n\nCrafted for India, Inspired Globally\nAVITO Perfume is proud to serve India-wide, with scents thoughtfully designed to suit the country's diverse weather conditions and evolving trends. Our collections cater to all—men, women, and unisex preferences—offering affordable luxury without compromising on quality. Each fragrance is crafted to resonate with Indian sensibilities while maintaining a global standard of elegance.\n\nOur Commitment\nUnder Mr. Soni's visionary leadership, AVITO Perfume is dedicated to creating timeless, inclusive fragrances that celebrate individuality. Whether it's a bold masculine note, a delicate feminine essence, or a versatile unisex scent, our perfumes are designed to be accessible, enduring, and trendsetting for every Indian on affordable price with high quality ingredients.\n\nOur Legacy\nSince 1983, AVITO Perfume has carried forward a legacy of craftsmanship and innovation. With a commitment to affordability, diversity, and quality, we invite you to experience AVITO Perfume—where global artistry meets the heart of India in every bottle."
  },
  {
    name: 'Mr. Naresh Dadhich',
    title: 'Managing Director & CEO',
    position: 'ceo',
    image: '/NARESH DADHICH.jpeg.jpg',
    bio: "Leadership Vision: Mr. Naresh Dadhich, Managing Director & CEO\nAt the helm of AVITO Perfume is Mr. Naresh Dadhich, a dynamic leader with over 12 years of experience in the fragrance industry. As Managing Director and CEO, he drives the brand's mission to deliver world-class perfumes tailored to the Indian market, aligning with the Make in India vision championed by our Honorable Prime Minister Mr. Narendra Modi.\n\nExpertise in Fragrance and Indian Market\nMr. Dadhich possesses an in-depth understanding of the Indian market, distribution networks, and customer preferences. His expertise ensures AVITO Perfume offers premium fragrances with international-level concentrations of perfume oils, providing an unmatched sensory experience at affordable prices.\n\nDiverse Industry Experience\nWith a robust background in the hotel industry, retail, and supply chain management, Mr. Dadhich brings a holistic approach to business. His knowledge enables AVITO Perfume to implement best-in-class practices, ensuring seamless delivery of high-quality fragrances to customers across India.\n\nCommitment to the Indian Consumer\nMr. Dadhich is dedicated to capturing the unserved segments of the Indian market like: Tier 2 & Tier 3 cities by offering world-class perfumes designed for Indian tastes and climates. His vision is to make luxury fragrances accessible to all, combining affordability with global standards of elegance and sophistication.\n\nDriving the Make in India Vision\nInspired by the Make in India initiative, Mr. Dadhich aims to elevate Indian perfumery to international standards. By focusing on high-quality fragrance oils and innovative production, AVITO Perfume contributes to India's growth as a global hub for premium fragrances.\n\nOur Promise\nUnder Mr. Dadhich's leadership, AVITO Perfume is committed to crafting exceptional fragrances that resonate with Indian consumers while delivering a world-class experience. We strive to redefine luxury by making it inclusive, affordable, and proudly Indian."
  },
  {
    name: 'Ms. Gayatri Soni',
    title: 'Chief Human Resources Officer (CHRO)',
    position: 'chro',
    image: '/GAYATRI SONI.jpeg.jpg',
    bio: "Ms. Gayatri Soni serves as the Chief Human Resources Officer (CHRO) at AVITO. She brings over 11 years of experience in institute administration and people management, along with a Postgraduate degree in Business Administration. Throughout her career, she has worked closely with teams, managed administrative operations, and contributed to building structured and efficient work environments. At AVITO, she oversees human resource policies, recruitment, employee development, and organizational processes, ensuring that the company's people practices support its long-term vision. She believes that every successful organization is built on capable and motivated individuals and is committed to creating a workplace where employees can learn, contribute, and grow. Her practical approach to leadership, combined with her administrative expertise, continues to strengthen AVITO's organizational culture and support the company's commitment to excellence."
  },
  {
    name: 'Mr. Chinesh Soni',
    title: 'Chief Operating Officer (COO)',
    position: 'coo',
    image: '/CHINESH.jpeg.jpg',
    bio: "Chief Operating Officer (COO): Mr. Chinesh Soni\n\nBCA Graduate | COO @ AVITO Luxury | Content Creator & Strategist | Full-Stack Web Developer\n\nMr. Chinesh Soni is the Chief Operating Officer of AVITO Luxury, where he leads the company's digital operations and business execution. He oversees the website, e-commerce platforms, marketplace operations, product listings, catalog optimization, and online logistics, ensuring seamless operations across AVITO's digital ecosystem while supporting the brand's continued growth.\n\nA Bachelor of Computer Applications (BCA) graduate, Mr. Chinesh combines technology with business to build efficient systems and scalable workflows. Alongside his role at AVITO, he is a content creator and strategist behind Mr.SaFFronYT, with a combined audience of over 50,000 subscribers across YouTube. He also works with fellow creators, helping them improve their content strategy and grow their channels through data-driven insights and practical experience.\n\nPassionate about technology, Mr. Chinesh is building AI-powered solutions as a full-stack web developer, with a focus on automation, modern web applications, and creating tools that improve business operations and user experiences."
  }
];

// Populate the database
async function populateDatabase() {
  try {
    await connectToDatabase();

    // Clear existing data
    await Leadership.deleteMany({});
    console.log('Cleared existing leadership data');

    // Insert new data
    const result = await Leadership.insertMany(leadershipData);
    console.log(`Successfully inserted ${result.length} leadership records`);

    console.log('Database population completed successfully');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the population script
populateDatabase(); 