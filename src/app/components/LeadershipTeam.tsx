import { useState, useEffect } from 'react';
import LeadershipCard from './LeadershipCard';

interface Leader {
  _id: string;
  name: string;
  title: string;
  position: string;
  image: string;
  bio: string;
}

export default function LeadershipTeam() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch('/api/leadership');
        if (!response.ok) {
          throw new Error('Failed to fetch leadership data');
        }
        const data = await response.json();
        setLeaders(data);
      } catch (err) {
        console.error('Error fetching leadership data:', err);
        setError('Failed to load leadership team data. Please try again later.');
        // Fallback to hardcoded data if API fails
        setLeaders([
          {
            _id: '2',
            name: 'Mr. Naresh Dadhich',
            title: 'Managing Director & CEO',
            position: 'ceo',
            image: '/NARESH DADHICH.jpeg.jpg',
            bio: "Leadership Vision: Mr. Naresh Dadhich, Managing Director & CEO\nAt the helm of AVITO Perfume is Mr. Naresh Dadhich, a dynamic leader with over 12 years of experience in the fragrance industry. As Managing Director and CEO, he drives the brand's mission to deliver world-class perfumes tailored to the Indian market, aligning with the Make in India vision championed by our Honorable Prime Minister Mr. Narendra Modi.\n\nExpertise in Fragrance and Indian Market\nMr. Dadhich possesses an in-depth understanding of the Indian market, distribution networks, and customer preferences. His expertise ensures AVITO Perfume offers premium fragrances with international-level concentrations of perfume oils, providing an unmatched sensory experience at affordable prices.\n\nDiverse Industry Experience\nWith a robust background in the hotel industry, retail, and supply chain management, Mr. Dadhich brings a holistic approach to business. His knowledge enables AVITO Perfume to implement best-in-class practices, ensuring seamless delivery of high-quality fragrances to customers across India.\n\nCommitment to the Indian Consumer\nMr. Dadhich is dedicated to capturing the unserved segments of the Indian market like: Tier 2 & Tier 3 cities by offering world-class perfumes designed for Indian tastes and climates. His vision is to make luxury fragrances accessible to all, combining affordability with global standards of elegance and sophistication.\n\nDriving the Make in India Vision\nInspired by the Make in India initiative, Mr. Dadhich aims to elevate Indian perfumery to international standards. By focusing on high-quality fragrance oils and innovative production, AVITO Perfume contributes to India's growth as a global hub for premium fragrances.\n\nOur Promise\nUnder Mr. Dadhich's leadership, AVITO Perfume is committed to crafting exceptional fragrances that resonate with Indian consumers while delivering a world-class experience. We strive to redefine luxury by making it inclusive, affordable, and proudly Indian."
          },
          {
            _id: '3',
            name: 'Ms. Gayatri Soni',
            title: 'Chief Human Resources Officer (CHRO)',
            position: 'chro',
            image: '/GAYATRI SONI.jpeg.jpg',
            bio: "Ms. Gayatri Soni serves as the Chief Human Resources Officer (CHRO) at AVITO. She brings over 11 years of experience in institute administration and people management, along with a Postgraduate degree in Business Administration. Throughout her career, she has worked closely with teams, managed administrative operations, and contributed to building structured and efficient work environments. At AVITO, she oversees human resource policies, recruitment, employee development, and organizational processes, ensuring that the company's people practices support its long-term vision. She believes that every successful organization is built on capable and motivated individuals and is committed to creating a workplace where employees can learn, contribute, and grow. Her practical approach to leadership, combined with her administrative expertise, continues to strengthen AVITO's organizational culture and support the company's commitment to excellence."
          },
          {
            _id: '4',
            name: 'Mr. Chinesh Soni',
            title: 'Chief Operating Officer (COO)',
            position: 'coo',
            image: '/CHINESH.jpeg.jpg',
            bio: "Chief Operating Officer (COO): Mr. Chinesh Soni\n\nBCA Graduate | COO @ AVITO Luxury | Content Creator & Strategist | Full-Stack Web Developer\n\nMr. Chinesh Soni is the Chief Operating Officer of AVITO Luxury, where he leads the company's digital operations and business execution. He oversees the website, e-commerce platforms, marketplace operations, product listings, catalog optimization, and online logistics, ensuring seamless operations across AVITO's digital ecosystem while supporting the brand's continued growth.\n\nA Bachelor of Computer Applications (BCA) graduate, Mr. Chinesh combines technology with business to build efficient systems and scalable workflows. Alongside his role at AVITO, he is a content creator and strategist behind Mr.SaFFronYT, with a combined audience of over 50,000 subscribers across YouTube. He also works with fellow creators, helping them improve their content strategy and grow their channels through data-driven insights and practical experience.\n\nPassionate about technology, Mr. Chinesh is building AI-powered solutions as a full-stack web developer, with a focus on automation, modern web applications, and creating tools that improve business operations and user experiences."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Leadership Team</h2>
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (error && leaders.length === 0) {
    return (
      <div className="mt-20 mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Leadership Team</h2>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  // Filter out founder from display as requested, leaving exactly 3 leaders
  const visibleLeaders = leaders.filter(leader => leader.position !== 'founder');

  return (
    <div className="mt-20 mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">Our Leadership Team</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4 justify-items-center">
        {visibleLeaders.map((leader) => (
          <div key={leader._id} className="w-full max-w-[280px]">
            <LeadershipCard
              name={leader.name}
              title={leader.title}
              image={leader.image}
              bio={leader.bio}
            />
          </div>
        ))}
      </div>
    </div>
  );
}