// src/pages/Dashboard/LoyaltyRewards.jsx
import { useNavigate } from 'react-router-dom';

const LoyaltyRewards = () => {
  const navigate = useNavigate();

  const rewards = [
    { id: 1, title: 'Free Minimalist Nail Art', points: 200, desc: 'Add subtle French tips or cute lines to your next set.' },
    { id: 2, title: 'Paraffin Wax Treatment', points: 350, desc: 'Intense moisture therapy for silky smooth hands.' },
    { id: 3, title: '$20 Off Any Full Set', points: 500, desc: 'Discount applicable on Gel-X or Acrylic Extensions.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <button onClick={() => navigate('/account')} className="text-sm text-[#4A3B32] mb-6 hover:text-[#2B1E16]">&larr; Back to Dashboard</button>
      
      <div className="bg-gradient-to-r from-[#2B1E16] to-[#4A3B32] text-[#FAF8F5] rounded-3xl p-8 mb-10 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FAF8F5]/70 block mb-1">NailMuse Club Rewards</span>
          <h1 className="text-3xl font-serif mb-2">Gold Member Tier</h1>
          <p className="text-sm text-[#FAF8F5]/85">You have <span className="font-bold text-amber-300">450 Points</span> available to redeem.</p>
        </div>
        <button className="bg-[#FAF8F5] text-[#2B1E16] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white shadow-md">
          Buy Gift Card 🎁
        </button>
      </div>

      <h2 className="text-2xl font-serif text-[#2B1E16] mb-6">Available Rewards</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {rewards.map(item => (
          <div key={item.id} className="bg-white border border-[#F0EBE1] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="bg-[#FAF8F5] text-[#2B1E16] text-xs font-bold px-3 py-1 rounded-full border border-[#F0EBE1]">{item.points} Pts</span>
              </div>
              <h3 className="text-xl font-serif text-[#2B1E16] mb-2">{item.title}</h3>
              <p className="text-sm text-[#4A3B32] mb-6">{item.desc}</p>
            </div>
            <button 
              onClick={() => alert(`Successfully redeemed ${item.title}!`)}
              className="w-full py-2.5 bg-[#2B1E16] text-[#FAF8F5] rounded-xl text-sm font-medium hover:bg-[#4A3B32] transition-colors"
            >
              Redeem Reward
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoyaltyRewards;