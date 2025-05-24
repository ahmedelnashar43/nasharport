import React from 'react';
import { ArrowRight, Image, ExternalLink } from 'lucide-react';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  // Handle missing image with a placeholder
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  // Pre-defined project links for specific projects
  const getProjectLink = () => {
    const projectLinks = {
      'beyti-lab-website': 'https://beytilab.vercel.app/',
      'beyti-lab-login': 'https://ahmedelnashar43.github.io/beyti-login-page-/',
      'beyti-lab-dashboard': 'https://beytisystem.vercel.app/'
    };
    
    return id ? projectLinks[id] || ProjectLink : ProjectLink;
  };

  // Use the correct project link
  const finalProjectLink = getProjectLink();

  return (
    <div className="group relative w-full">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
    
        <div className="relative p-5 z-10">
          <div className="relative overflow-hidden rounded-lg h-[180px] bg-slate-800">
            {Img ? (
              <iframe
                src={Img}
                title={Title}
                className="w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                onError={handleImageError}
              />
            ) : (
              <img
                src="/Photo.png"
                alt={Title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                onError={handleImageError}
              />
            )}
            <div className="hidden w-full h-full items-center justify-center bg-slate-800 text-gray-400 flex-col gap-2">
              <Image className="w-12 h-12 opacity-30" />
              <span className="text-sm opacity-50">Preview not available</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {Title}
            </h3>
            
            <p className="text-gray-300/80 text-sm leading-relaxed line-clamp-2">
              {Description}
            </p>
            
            <div className="pt-4 flex items-center justify-between">
              <span className="text-gray-500 text-sm italic">Demo Not Available</span>
              
              {finalProjectLink ? (
                <a
                  href={finalProjectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <span className="text-sm font-medium">Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-gray-500 text-sm">Not Available</span>
              )}
            </div>
          </div>
          
          <div className="absolute inset-0 border border-white/0 group-hover:border-purple-500/50 rounded-xl transition-colors duration-300 -z-50"></div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;