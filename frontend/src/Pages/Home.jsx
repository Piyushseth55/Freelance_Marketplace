import React from 'react'

const Home = () => {
  return (
    <div className=' bg-indigo-50'>
      {/* Hero Section */}
      <br />
      <section className=" text-black py-20 px-4 text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-purple-700 drop-shadow-md transition-transform duration-300 hover:scale-105">
          Empowering Freelancers Through Decentralization
        </h1>
        <p className="text-lg md:text-2xl mb-6 text-blue-600 hover:text-white transition-colors duration-300">
          Connect directly. Work freely. Get paid securely on the blockchain.
        </p>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 text-center border-blac">
        <h2 className="text-3xl font-bold mb-8 text-indigo-700">How It Works</h2>
        <div className="grid md:grid-cols-3  gap-8 max-w-5xl mx-auto text-black shadow-green-500">
          {[
            {
              title: "1. Connect Wallet",
              desc: "Login with MetaMask to join as freelancer or client.",
              iconColor: "bg-green-200",
            },
            {
              title: "2. Post or Browse Jobs",
              desc: "Clients post jobs. Freelancers send proposals with agents.",
              iconColor: "bg-green-200",
            },
            {
              title: "3. Smart Contract Payment",
              desc: "Secure, trustless payments using smart contracts.",
              iconColor: "bg-green-200",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl shadow-md p-6 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer ${item.iconColor}`}
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-800">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className=" py-16 px-4 text-center ">
        <h2 className="text-3xl font-bold mb-10 text-purple-700">Popular Categories</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {["Web Development", "Graphic Design", "Writing", "Blockchain"].map((category, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-2xl transition duration-300 transform hover:scale-105 cursor-pointer border-t-4 border-indigo-400"
            >
              <h3 className="text-lg font-semibold text-black">{category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Decentralization Benefits */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-extrabold mb-8  text-purple-700">Why Decentralized?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto  text-black shadow-amber-100">
          {[
            {
              title: "No Middlemen",
              desc: "More earnings for freelancers, fewer fees for clients.",
            },
            {
              title: "Transparent Reputation",
              desc: "On-chain feedback and ratings, verified for trust.",
            },
            {
              title: "Global Access",
              desc: "Work with anyone, anywhere, without restrictions.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white shadow hover:bg-blue-50 transition duration-300 transform hover:scale-105"
            >
              <h4 className="text-xl font-semibold mb-2 text-indigo-800">{item.title}</h4>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
