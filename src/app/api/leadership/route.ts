import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import Leadership from '@/app/models/Leadership';

const updatedBios: Record<string, string> = {
  ceo: "Naresh Dadhich is the Managing Director and CEO of AVITO. He has over twelve years of experience in the fragrance industry. His goal for AVITO is simple: world-class perfumes made for the Indian market, in line with the Make in India vision.\n\nHe knows this market well, from distribution networks to regional tastes to what Indian customers actually look for. He also has a background in the hotel industry, retail and supply chain management, which helps him run the business end to end.\n\nHis main focus is Tier 2 and Tier 3 cities, which most brands ignore. He wants to bring internationally concentrated perfume oils to these cities at prices ordinary Indian households can afford.",
  chro: "Gayatri Soni is the Chief Human Resources Officer at AVITO. She has over eleven years of experience in institutional administration and people management, and holds a postgraduate degree in Business Administration.\n\nShe has spent her career working closely with teams, running administrative operations and building well-organised workplaces. At AVITO, she looks after HR policies, recruitment, employee development and the processes that keep the company running smoothly as it grows.\n\nShe believes every successful organisation is built on capable, motivated people. Her job is to make AVITO a place where those people can learn, contribute and grow.",
  coo: "Chinesh Soni is the COO of AVITO. He runs the company's digital side: the website, marketplace operations, product listings, catalogue management, digital optimisation and online logistics. His job is to keep all of it running smoothly and growing.\n\nHe holds a BCA degree and sits between tech and business. He likes building simple systems, cleaning up workflows and using technology to get more done with less effort.\n\nHe is a full-stack web developer and an AI enthusiast too. He builds web apps and AI-powered tools that automate work, save time and make businesses more efficient. Because he understands both the tech and the business, he can turn ideas into solutions that work in the real world.\n\nOutside AVITO, Chinesh is a content creator and strategist. He also works with other creators on their content strategy and helps them grow their presence online."
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    for (const [position, bio] of Object.entries(updatedBios)) {
      await Leadership.updateMany(
        { position },
        { $set: { bio } }
      );
    }
    const leadership = await Leadership.find({});
    return NextResponse.json(leadership, { status: 200 });
  } catch (error) {
    console.error('Error fetching leadership data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch leadership data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();
    
    const leadership = await Leadership.create(body);
    return NextResponse.json(leadership, { status: 201 });
  } catch (error) {
    console.error('Error creating leadership data:', error);
    return NextResponse.json(
      { message: 'Failed to create leadership data' },
      { status: 500 }
    );
  }
} 