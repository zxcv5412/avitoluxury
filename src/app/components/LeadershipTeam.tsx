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

const defaultLeaders: Leader[] = [
  {
    _id: '2',
    name: 'Mr. Naresh Dadhich',
    title: 'Managing Director & CEO',
    position: 'ceo',
    image: '/NARESH DADHICH.jpeg.jpg',
    bio: "Naresh Dadhich is the Managing Director and CEO of AVITO. He has over twelve years of experience in the fragrance industry. His goal for AVITO is simple: world-class perfumes made for the Indian market, in line with the Make in India vision.\n\nHe knows this market well, from distribution networks to regional tastes to what Indian customers actually look for. He also has a background in the hotel industry, retail and supply chain management, which helps him run the business end to end.\n\nHis main focus is Tier 2 and Tier 3 cities, which most brands ignore. He wants to bring internationally concentrated perfume oils to these cities at prices ordinary Indian households can afford."
  },
  {
    _id: '3',
    name: 'Ms. Gayatri Soni',
    title: 'Chief Human Resources Officer (CHRO)',
    position: 'chro',
    image: '/GAYATRI SONI.jpeg.jpg',
    bio: "Gayatri Soni is the Chief Human Resources Officer at AVITO. She has over eleven years of experience in institutional administration and people management, and holds a postgraduate degree in Business Administration.\n\nShe has spent her career working closely with teams, running administrative operations and building well-organised workplaces. At AVITO, she looks after HR policies, recruitment, employee development and the processes that keep the company running smoothly as it grows.\n\nShe believes every successful organisation is built on capable, motivated people. Her job is to make AVITO a place where those people can learn, contribute and grow."
  },
  {
    _id: '4',
    name: 'Mr. Chinesh Soni',
    title: 'Chief Operating Officer (COO)',
    position: 'coo',
    image: '/CHINESH.jpeg.jpg',
    bio: "Chinesh Soni is the COO of AVITO. He runs the company's digital side: the website, marketplace operations, product listings, catalogue management, digital optimisation and online logistics. His job is to keep all of it running smoothly and growing.\n\nHe holds a BCA degree and sits between tech and business. He likes building simple systems, cleaning up workflows and using technology to get more done with less effort.\n\nHe is a full-stack web developer and an AI enthusiast too. He builds web apps and AI-powered tools that automate work, save time and make businesses more efficient. Because he understands both the tech and the business, he can turn ideas into solutions that work in the real world.\n\nOutside AVITO, Chinesh is a content creator and strategist. He also works with other creators on their content strategy and helps them grow their presence online."
  }
];

export default function LeadershipTeam() {
  const [leaders, setLeaders] = useState<Leader[]>(defaultLeaders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch('/api/leadership');
        if (!response.ok) {
          throw new Error('Failed to fetch leadership data');
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setLeaders(data);
        }
      } catch (err) {
        console.error('Error fetching leadership data:', err);
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